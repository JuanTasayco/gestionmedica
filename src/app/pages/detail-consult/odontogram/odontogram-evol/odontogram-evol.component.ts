import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";

import { MatDialog } from "@angular/material";
import { ODONTOGRAM_TYPE, printPdfBase64 } from "@shared/helpers";
import { OdontogramaService } from "@shared/services/odontograma.service";
import { Observable, Subject } from "rxjs";
import {
  map,
  switchMap,
  takeUntil
} from "rxjs/operators";
import { Engine } from "../files/core/engine";
import { OdontogramModalComponent } from "../odontogram-modal/odontogram-modal.component";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import * as _ from 'lodash';
import { jsPDF } from "jspdf";
import { AlertComponent } from "@shared/components/alert/alert.component";

@Component({
  selector: 'mapfre-odontogram-evol',
  templateUrl: './odontogram-evol.component.html',
  styleUrls: ['./odontogram-evol.component.scss']
})
export class OdontogramEvolComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild("canvasRef") canvasRef!: ElementRef;
  @ViewChild("canvasPrintRef") canvasPrintRef!: ElementRef;
  procedimientosServicios: any = [];
  version$: Observable<any>;
  versiones: Array<any> = [];
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
  dataInicialBool = true;

  private cx!: CanvasRenderingContext2D;
  private cxPrint!: CanvasRenderingContext2D;
  engine = new Engine();

  diagnostico: any;
  procedimiento: any;
  dataOdontograma: any = {};
  odontologo = "";
  hide = false;
  isLoading = false;

  diagnosticos: any;
  procedimientos: any;

  constructor (
    private route: ActivatedRoute,
    private odontogramaService: OdontogramaService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.numeroConsulta = this.route.snapshot.paramMap.get('numeroConsulta');
    this.detalleConsulta = this.odontogramaService.getData();
    this.numeroHistoria = this.detalleConsulta.historiaClinicaLocal;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.odontogramaService.cargarListaDiagnosticos(
      "S|",
      "1",
      "10",
      "T"
    ).subscribe(diagnosticos => {
      this.diagnosticos = diagnosticos
    });

    this.odontogramaService.cargarListaProcedimientos(
      "T|F|",
      "1",
      "10",
      "T"
    ).subscribe(procedimientos => {
      this.procedimientos = procedimientos
    });

    this.versionChanged(true);

    const paciente = {
      sede: this.detalleConsulta.sede,
      numero_historia: this.detalleConsulta.historiaClinicaLocal,
      paciente: this.detalleConsulta.nombrePaciente,
      numero_consulta: this.detalleConsulta.numeroConsulta,
      fecha_consulta: this.detalleConsulta.fechaConsulta,
      odontologo: this.odontologo,
    };
    this.engine.loadPatientData(paciente);

    this.getProceduresAndServices();
  }

  private render(data: any, cargaInicial: boolean) {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext("2d");
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    const dataArray = this.DrawOdontograma(data);
    this.engine.setCanvas(canvasEl);
    this.engine.init(0);
    this.hide = false;
    if (data.length > 0) {
      this.engine.setDataSource(dataArray);
      this.changeBtnColor(this.btnPermanente);
    }
    if(cargaInicial) {
      canvasEl.addEventListener(
        "mousedown",
        (event: any) => {
          if(!this.procedimiento || !this.diagnostico) {
            this.toastr.warning('Debe seleccionar un diagnóstico y un procedimiento!', 'Mensaje del Sistema');
            return;
          }
          this.engine.onMouseClick(event);
          this.filterProcedure();
          // this.saveProcedure();
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
          this.engine.onButtonClick(event);
          event.stopPropagation()
        },
        false
      );
    }
  }

  setDamage(id: any) {
    this.engine.setDamage(id);
  }

  clearDamage() {
    this.engine.setDamage(0);
  }


  isChecked(item, array, isProcedimiento: boolean = false) {
    const itemChecked = array.find(f => f.checked === true);

    if (itemChecked && item.codigo === itemChecked.codigo) {
      item.checked = false;
      this.clearDamage();
      if (isProcedimiento) {
      this.procedimiento =  null;
      } else {
        this.diagnostico =  null;
      }
      return;
    }

    array.forEach(item => {
      item.checked = false;
    });
    item.checked = true;

    let itemChecked2 = array.find(f => f.checked === true);

    if (isProcedimiento) {
      this.procedimiento = itemChecked2;
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
    this.dataInicial = listArray;
    // comma seperated string to pass to javascript engine
    let dataArray = "";

    // create string, for JavaScript Engine
    listArray.forEach((o: any) => {
      if (!o.note) {
        o.note = "";
      }

      dataArray +=
        o.id +
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

  modalDiagnostics() {
    const dialogRef = this.dialog.open(OdontogramModalComponent, {
      width: "600px",
      data: {
        title: "Diagnósticos (CIE10)",
        placeholder: "Buscar Diagnósticos",
        data: this.diagnosticos,
        tipo: ODONTOGRAM_TYPE.DIAGNOSTICOS
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

  modalProcedures() {
    const dialogRef = this.dialog.open(OdontogramModalComponent, {
      width: "600px",
      data: {
        title: `${ODONTOGRAM_TYPE.PROCEDIMIENTOS} / Servicios`,
        placeholder:  `Filtrar ${ODONTOGRAM_TYPE.PROCEDIMIENTOS} / Servicios`,
        data: this.procedimientos,
        tipo: `${ODONTOGRAM_TYPE.PROCEDIMIENTOS} / Servicios`,
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

  versionChanged(cargaInicial: boolean = false) {
    this.odontogramaService
      .getDataByVersionOdontogram({
        tipoOdontograma: "2",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        numeroItem: "",
        numeroVersion: '1'
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        // this.btnPermanente = true;
        const leyendas = data.data.map((dato) => dato.leyenda);
        const leyendasDistintas = Array.from(new Set(leyendas));
        this.leyendas = leyendasDistintas.join('\n');
        this.clearCanvas();
        this.render(data.data, cargaInicial);
      });

      this.getDataBoxesByVersionOdontogram();

  }

  getDataBoxesByVersionOdontogram() {
    this.odontogramaService
    .getDataBoxesByVersionOdontogram({
      tipoOdontograma: "2",
      consultaMedicaId: this.numeroConsulta,
      numeroHistoria: this.numeroHistoria,
      numeroVersion: '1',
      codigoSede: this.detalleConsulta.codigoSede
    })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if (data.data && data.data.cursor.length > 0)  this.dataOdontograma = data.data.cursor[0];
      const planTratamiento = data.data.cursor.map((dato) => dato.planTratamiento);
      const planTratamientoDistintas = Array.from(new Set(planTratamiento));
      this.planTratamiento = planTratamientoDistintas.join("\n");

      const observaciones1 = data.data.cursor.map((dato) => dato.observaciones1).filter((str: string) => str !== "");
      const observaciones2 = data.data.cursor.map((dato) => dato.observaciones2).filter((str: string) => str !== "");
      const observaciones1Distintas = Array.from(new Set(observaciones1));
      const observaciones2Distintas = Array.from(new Set(observaciones2));
      this.observaciones = observaciones1Distintas.concat(observaciones2Distintas).join("\n");

      const especificaciones1 = data.data.cursor.map((dato) => dato.especificaciones1).filter((str: string) => str !== "");
      const especificaciones2 = data.data.cursor.map((dato) => dato.especificaciones2).filter((str: string) => str !== "");
      const especificaciones1Distintas = Array.from(new Set(especificaciones1));
      const especificaciones2Distintas = Array.from(new Set(especificaciones2));
      this.especificaciones = especificaciones1Distintas.concat(especificaciones2Distintas).join("\n");
      this.odontologo = data.data.cursor[0].nombreMedico;
    });
  }

  areObjectsEqual(obj1, obj2) {
    return obj1.codigo === obj2.codigo;
  }

  changeBtnColor(tipo: boolean) {
    this.btnPermanente = tipo;
    const miTipo = tipo ? '0' : '1';
    this.engine.changeView(miTipo);
  }

  getProceduresAndServices() {
    this.odontogramaService
      .getProcedureServicesOdontogram({
        tipoOdontograma: "2",
        consultaMedicaId: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        codigoProcedimiento: "00413",
      }).pipe(map((data: any) => data.data), takeUntil(this.unsubscribe$))
      .subscribe(procedimientos => {
        this.procedimientosServicios = procedimientos;
      });
  }

  deleteProcedureOdontogram(item: any) {
    this.odontogramaService.deleteProcedureOdontogram({
      consultaMedicaId: this.numeroConsulta,
      tipoOdontograma: "2",
      codigoProcedimiento: 12,
      codigoDiagnostico: item.codigoDiagnostico,
      numeroMovimiento: item.numeroItemMovimiento
    }).pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp: any) => {
      if(+resp.operacion === 500) {
        const data = { title : 'Mensaje del sistema', message : resp.mensaje };
        this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
        });
      } else{
        this.getProceduresAndServices();
      }
    })
  }

  changeView(data: any) {
    this.engine.changeView('1')
  }

  saveAdditionalData() {
    this.odontogramaService.saveAdditionalData(
      {
        consultaMedicaId: this.numeroConsulta,
        tipoOdontograma: '2'
      },
      {
        codigoSede: this.detalleConsulta.codigoSede,
        especificaciones1: this.especificaciones,
        numeroConsulta: this.numeroConsulta,
        numeroHistoria: this.numeroHistoria,
        numeroversion: '1',
        obsevaciones1: this.observaciones,
        planTratamiento: this.planTratamiento,
        tipoOdontograma: "2"
      }
    )
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(resp => this.getDataBoxesByVersionOdontogram());
  }

  saveProcedure() {
    const data = JSON.parse(JSON.stringify(this.engine.mouth));
    const temp = data.find((f:any) => +f.id === +this.engine.piezaId);
    let codigoSuperficieDentaria = '';
    if(temp) {
     const isSelected = temp.checkBoxes.find((c: any) => c.touching === true);
      if(isSelected) {
        codigoSuperficieDentaria = isSelected.id.split('_')[1]
      } else {
        codigoSuperficieDentaria = 'X'
      }
      this.odontogramaService.createProcedure(
        {
          consultaMedicaId: this.numeroConsulta,
          tipoOdontograma: '2'
        },
        {
          codigoDiagnostico: this.diagnostico.codigo,
          codigoPiezaDentaria: this.engine.piezaId,
          codigoProcedimiento: this.procedimiento.codigo,
          codigoSuperficieDentaria: codigoSuperficieDentaria
        }
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(resp => {
        this.getProceduresAndServices();
        this.clearCheckBoxes()
      });
    }
  }

  filterProcedure() {
      const filtroProcedimiento = this.procedimientosServicios.find(f => f.codigoProcedimiento === this.procedimiento.codigo && f.codigoDiagnostico !== this.diagnostico.codigo);
      if(filtroProcedimiento) {
        this.toastr.warning('No es posible registrar un mismo procedimiento para un diagnóstico diferente', 'Mensaje del Sistema');
        return;
      }
      this.saveProcedure()
    // console.log('entra')
    // this.saveProcedure();
    // const filtrarProcedimientoServicio = this.procedimientosServicios.filter(f => f.codigoProcedimiento === this.procedimiento.codigo && f.codigoDiagnostico === this.diagnostico.codigo);
    // if(filtrarProcedimientoServicio.length > 0) {
    //   const existePieza = filtrarProcedimientoServicio.find(f => +f.codigoPiezaDentaria === +this.engine.piezaId)
    //   if(existePieza) {
    //     this.toastr.warning('El procedimiento ya ha sido registrado sobre la pieza seleccionada', 'Mensaje del Sistema');
    //     return
    //   }
    //   this.saveProcedure()
    // } else {
    //   const filtroProcedimiento = this.procedimientosServicios.find(f => f.codigoProcedimiento === this.procedimiento.codigo && f.codigoDiagnostico !== this.diagnostico.codigo);
    //   if(filtroProcedimiento) {
    //     this.toastr.warning('No es posible registrar un mismo procedimiento para un diagnóstico diferente', 'Mensaje del Sistema');
    //     return;
    //   }
    //   this.saveProcedure()
    // }
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
      this.versionChanged(false);
      this.clearCheckBoxes()
    }, 1200);
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
  }
}
