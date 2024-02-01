import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";

import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import {
  ODONTOGRAM_TYPE,
  printPdfBase64
} from "@shared/helpers";
import { OdontogramaService } from "@shared/services/odontograma.service";
import { Observable, Subject, forkJoin, from, of } from "rxjs";
import { concatMap, map, mergeMap, switchMap, takeUntil, toArray } from "rxjs/operators";
import { Engine } from "../files/core/engine";
import { OdontogramModalComponent } from "../odontogram-modal/odontogram-modal.component";

import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { jsPDF } from "jspdf";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "mapfre-odontogram-init",
  templateUrl: "./odontogram-init.component.html",
  styleUrls: ["./odontogram-init.component.scss"],
})
export class OdontogramInitComponent implements OnInit, OnDestroy {
  @ViewChildren("checkboxesDiagnostics")
  checkboxesDiagnostics: QueryList<ElementRef>;
  private unsubscribe$ = new Subject();
  @ViewChild("canvasRef") canvasRef!: ElementRef;
  @ViewChild("canvasPrintRef") canvasPrintRef!: ElementRef;
  version$: Observable<any>;
  versiones: any = [];
  version: any;
  primerValor: any = {};
  btnPermanente = true;
  leyendas: string;
  planTratamiento: string;
  observaciones: string;
  especificaciones: string;

  numeroConsulta: string;
  detalleConsulta: any;
  numeroHistoria: any;

  public width: number = 648;
  public height: number = 500;

  dataInicial: any = [];
  datosIniciales: any = [];

  private cx!: CanvasRenderingContext2D;
  private cxPrint!: CanvasRenderingContext2D;
  engine: any;

  diagnostico: any;
  hallazgo: any;
  dataOdontograma: any = {};
  odontologo = "";
  hide = false;
  isLoading = false;
  pdfBase64 = '';

  hallazgos: any;
  diagnosticos: any;
  procedimientos: any;
  paciente: any;

  constructor(
    private route: ActivatedRoute,
    private odontogramaService: OdontogramaService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private consultaMedService: ConsultaMedicaService
  ) {
    this.engine = new Engine(odontogramaService, dialog);
    this.numeroConsulta = this.route.snapshot.paramMap.get("numeroConsulta");
    this.detalleConsulta = this.odontogramaService.getData();
    this.numeroHistoria = this.detalleConsulta.historiaClinicaLocal;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.odontogramaService.cargarListaHallazgos(
      "S",
      "1",
      "10",
      "T"
    ).subscribe(hallazgos => {
      this.hallazgos = hallazgos
    });
    this.odontogramaService.cargarListaDiagnosticos(
      "S|",
      "1",
      "10",
      "T"
    ).subscribe(diagnosticos => {
      this.diagnosticos = diagnosticos
    });

    this.odontogramaService
      .versionOdontograma({
        tipoOdontograma: "1",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        codigoSede: this.detalleConsulta.codigoSede,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.versiones = data.data;
        this.primerValor = data.data[0];
        this.versionChanged(this.primerValor, true);
      });

    this.paciente = {
      sede: this.detalleConsulta.sede,
      numero_historia: this.detalleConsulta.historiaClinicaLocal,
      paciente: this.detalleConsulta.nombrePaciente,
      numero_consulta: this.detalleConsulta.numeroConsulta,
      fecha_consulta: this.detalleConsulta.fechaConsulta,
      odontologo: this.odontologo,
    };
    this.engine.loadPatientData(this.paciente);
  }

  private render(data: any, cargaInicial: boolean) {
    if(this.cx) this.cx.clearRect(0, 0, this.width, this.height);
    const canvasEl = this.canvasRef.nativeElement;
    const canvasPrintEl = this.canvasPrintRef.nativeElement;
    this.cx = canvasEl.getContext("2d");
    // this.cxPrint = canvasPrintEl.getContext("2d");
    // this.cx.clearRect(0, 0, this.width, this.height);
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    canvasPrintEl.width = this.width;
    canvasPrintEl.height = this.height;
    const dataArray = this.DrawOdontograma(data);
    this.engine.setCanvas(canvasEl);
    // this.engine.setCanvasPrint(canvasPrintEl);
    this.engine.init(0);
    this.hide = false;
    if (data.length > 0) {
      this.engine.setDataSource(dataArray);
      this.changeBtnColor(this.btnPermanente);
    }
    if (cargaInicial) {
      canvasEl.addEventListener(
        "mousedown",
        (event: any) => {
          if (this.primerValor.codigo === this.versiones[0].codigo) {
            if (!this.hallazgo) {
              this.toastr.warning(
                "Debe seleccionar un hallazgo!",
                "Mensaje del Sistema"
              );
              return;
            }
            this.engine.hallazgo = this.hallazgo;
            this.engine.onMouseClick(event);
          }
        },
        false
      );

      canvasEl.addEventListener(
        "mousemove",
        (event: any) => {
          this.engine.onMouseMove(event);
        },
        false
      );

      window.addEventListener(
        "keydown",
        (event: any) => {
          if (this.primerValor.codigo === this.versiones[0].codigo)
            this.engine.onButtonClick(event);
        },
        false
      );
    }
  }

  setDamage(id: any) {
    if (this.primerValor.codigo === this.versiones[0].codigo) {
      this.engine.setDamage(id);
    }
  }

  clearChecked() {
    this.hallazgos.map(data => {
      data.checked = false;
    })
    this.diagnosticos.map(data => {
      data.checked = false;
    })
    this.hallazgo.checked=false;
    this.diagnostico.checked=false;
  }

  clearDamage() {
    this.engine.setDamage(0);
  }

  isChecked(item, array, isHallazgo: boolean = false) {
    const itemChecked = array.find((f) => f.checked === true);

    if (itemChecked && item.codigo === itemChecked.codigo) {
      item.checked = false;
      this.clearDamage();
      if (isHallazgo) {
        this.hallazgo = null;
      } else {
        this.diagnostico = null;
      }
      return;
    }

    array.forEach((item) => {
      item.checked = false;
    });
    item.checked = true;

    let itemChecked2 = array.find((f) => f.checked === true);

    if (isHallazgo) {
      this.engine.resetMultiSelect();


      this.hallazgo = itemChecked2;
      item.checked ? this.setDamage(item.codigo) : this.clearDamage();
    } else {
      this.diagnostico = itemChecked2;
    }
  }

  DrawOdontograma(list: any) {
    const listArray = [];
    list.forEach(l => {
      const obj = {
        id: +l.tipoItemHallazgo > 0 ? l.codigoPiezaDentaria.toString() + l.tipoItemHallazgo.toString() : l.codigoPiezaDentaria,
        damages: l.codigoHallazgo,
        surfaces: l.codigoSuperficieDentaria,
        note: l.valorSigla1,
        note2: l.valorSigla2,
        note3: l.valorSigla3,
        state: l.estadoHallazgo,
        state2: l.estadoHallazgo2,
        state3: l.estadoHallazgo3,
        posicionHallazgo: l.posicionHallazgo,
        statetext: l.estadoHallazgo1,
        indicador: l.posicionHallazgo,
      }
      listArray.push(obj);
    });
    // list.map(l => {
    //   id: l.tipoItemHallazgo ? l.codigoPiezaDentaria.toString() + l.tipoItemHallazgo.toString() : l.codigoPiezaDentaria,
    //   damages: l.codigoHallazgo,
    //   surfaces: l.codigoSuperficieDentaria,
    //     note: l.valorSigla1,
    //     note2: l.valorSigla2,
    //     note3: l.valorSigla3,
    //     state: l.estadoHallazgo,
    //     state2: l.estadoHallazgo2,
    //     state3: l.estadoHallazgo3,
    //     posicionHallazgo,
    //     statetext,
    //     indicador,
    // });
    // const listArray = list.map(
    //   ({
    //     codigoPiezaDentaria: id,
    //     codigoHallazgo: damages,
    //     codigoSuperficieDentaria: surfaces,
    //     valorSigla1: note,
    //     valorSigla2: note2,
    //     valorSigla3: note3,
    //     estadoHallazgo: state,
    //     estadoHallazgo1: statetext,
    //     estadoHallazgo2: state2,
    //     estadoHallazgo3: state3,
    //     PHLLZGO: posicionHallazgo,
    //     posicionHallazgo: indicador,
    //     ...rest
    //   }) => ({
    //     id,
    //     damages,
    //     surfaces,
    //     note,
    //     note2,
    //     note3,
    //     state,
    //     state2,
    //     state3,
    //     posicionHallazgo,
    //     statetext,
    //     indicador,
    //   })
    // );
    this.dataInicial = listArray;
    // comma seperated string to pass to javascript engine
    let dataArray = "";

    // create string, for JavaScript Engine
    listArray.forEach((o: any) => {
      if (!o.note) {
        o.note = "";
      }

      dataArray +=
        +o.id +
        "," +
        o.damages +
        "," +
        o.surfaces +
        "," +
        o.note +
        "," +
        o.note2 +
        "," +
        o.note3 +
        "," +
        /**/

        o.direction +
        "," +
        o.statetext +
        "," +
        o.state2 +
        "," +
        o.state3 +
        "," +
        /**/

        o.state +
        "," +
        o.indicador +
        ",";
    });

    // remove last comma
    dataArray = dataArray.substring(0, dataArray.length - 1);

    return dataArray.replace(/undefined/g, "");
  }

  modalDiagnosticos() {
    const dialogRef = this.dialog.open(OdontogramModalComponent, {
      width: "600px",
      data: {
        title: "Diagnósticos (CIE10)",
        placeholder: "Buscar Diagnósticos",
        data: this.diagnosticos,
        tipo: ODONTOGRAM_TYPE.DIAGNOSTICOS,
      },
    });
    dialogRef.afterClosed().subscribe((diagnosticos) => {
      if (diagnosticos) {
        diagnosticos.data.forEach(element => {
          element.checked = false;
          this.diagnosticos.push(element)
        });
      }
    });
  }

  modalHallazgos() {
    const dialogRef = this.dialog.open(OdontogramModalComponent, {
      width: "600px",
      data: {
        title: ODONTOGRAM_TYPE.HALLAZGOS,
        placeholder: "Filtrar Hallazgos",
        data: this.hallazgos,
        tipo: ODONTOGRAM_TYPE.HALLAZGOS,
      },
    });
    dialogRef.afterClosed().subscribe((hallazgos) => {
      if (hallazgos) {
        hallazgos.data.forEach(element => {
          element.checked = false;
          this.hallazgos.push(element)
        });
      }
    });
  }

  modalProcedimientos() {
    const dialogRef = this.dialog.open(OdontogramModalComponent, {
      width: "600px",
      data: {
        title: ODONTOGRAM_TYPE.PROCEDIMIENTOS,
        placeholder: `Filtrar ${ODONTOGRAM_TYPE.PROCEDIMIENTOS}`,
        data: this.procedimientos,
        tipo: ODONTOGRAM_TYPE.PROCEDIMIENTOS,
      },
    });
    dialogRef.afterClosed().subscribe((procedimientos) => {
      if (procedimientos) {
        procedimientos.data.forEach(element => {
          element.checked = false;
          this.procedimientos.push(element)
        });
      }
    });
  }

  versionChanged(event: any, cargaInicial: boolean = false) {
    this.version = event;
    this.odontogramaService
      .getDataByVersionOdontogram({
        tipoOdontograma: "1",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        numeroItem: "",
        numeroVersion: event.codigo,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        const leyendas = data.data.map((dato) => dato.leyenda).filter(f => f !== '');
        const leyendasDistintas = Array.from(new Set(leyendas));
        this.leyendas = leyendasDistintas.join("\n");
        this.datosIniciales = data.data;
        this.clearCanvas();
        this.render(data.data, cargaInicial);
      });
      this.engine.loadPatientData(this.paciente);
    this.getDataBoxesByVersionOdontogram(event);
  }

  getDataBoxesByVersionOdontogram(event: any) {
    this.odontogramaService
      .getDataBoxesByVersionOdontogram({
        tipoOdontograma: "1",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        numeroVersion: event.codigo,
        codigoSede: this.detalleConsulta.codigoSede,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data.data && data.data.cursor.length > 0)
          this.dataOdontograma = data.data.cursor[0];
        const planTratamiento = data.data.cursor.map(
          (dato) => dato.planTratamiento
        );
        const planTratamientoDistintas = Array.from(new Set(planTratamiento));
        this.planTratamiento = planTratamientoDistintas.join("\n");

        const observaciones1 = data.data.cursor
          .map((dato) => dato.observaciones1)
          .filter((str: string) => str !== "");
        const observaciones2 = data.data.cursor
          .map((dato) => dato.observaciones2)
          .filter((str: string) => str !== "");
        const observaciones1Distintas = Array.from(new Set(observaciones1));
        const observaciones2Distintas = Array.from(new Set(observaciones2));
        this.observaciones = observaciones1Distintas
          .concat(observaciones2Distintas)
          .join("\n");

        const especificaciones1 = data.data.cursor
          .map((dato) => dato.especificaciones1)
          .filter((str: string) => str !== "");
        const especificaciones2 = data.data.cursor
          .map((dato) => dato.especificaciones2)
          .filter((str: string) => str !== "");
        const especificaciones1Distintas = Array.from(
          new Set(especificaciones1)
        );
        const especificaciones2Distintas = Array.from(
          new Set(especificaciones2)
        );
        this.especificaciones = especificaciones1Distintas
          .concat(especificaciones2Distintas)
          .join("\n");
        this.odontologo = data.data.cursor[0].nombreMedico;
      });
  }

  areObjectsEqual(obj1, obj2) {
    return obj1.codigo === obj2.codigo;
  }

  changeBtnColor(tipo: boolean) {
    this.btnPermanente = tipo;
    const miTipo = tipo ? "0" : "1";
    this.engine.changeView(miTipo);
  }

  async saveOdontogram() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.cloneCanvas(canvas);
    this.hide = true;
    this.engine.treatmentData.especificaciones = this.especificaciones;
    this.engine.treatmentData.observaciones = this.observaciones;
    this.engine.treatmentData.plan_tratamiento = this.planTratamiento;
    this.engine.treatmentData.odontologo = this.odontologo;
    this.engine.imprimirDocumento();
    this.isLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 1200));
    const pdf = new jsPDF();
    pdf.addImage(canvas, "JPEG", 50, 10, 110, 280);
    this.pdfBase64 = pdf.output("datauristring");

    const list = this.engine.getData();
    const listToRemove = this.dataInicial.filter(
      (item) =>
        !list.some((a) => +a.tooth === +item.id && +a.damage === +item.damages)
    );
    this.prepareDataForSaving(list);
    let tasks = [];

    list.map((m) => {
      localStorage.setItem('tooth', m.tooth.toString());
      tasks.push(
        {
          codigoDiagnostico: m.diagnostic,
          codigoHallazgo: m.damage,
          codigoPiezaDentaria: +m.tooth > 1000 ?  localStorage.getItem('tooth').slice(0, 2) : +m.tooth,
          codigoPiezaFinal: m.direction ? m.direction : this.getDirection(m.tooth, m.damage),
          codigoSede: this.detalleConsulta.codigoSede,
          codigoSuperficie: m.surface,
          especificaciones1: "",
          especificaciones2: "",
          estadoHallazgo: m.statetext,
          estadoHallazgo1: m.state,
          estadoHallazgo2: +m.state2,
          estadoHallazgo3: +m.state3,
          flag: m.active,
          posicionHallazgo: m.PHLLZGO,
          indicadorSigla1: 0,
          indicadorSigla2: 0,
          indicadorSigla3: 0,
          numeroHistoria: this.numeroHistoria,
          numeroVersion: this.version.codigo,
          obsPiezaDentaria: "",
          obsevaciones1: "",
          obsevaciones2: "",
          planTratamiento: "",
          tipoItemHallazgo: +m.tooth > 1000 ?  localStorage.getItem('tooth').slice(-2) : 0,
          tipoOdontograma: 1,
          valorSigla1: m.note,
          valorSigla2: m.note2,
          valorSigla3: m.note3,
          base64: this.pdfBase64 ? this.pdfBase64.split(",")[1] : "",
        }
      );
    });
    listToRemove.map((m) => {
      tasks.push(
        {
          codigoDiagnostico: m.indicador, //
          codigoHallazgo: m.damages,
          codigoPiezaDentaria: m.id,
          codigoPiezaFinal: m.direction ? m.direction : this.getDirection(m.tooth, m.damage),
          codigoSede: this.detalleConsulta.codigoSede,
          codigoSuperficie: m.surfaces,
          especificaciones1: "",
          especificaciones2: "",
          estadoHallazgo1: +m.state,
          estadoHallazgo2: +m.state2,
          estadoHallazgo3: +m.state3,
          flag: 0,
          posicionHallazgo: m.posicionHallazgo, //
          indicadorSigla1: m.statetext,
          indicadorSigla2: 0,
          indicadorSigla3: 0,
          numeroHistoria: this.numeroHistoria,
          numeroVersion: this.version.codigo,
          obsPiezaDentaria: "",
          obsevaciones1: "",
          obsevaciones2: "",
          planTratamiento: "",
          tipoItemHallazgo: 0,
          tipoOdontograma: 1,
          valorSigla1: "",
          valorSigla2: "",
          valorSigla3: "",
          base64: this.pdfBase64 ? this.pdfBase64.split(",")[1] : "",
        }
      );
    });
    tasks.map((t, i) => {
      t.base64 = i === 0 ? t.base64 : ''
    })

    await this.odontogramaService
      .saveOdontogram({ consultaMedicaId: this.numeroConsulta }, tasks)
      .toPromise().catch(() => this.isLoading = false);

    await this.odontogramaService
      .saveAdditionalData(
        {
          consultaMedicaId: this.numeroConsulta,
          tipoOdontograma: "1",
        },
        {
          codigoSede: this.detalleConsulta.codigoSede,
          especificaciones1: this.especificaciones,
          numeroConsulta: this.numeroConsulta,
          numeroHistoria: this.numeroHistoria,
          numeroversion: this.version.codigo,
          obsevaciones1: this.observaciones,
          planTratamiento: this.planTratamiento,
          tipoOdontograma: "1",
        }
      )
      .toPromise();

    this.engine.preview = !this.engine.preview;
    this.engine = new Engine(this.odontogramaService, this.dialog);
    this.odontogramaService
      .versionOdontograma({
        tipoOdontograma: "1",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        codigoSede: this.detalleConsulta.codigoSede,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.versiones = data.data;
        this.primerValor = data.data[0];
        this.isLoading = false;
        this.versionChanged(this.primerValor, false);
        this.clearCheckBoxes()
      });
  }

  prepareDataForSaving(list: any) {
    list.forEach((element) => {
      this.formatSurface(element);
    });
  }

  getDirection(tooth, damage) {
    const mouth = this.engine.mouth;
    const data = mouth.find(f => +f.id === +tooth);
    if(data) {
      const filterDirection = data.damages.find(d => d.id === +damage);
      if(!filterDirection) {
        return filterDirection.direction;
      }
      return 0;
    }
  }
  getEstadoHallazgo1(tooth, damage) {
    const mouth = this.engine.mouth;
    const data = mouth.find(f => +f.id === +tooth);
    if(data) {
      const filterDirection = data.damages.find(d => +d.id === +damage);
      if(filterDirection) {
        return filterDirection.statetext;
      }
      return 0;
    }
  }
  getEstadoHallazgo(tooth) {
    const mouth = this.engine.mouth;
    const data = mouth.find(f => +f.id === +tooth);
    if(data) {
      const filterDirection = data.textBox.statetext ? data.textBox.statetext : 0;
      return filterDirection;
    }
  }

  printOdontograma() {
    this.engine.save();
  }

  printOdonto() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.cloneCanvas(canvas);
    this.hide = true;
    this.engine.treatmentData.especificaciones = this.especificaciones;
    this.engine.treatmentData.observaciones = this.observaciones;
    this.engine.treatmentData.plan_tratamiento = this.planTratamiento;
    this.engine.treatmentData.odontologo = this.odontologo;
    this.engine.imprimirDocumento();
    setTimeout(() => {
      const pdf = new jsPDF();
      pdf.addImage(canvas, "JPEG", 50, 10, 110, 280);
      const pdfBase64 = pdf.output("datauristring");
      this.engine.preview = !this.engine.preview;
      this.engine = new Engine(this.odontogramaService, this.dialog);
      printPdfBase64(pdfBase64.split(",")[1]);
      this.versionChanged(this.primerValor, false);
      this.clearCheckBoxes()
    }, 1200);
  }

  formatSurface(item) {
    if (item.surface.indexOf("_") > -1) {
      item.surface = item.surface.split("_")[1];
    }
  }

  saveAdditionalData() {
    this.odontogramaService
      .saveAdditionalData(
        {
          consultaMedicaId: this.numeroConsulta,
          tipoOdontograma: "1",
        },
        {
          codigoSede: this.detalleConsulta.codigoSede,
          especificaciones1: this.especificaciones,
          numeroConsulta: this.numeroConsulta,
          numeroHistoria: this.numeroHistoria,
          numeroversion: this.version.codigo,
          obsevaciones1: this.observaciones,
          planTratamiento: this.planTratamiento,
          tipoOdontograma: "1",
        }
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => this.getDataBoxesByVersionOdontogram(this.version));
  }

  save() {
    // const list = this.engine.getData();
    // console.log(list);
    // const difference = _.differenceWith(list, this.dataInicial, _.isEqual);
    // console.log(difference);
  }

  onContextMenu(event: Event) {
    event.preventDefault();
  }

  cloneCanvas(oldCanvas) {
    const canvasPrintEl = this.canvasPrintRef.nativeElement;
    this.cxPrint = canvasPrintEl.getContext("2d");

    canvasPrintEl.width = this.width;
    canvasPrintEl.height = this.height;
    //create a new canvas

    //apply the old canvas to the new one
    this.cxPrint.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return canvasPrintEl;
  }

  clearCanvas() {
    if(this.cxPrint) this.cxPrint.clearRect(0, 0, this.width, this.height);
  }

  clearCheckBoxes() {
    this.diagnosticos.map(m => {
      m.checked = false;
    });
    this.hallazgos.map(m => {
      m.checked = false;
    });
  }
 }
