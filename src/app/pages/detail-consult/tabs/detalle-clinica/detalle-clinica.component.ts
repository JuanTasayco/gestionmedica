import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent, MatDialog, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertComponent } from "@shared/components/alert/alert.component";
import { PdfViewerComponent } from "@shared/components/custom-pdf-viewer/custom-pdf-viewer.component";
import { SignDocumentComponent } from "@shared/components/sign-document/sign-document.component";
import { SuccessComponent } from "@shared/components/success/sucess.component";
import { BASE_DATE_FORMAT_API, CONTENT_TYPE, RegularExpression } from "@shared/helpers";
import { IDetalleAtencionRequest } from "@shared/models/request/interfaces/detalle-atencion.interface";
import { IInformacionPacienteRequest } from "@shared/models/request/interfaces/informacion-paciente.interface";
import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { OdontogramaService } from "@shared/services/odontograma.service";
import { ProfesionalService } from "@shared/services/profesional.service";
import * as moment from "moment";
import { Observable, Subscription, forkJoin, of } from "rxjs";
import { debounceTime, map, mergeMap, startWith, take, tap } from "rxjs/operators";
import { downloadBase64Async, downloadBase64, markFormGroupTouched } from '@shared/helpers/utils';
import { MedicalRestComponent } from "@shared/components/medical-rest/medical-rest.component";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { ReferenciaService } from "@shared/services/referencia.service";
import { EventTrackerService } from "@shared/services/event-tracker.service";

//diagnostico identificado
export interface DiagnosticoModel {
  value: string;
  code: number;
  indicador: string;
}

var ELEMENT_DATA: DiagnosticoModel[] = [
];

//servicio de diagnostico
export interface ServDiagnosticoModel {
  numeroMovimiento: number;
  numeroOrden: number;
  codeDiagnostico: string;
  code: number;
  diagnosticoSeleccionado: string;
  servicio: string;
  cantidad: number;
  numOA: string;
  realizado: string;
  interno: string;
}

var ELEMENT_DATA_SERV: ServDiagnosticoModel[] = [
];

//procedimiento
export interface ProcedimientoModel {
  numeroMovimiento: number;
  numeroOrden: number;
  code: number;
  codeDiagnostico: string;
  procedimientoSeleccionado: string;
  procedimiento: string;
  cantidad: number;
  numOA: string;
  realizado: string;
  interno: string;
}

var ELEMENT_DATA_PROC: ProcedimientoModel[] = [
];

//medicamento
export interface MedicamentoModel {
  numeroMovimiento: number;
  //numeroOrden: number;
  codeDiagnostico: string;
  code: number;
  medicamentoSelecionado: string;
  dosis: number;
  unidadMedidaDosis: string;
  frecuencia: number;
  unidadMedidaFrecuencia: string;
  duracion: number;
  unidadMedidaDuracion: string;
  cantidadProducto: string;
  indicacionMedica: string;
  indicaciones?:string;
  isMedicamento?:boolean;

}

var ELEMENT_DATA_MED: MedicamentoModel[] = [
];

@Component({
  selector: 'mantenimiento-tab-detalle-clinica',
  templateUrl: './detalle-clinica.component.html',
  styleUrls: ['../../detail-consult.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TabDetalleClinicaComponent implements OnInit, OnDestroy{
  mensaje = "hola mundo";
  hasError = false;
  @ViewChild("formularioMedicamento") formularioMedicamento: any;
  @ViewChild("frmServicio") frmServicio: any;
  @ViewChild("frmProcedimiento") frmProcedimiento: any;
  @ViewChild("diagnosticoSearch") diagnosticoSearch;
  @ViewChild("diagnosticoInput") diagnosticoInput;
  @ViewChild("procedimientoInput") procedimientoInput;
  @ViewChild("medicamentoInput") medicamentoInput;
  @Output() evento = new EventEmitter<string>();
  editarInformacion : boolean = false;
  //
  informacionPaciente: IInformacionPacienteRequest;
  detalleAtencion: IDetalleAtencionRequest;
  formCreate: FormGroup;
  informacion_paciente: FormGroup;
  guardar_info: boolean = true;
  inf_paciente: boolean = false;
  detalle_paciente: boolean = false;
  //diagnosticos
  listaDiagnosticos = [];
  diagnosticosFiltrados: Observable<Array<any>>;
  diagnostico_FormControl = new FormControl('');

  //tabla de diagnosticos identificados
  columnsDiagnosticos: string[] = ['diagIdentificado', 'checkbox', 'action'];
  dataSource = new MatTableDataSource();

  //tabla de servicio de apoyo
  columnsServicios: string[] = ['diagnostico', 'servicio', 'cantidad', 'numOA', 'realizado', 'interno', 'action'];
  dataSourceServicio = new MatTableDataSource();
  listaServicios = false;
  itemsDiagnosticos = false;

  //tabla de procedimientos
  columnsProcedimiento: string[] = ['diagnostico', 'procedimiento', 'cantidad', 'numOA', 'realizado', 'interno', 'action'];
  dataSourceProcedimiento = new MatTableDataSource();

  //tabla de procedimientos
  columnsMedicamentos: string[] = ['medicamentos', 'frecuencia'];
  dataSourceMedicamento = new MatTableDataSource();

  //combo para servicio de apoyo
  cboservDiag = []
  listaServDiagnosticos = []
  servDiag_FormControl = new FormControl('');
  servDiagFiltrados: Observable<Array<any>>;
  diagSeleccionado_Serv: string;

  //combo para procedimientos
  listaProcedimientos = []
  procedimiento_FormControl = new FormControl('');
  procedimientosFiltrados: Observable<Array<any>>;
  diagSeleccionado_Proc: string;

  //cbo para medicamentos
  listaMedicamentos = []
  medicamento_FormControl = new FormControl('');
  medicamentosFiltrados: Observable<Array<any>>;
  medicamentoSeleccionado_Proc: string;

  //guardar_diagnostico
  data_diagnosticos: boolean = true;

  //referencia
  agregarReferencia: boolean = false;
  formularioReferencia: FormGroup;
  @Input() data_consulta:any;
  current_user:any;
  diagnostico: string;
  listaDuracion: any;
  listaDosis: any;
  destinos: any
  listaFrecuencias: any;
  numeroConsulta: string;
  diagnosticosGuardar: any;
  apoyoGuardar: any;
  apoyoActualizar: any;
  procedimientosGuardar: any;
  procedimientosActualizar: any;
  recetaGuardar: any;
  recetaActualizar: any;
  tempDiagnosticos : any;
  //combos referencia
  establecimiento: any;
  ups: any;
  datos_referencia = false;
  data_referencia: any;

  //
  pesoValueChanges:Subscription;
  tallaValueChanges:Subscription;

  //imprimir
  pdfBase64:string = ''

  @Input() buttonMedicalRest: boolean;
  @Input() isDocSign: boolean;
  @Input() isNurseValue: boolean;
  // isSaveAllResults = false;
  stringArraySaveAll = [];
  stringGetArray = [];
  obsArraySaveAll = [];
  medico: any = {};
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  consultoriosList: any = [];
  codConsultorio: any;
  subscription : Subscription;
  constructor(private consultaMedService: ConsultaMedicaService, private route: ActivatedRoute, private _ngZone: NgZone, private referenciaService: ReferenciaService,
    private dialog: MatDialog, private profesionalservice: ProfesionalService, private router:Router,  private eventTracker: EventTrackerService,
    private odontogramaService: OdontogramaService) { }

  ejecutarEvento(){
    this.evento.emit(this.mensaje);
  }  

  ngOnInit() {
    this.current_user = JSON.parse(localStorage.getItem("evoProfile"))
    this.numeroConsulta = this.route.snapshot.paramMap.get('numeroConsulta');

    
    this.getDetalleConsultaMedica(this.numeroConsulta);
    this.updateDiagnosticos();
    this.getDiagnosticosIdentificados(this.numeroConsulta);
    //this.getReferencia(this.numeroConsulta);
    this.getNewReferencia(this.numeroConsulta);
    this.getCodUsuario();
    this.cargarDosis();
    this.cargarFrecuencia();
    this.cargarDuracion();

    this.informacion_paciente = new FormGroup({
      peso: new FormControl(),
      talla: new FormControl('', Validators.pattern(/^[0-9]+(\.)?([0-9]{0,2})?$/)),
      imc: new FormControl('', Validators.pattern(/^[0-9]{2}(\.)?([0-9]{0,2})?$/)),
      frecuenciaRespiratoria: new FormControl(),
      frecuenciaCardiaca: new FormControl(),
      presion: new FormControl('', Validators.pattern(/^[0-9]{2,3}(\/)([1-9][0-9])$/)),
      temperaturaOral: new FormControl('', Validators.pattern(/^[0-9]{2}(\.)?([0-9]{1})$/)),
      temperaturaOtica: new FormControl('', Validators.pattern(/^[0-9]{2}(\.)?([0-9]{1})$/)),
      temperaturaRectal: new FormControl('', Validators.pattern(/^[0-9]{2}(\.)?([0-9]{1})$/)),
      temperaturaAxilar: new FormControl('', Validators.pattern(/^[0-9]{2}(\.)?([0-9]{1})$/)),
      consultorio: new FormControl(''),
      nroConsultorio: new FormControl(''),
      tipoCita: new FormControl('')
    });

    this.pesoValueChanges = this.informacion_paciente.get("peso").valueChanges.subscribe(
      (value:number)=>{
        const talla:number = this.informacion_paciente.get("talla").value;
        if(talla && talla > 0){
          this.informacion_paciente.get("imc").patchValue(
            (value/(talla*talla)).toFixed(2)
          )
        }
      }
    )

    this.tallaValueChanges = this.informacion_paciente.get("talla").valueChanges.subscribe(
      (value:number)=>{
        const peso:number = this.informacion_paciente.get("peso").value;
        if(peso && peso > 0){
          this.informacion_paciente.get("imc").patchValue(
            (peso/(value*value)).toFixed(2)
          )
        }
      }
    )


    this.formCreate = new FormGroup({
      signosSintomas: new FormControl('', [Validators.required]),
      anamesis: new FormControl('', [Validators.required]),
      examenPreferencial: new FormControl('', [Validators.required]),
      apoyoDiagnostico: new FormControl(''),
      tratamiento: new FormControl(''),
      procedimientos: new FormControl(''),
      recomendaciones: new FormControl('')
    });

    this.formularioReferencia = new FormGroup({
      nroReferencia: new FormControl(''),
      fechaReferencia: new FormControl('', Validators.required),
      origen: new FormControl('', Validators.required),
      destino: new FormControl('', Validators.required),
      upsReferencia: new FormControl('', Validators.required),
      upsReferencia_desc: new FormControl(''),
      examenEspecial: new FormControl(''),
      examenEspecial_desc: new FormControl(''),
      especialidades: new FormControl(''),
      condicion: new FormControl('', Validators.required)
    });

    this.formularioReferencia.controls.origen.setValue(this.data_consulta?this.data_consulta.sede:null);

    //this.cargarListaDiagnosticos();
    //this.cargarMedicamentos();
    this.diagnostico_FormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(value => {
        if (value && value != null && value.length > 2) {
          this.diagnostico = this.diagnostico_FormControl.value
          this.cargarListaDiagnosticos();
        }
      }
      )
    ).subscribe();

    this.servDiag_FormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(value => {
        if (value && value != null && value.length > 2) {
          //this.diagnostico = this.diagnostico_FormControl.value
          let data = { value: { value_search: this.servDiag_FormControl.value } }
          this.listarServDiagSeleccionado(data);
        }
      }
      )
    ).subscribe();

    this.procedimiento_FormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(value => {
        if (value && value != null && value.length > 2) {
          //this.diagnostico = this.diagnostico_FormControl.value
          let data = { value: { value_search: this.procedimiento_FormControl.value } }
          this.listarProcedimientoSeleccionado(data);
        }
      }
      )
    ).subscribe();

    this.medicamento_FormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(value => {
        if (value && value != null && value.length > 2) {
          //this.diagnostico = this.diagnostico_FormControl.value
          let data = { value: { value_search: this.medicamento_FormControl.value } }
          this.listarRecetaSeleccionado(data);
        }
      }
      )
    ).subscribe();

    this.formCreate.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      tap(value => {
      }
      )
    ).subscribe();

    if(localStorage.getItem('codMedico')) {
      this.profesionalservice.obtenerDataMedico(localStorage.getItem('codMedico'))
        .subscribe((response: any) => {
            this.medico = response.data;
        });
    }

  }

  ngOnDestroy(): void {
      this.pesoValueChanges.unsubscribe()
      this.tallaValueChanges.unsubscribe();
      if(this.subscription) {
        this.subscription.unsubscribe();
      }
  }


  detectarCambio(e: any) {
    this.guardar_info = false
  }


  guardarInfoPaciente() {
    //this.informacion_paciente.reset()
    this.informacionPaciente = this.informacion_paciente.value
    localStorage.setItem('infoPaciente', JSON.stringify(this.informacionPaciente))
    this.inf_paciente = true;
  }

  editarInfoPaciente() {
    this.eventTracker.postEventTracker("opc48", JSON.stringify( this.informacion_paciente.value)).subscribe()
   
    this.inf_paciente = false;
    Object.keys(this.informacion_paciente.controls).forEach((key) => {
      if (this.informacion_paciente.get(key).value === '0') {
        this.informacion_paciente.get(key).setValue(null);
      }
    });
  }


  guardarDetalle() {
    this.detalleAtencion = this.formCreate.value
    localStorage.setItem('detallePaciente', JSON.stringify(this.detalleAtencion))
    this.detalle_paciente = true;
  }

  editarDetalle() {
    this.actualizarDetalleAtencion();
    this.detalle_paciente = false;
  }



  diagnosticoSeleccionado(event: MatAutocompleteSelectedEvent): void {
    this.eventTracker.postEventTracker("opc37",JSON.stringify({"value":event.option.value, "id": this.numeroConsulta})).subscribe()
  
    const element = ELEMENT_DATA.find(f => f.code === event.option.value);
    if(element) {
      this.diagnosticoSearch.nativeElement.value = '';
      this.alertaDuplicados('El diagnóstico ya fue seleccionado');
      return;
    }
    ELEMENT_DATA.push({ code: event.option.value, value: event.option.viewValue, indicador: 'P' });
    this.dataSource.data = ELEMENT_DATA;
    this.tempDiagnosticos = ELEMENT_DATA;
    this.cboservDiag.push({ code: event.option.value, value: event.option.viewValue, value_search: this.diagnostico });
    this.diagnostico_FormControl.setValue('');
    this.itemsDiagnosticos = true;
    this.actualizarDiagnosticos();
  }

  actualizarDiagnosticos() {
    this.guardarDiagnosticos();
    if (this.dataSource.data.length > 0) {
      this.enviarDiagnosticosService()
    }
  }

  cargarListaDiagnosticos() {

    this.consultaMedService.cargarListaDiagnosticos(this.diagnostico_FormControl.value, "1", "30", "T")
      .subscribe((response: any) => {
        if (response) {
          this.listaDiagnosticos = response.data;
          this.diagnosticosFiltrados = this.diagnostico_FormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filterDiagnostico(descripcion) : this.listaDiagnosticos.slice())
            );
        }

      });

  }

  private _filterDiagnostico(value: string): string[] {
    //this.diagnostico_FormControl.setValue(null);
    const filterValue = value.toLowerCase();
    return this.listaDiagnosticos.filter(diagnostico => diagnostico.descripcion.toLowerCase().includes(filterValue));
  }

  deleteDiagnostico(row: DiagnosticoModel) {

 
    let index = this.dataSource.data.indexOf(row, 0)
    const buscarServicio = this.dataSourceServicio.data.find(element => element['codeDiagnostico'] === row.code);
    const buscarProcedimiento = this.dataSourceProcedimiento.data.find(element => element['codeDiagnostico'] === row.code);

    
    if (!buscarServicio && !buscarProcedimiento) {
      const filter = {
        "numeroConsulta": this.numeroConsulta,
        "code": row.code.toString()
      }
      this.eventTracker.postEventTracker("opc38", JSON.stringify(filter)).subscribe()
      this.consultaMedService.eliminarDiagnostico(this.numeroConsulta, row.code.toString())
        .subscribe((response: any) => {
          if (response) {
            ELEMENT_DATA.splice(index, 1);
            this.dataSource.data = ELEMENT_DATA;
            this.tempDiagnosticos = ELEMENT_DATA;
            this.cboservDiag.splice(index, 1);
          }
        });
    } else {
      const data = {
        title: 'Alerta',
        message: 'El diagnóstico no se ha podido eliminar porque tiene registros en Procedimientos y/o Servicios.',
      }

      const dialogRef = this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: data }
      });
    }

    /* let index = this.dataSource.data.indexOf(row, 0)
    ELEMENT_DATA.splice(index, 1);
    this.dataSource.data = ELEMENT_DATA   */

  }

  listarServDiagSeleccionado(valor: any) {
    this.consultaMedService.listarServDiagSeleccionado(valor.value['value_search'], "1", "30", "P")
      .subscribe((response: any) => {
        if (response) {
          this.listaServDiagnosticos = response.data;
          this.servDiagFiltrados = this.servDiag_FormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filterServDiag(descripcion) : this.listaServDiagnosticos.slice())
            );
        }

      });

  }


  private _filterServDiag(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaServDiagnosticos.filter(servicio => servicio.descripcion.toLowerCase().includes(filterValue));
  }

  servDiagSeleccionado(event: MatAutocompleteSelectedEvent, desc: any): void {
    
    const element = ELEMENT_DATA_SERV.find(f => f.code === event.option.value);
    if(element) {
      this.diagnosticoInput.nativeElement.value = '';
      this.alertaDuplicados();
    } else {
      ELEMENT_DATA_SERV.push(
        {
          numeroMovimiento: 0,
          numeroOrden: 0,
          code: event.option.value,
          codeDiagnostico: this.diagSeleccionado_Serv['code'],
          diagnosticoSeleccionado: this.diagSeleccionado_Serv['value'],
          servicio: event.option.viewValue,
          cantidad: 1,
          numOA: '-',
          realizado: 'N',
          interno: 'S'
        }
      );
      this.dataSourceServicio.data = ELEMENT_DATA_SERV;
      this.servDiag_FormControl.setValue('');
      //validacion boton guardar
      this.validarBotonGuardarDataDiagnostico(1)

      const filtro = {
        numeroMovimiento: 0,
        numeroOrden: 0,
        code: event.option.value,
        codeDiagnostico: this.diagSeleccionado_Serv['code'],
        diagnosticoSeleccionado: this.diagSeleccionado_Serv['value'],
        servicio: event.option.viewValue,
        cantidad: 1,
        numOA: '-',
        realizado: 'N',
        interno: 'S'
    }

      this.eventTracker.postEventTracker("opc39", JSON.stringify(filtro)).subscribe()
  }

  }

  deleteServDiag(row: any) {

   
    let index = this.dataSourceServicio.data.indexOf(row, 0)
    if (row['numeroMovimiento'] != '') {
      const filtro = {
        "numeroConsulta": this.numeroConsulta,
        "nroOrden": row['numeroOrden']
      }
      this.eventTracker.postEventTracker("opc40",JSON.stringify(filtro) ).subscribe()
      this.consultaMedService.eliminarApoyoDiagnostico(this.numeroConsulta, +row['numeroOrden'])
        .subscribe((response: any) => {
          if (response.operacion == 200 && response.mensaje == 'DELETED') {
            ELEMENT_DATA_SERV.splice(index, 1);
            this.dataSourceServicio.data = ELEMENT_DATA_SERV
          } else {

          }

        });

    } else {
      ELEMENT_DATA_SERV.splice(index, 1);
      this.dataSourceServicio.data = ELEMENT_DATA_SERV
    }

    this.validarBotonGuardarDataDiagnostico(0)
  }


  listarProcedimientoSeleccionado(valor: any) {

    this.consultaMedService.listarProcedimientoSeleccionado(valor.value['value_search'], this.numeroConsulta)
      .subscribe((response: any) => {
        if (response) {
          this.listaProcedimientos = response.data;
          this.procedimientosFiltrados = this.procedimiento_FormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filterProcedimientos(descripcion) : this.listaProcedimientos.slice())
            );
        }

      });


  }

  private _filterProcedimientos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaProcedimientos.filter(proc => proc.descripcion.toLowerCase().includes(filterValue));
  }

  procedimientoSeleccionado(event: MatAutocompleteSelectedEvent): void {
    
  
    const element = ELEMENT_DATA_PROC.find(f => f.code === event.option.value);
    if(element) {
      this.procedimientoInput.nativeElement.value = '';
      this.alertaDuplicados();
    } else {
      this.procedimiento_FormControl.setValue('');
      ELEMENT_DATA_PROC.push(
        {
          numeroMovimiento: 0,
          numeroOrden: 0,
          code: event.option.value,
          codeDiagnostico: this.diagSeleccionado_Proc['code'],
          procedimientoSeleccionado: this.diagSeleccionado_Proc['value'],
          procedimiento: event.option.viewValue,
          cantidad: 1,
          numOA: '-',
          realizado: 'N',
          interno: 'S'
        }
      );
      this.dataSourceProcedimiento.data = ELEMENT_DATA_PROC;
      const filtro = {
        numeroMovimiento: 0,
        numeroOrden: 0,
        code: event.option.value,
        codeDiagnostico: this.diagSeleccionado_Proc['code'],
        procedimientoSeleccionado: this.diagSeleccionado_Proc['value'],
        procedimiento: event.option.viewValue,
        cantidad: 1,
        numOA: '-',
        realizado: 'N',
        interno: 'S'
      }
      this.eventTracker.postEventTracker("opc42", JSON.stringify(filtro)).subscribe()
      //validacion boton guardar
      this.validarBotonGuardarDataDiagnostico(1)
    }

  }

  deleteProcedimiento(row: any) {

    let index = this.dataSourceProcedimiento.data.indexOf(row, 0)
    if (row['numeroMovimiento'] != '') {

      this.consultaMedService.eliminarApoyoDiagnostico(this.numeroConsulta, +row['numeroOrden'])
        .subscribe((response: any) => {
          if (response.operacion == 200 && response.mensaje == 'DELETED') {
            ELEMENT_DATA_PROC.splice(index, 1);
            this.dataSourceProcedimiento.data = ELEMENT_DATA_PROC
          } else {

          }
        });
        const filtros= {
          "numeroConsulta": this.numeroConsulta,
          "numeroOrden": row['numeroOrden']
        }
        this.eventTracker.postEventTracker("opc43", JSON.stringify(filtros)).subscribe()

    } else {
      ELEMENT_DATA_PROC.splice(index, 1);
      this.dataSourceProcedimiento.data = ELEMENT_DATA_PROC
    }

    this.validarBotonGuardarDataDiagnostico(0)

  }

  listarRecetaSeleccionado(valor: any) {

    this.consultaMedService.listarRecetaSeleccionado(valor.value['value_search'], "P", "30", this.numeroConsulta)
      .subscribe((response: any) => {
        if (response) {
          this.listaMedicamentos = response.data;
          this.medicamentosFiltrados = this.medicamento_FormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filterMedicamentos(descripcion) : this.listaMedicamentos.slice())
            );
        }

      });

  }


  private _filterMedicamentos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaMedicamentos.filter(medicamento => medicamento.descripcion.toLowerCase().includes(filterValue));
  }

  medicamentoSeleccionado(event: MatAutocompleteSelectedEvent): void {
   
    const element = ELEMENT_DATA_MED.find(f => f.code === event.option.value);
    const isMedicamento = event.option.value.length < 7 ? true : false;
    if (
      this.dataSourceMedicamento.data.length > 0 &&
      !this.formularioMedicamento.form.valid
    ) {
      this.alertaFormularioServicio();
      this.alertaFormularioProcedimiento();
      this.alertaFormulario();
      this.medicamento_FormControl.setValue("");
      return;
    }
    if(element) {
      this.medicamentoInput.nativeElement.value = '';
      this.alertaDuplicados();
    } else {
      this.medicamento_FormControl.setValue('');
  
      ELEMENT_DATA_MED.push(
        {
          numeroMovimiento: 0,
          //numeroOrden : 0,
          codeDiagnostico: this.medicamentoSeleccionado_Proc['code'],
          code: event.option.value,
          medicamentoSelecionado: event.option.viewValue,
          dosis: isMedicamento ? null : 1,
          unidadMedidaDosis: isMedicamento ? '' : '006',
          frecuencia:  isMedicamento ? null : 1,
          unidadMedidaFrecuencia: isMedicamento ? '' : '002',
          duracion:  isMedicamento ? null : 1,
          unidadMedidaDuracion: isMedicamento ? '' : '002',
          cantidadProducto: '',
          indicacionMedica: ''
        }
      );
      this.dataSourceMedicamento.data = ELEMENT_DATA_MED;
        const filtros = {
          numeroMovimiento: 0,
          //numeroOrden : 0,
          codeDiagnostico: this.medicamentoSeleccionado_Proc['code'],
          code: event.option.value,
          medicamentoSelecionado: event.option.viewValue,
          dosis: isMedicamento ? null : 1,
          unidadMedidaDosis: isMedicamento ? '' : '006',
          frecuencia:  isMedicamento ? null : 1,
          unidadMedidaFrecuencia: isMedicamento ? '' : '002',
          duracion:  isMedicamento ? null : 1,
          unidadMedidaDuracion: isMedicamento ? '' : '002',
          cantidadProducto: '',
          indicacionMedica: ''
        }
      this.eventTracker.postEventTracker("opc45", JSON.stringify(filtros)).subscribe()

      //validacion boton guardar
      this.validarBotonGuardarDataDiagnostico(1);
    }
  }

  deleteMedicamento(row: any) {

   
    let index = this.dataSourceMedicamento.data.indexOf(row, 0)
    if (row['numeroMovimiento'] != '') {

      this.consultaMedService.eliminarRecetaMedica(this.numeroConsulta, +row['numeroMovimiento'])
        .subscribe((response: any) => {
          if (response.operacion == 200 && response.mensaje == 'DELETED') {
            ELEMENT_DATA_MED.splice(index, 1);
            this.dataSourceMedicamento.data = ELEMENT_DATA_MED
          } else {

          }
        });


        const filtro = {
          "numeroConsulta": this.numeroConsulta,
          "numeroMovimiento": row['numeroMovimiento']
        }
        this.eventTracker.postEventTracker("opc46", JSON.stringify(filtro)).subscribe()

    } else {
      ELEMENT_DATA_MED.splice(index, 1);
      this.dataSourceMedicamento.data = ELEMENT_DATA_MED
    }

    this.validarBotonGuardarDataDiagnostico(0)
  }

  validarBotonGuardarDataDiagnostico(estado: number) {
    if (estado == 1) {
      if (this.dataSourceServicio.data.length > 0 || this.dataSourceProcedimiento.data.length > 0 ||
        this.dataSourceMedicamento.data.length > 0) {
        this.data_diagnosticos = false
      }
    } else {
      if (this.dataSourceServicio.data.length == 0 && this.dataSourceProcedimiento.data.length == 0 &&
        this.dataSourceMedicamento.data.length == 0) {
        this.data_diagnosticos = true
      }
    }
  }

  formReferencia(estado: boolean) {
    
  
    this.agregarReferencia = estado;
    if (estado == false) {
      this.formularioReferencia.reset();
    } else {
      this.getUPS();
      this.getSedes();
      this.formularioReferencia.controls['nroReferencia'].disable();
    }
    const filtros={
      "estado": estado,
      "nroConsulta": this.data_consulta.numeroConsulta
  }
    this.eventTracker.postEventTracker("opc52", JSON.stringify(filtros)).subscribe()
  }

  onlyNumbers(event: any) {

    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    } else {

    }
  }

  onlyNumbersPresion(event: any) {
    const pattern = /[0-9/]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyNumbersMedicaments(event: any) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  formatDecimal(event: any, campo: number) {
    let num = event.target.value.toString();
    if (num.indexOf(".") != -1) {
      num = num.slice(0, campo > 2 ? (num.indexOf(".")) + 2 : (num.indexOf(".")) + 3);
    }

    switch (campo) {
      case 1: this.informacion_paciente.controls.talla.setValue(num); break;
      case 2: this.informacion_paciente.controls.imc.setValue(num); break;
      case 3: this.informacion_paciente.controls.temperaturaOral.setValue(num); break;
      case 4: this.informacion_paciente.controls.temperaturaOtica.setValue(num); break;
      case 5: this.informacion_paciente.controls.temperaturaRectal.setValue(num); break;
      case 5: this.informacion_paciente.controls.temperaturaAxilar.setValue(num); break;
    }

  }

  cambiarIndicador(e: any, element: any) {

    if (e.checked) {
      element['indicador'] = 'D';
    } else {
      element['indicador'] = 'P';
    }

    this.actualizarDiagnosticos()

  }

  guardarDiagnosticos() {
    //guardar en memoria las tablas 
    this.diagnosticosGuardar = { diagnosticos: [] };

    for (let index = 0; index < this.dataSource.data.length; index++) {
      this.diagnosticosGuardar.diagnosticos.push(
        {
          codigoDiagnostico: this.dataSource.data[index]['code'],
          indicador: this.dataSource.data[index]['indicador']
        })
    }

  }


  guardarApoyoDiagnostico() {
    this.apoyoGuardar = { apoyosDiagnostico: [] };
    this.apoyoActualizar = { apoyosDiagnostico: [] };

    for (let index = 0; index < this.dataSourceServicio.data.length; index++) {

      if (this.dataSourceServicio.data[index]['numeroMovimiento'] != '') {
        this.apoyoActualizar.apoyosDiagnostico.push(
          {
            "id": +this.dataSourceServicio.data[index]['numeroMovimiento'],
            "codigoDiagnostico": this.dataSourceServicio.data[index]['codeDiagnostico'],
            "codigoProcedimiento": this.dataSourceServicio.data[index]['code'],
            "cantidad": this.dataSourceServicio.data[index]['cantidad'],
            "realizado": "S",
            "interno": this.dataSourceServicio.data[index]['interno']
          }
        )

      } else {
        this.apoyoGuardar.apoyosDiagnostico.push(
          {
            "codigoDiagnostico": this.dataSourceServicio.data[index]['codeDiagnostico'],
            "codigoProcedimiento": this.dataSourceServicio.data[index]['code'],
            "cantidad":  this.dataSourceServicio.data[index]['cantidad'],
            "realizado": "N",
            "interno": this.dataSourceServicio.data[index]['interno']
          }
        )
      }

    }

  }

  guardarProcedimientos() {
    this.procedimientosGuardar = { procedimientos: [] };
    this.procedimientosActualizar = { procedimientos: [] };

    for (let index = 0; index < this.dataSourceProcedimiento.data.length; index++) {

      if (this.dataSourceProcedimiento.data[index]['numeroMovimiento'] != '') {

        this.procedimientosActualizar.procedimientos.push(
          {
            "id": +this.dataSourceProcedimiento.data[index]['numeroMovimiento'],
            "codigoDiagnostico": this.dataSourceProcedimiento.data[index]['codeDiagnostico'],
            "codigoProcedimiento": this.dataSourceProcedimiento.data[index]['code'],
            "cantidad": this.dataSourceProcedimiento.data[index]['cantidad'],
            "realizado": "S",
            "interno": this.dataSourceProcedimiento.data[index]['interno']
          }
        )

      } else {
        this.procedimientosGuardar.procedimientos.push(
          {
            "codigoDiagnostico": this.dataSourceProcedimiento.data[index]['codeDiagnostico'],
            "codigoProcedimiento": this.dataSourceProcedimiento.data[index]['code'],
            "cantidad": this.dataSourceProcedimiento.data[index]['cantidad'],
            "realizado": "N",
            "interno": this.dataSourceProcedimiento.data[index]['interno']
          }
        )
      }



    }

  }


  guardarReceta() {

    this.recetaGuardar = { recetas: [] };
    this.recetaActualizar = { recetas: [] };
    for (let index = 0; index < this.dataSourceMedicamento.data.length; index++) {

      if (this.dataSourceMedicamento.data[index]['numeroMovimiento'] != '') {

        this.recetaActualizar.recetas.push(
          {
            "id": this.dataSourceMedicamento.data[index]['numeroMovimiento'],
            "codigoDiagnostico": this.dataSourceMedicamento.data[index]['codeDiagnostico'],
            "codigoMedicamento": this.dataSourceMedicamento.data[index]['code'],
            "dosis": +this.dataSourceMedicamento.data[index]['dosis'],
            "unidadMedidaDosis": this.dataSourceMedicamento.data[index]['unidadMedidaDosis'],
            "frecuencia": +this.dataSourceMedicamento.data[index]['frecuencia'],
            "unidadMedidaFrecuencia": this.dataSourceMedicamento.data[index]['unidadMedidaFrecuencia'],
            "duracion": +this.dataSourceMedicamento.data[index]['duracion'],
            "unidadMedidaDuracion": this.dataSourceMedicamento.data[index]['unidadMedidaDuracion'],
            "cantidadProducto": this.dataSourceMedicamento.data[index]['cantidadProducto'],
            "indicacionMedica": this.dataSourceMedicamento.data[index]['indicacionMedica']
          }
        )

      } else {
        this.recetaGuardar.recetas.push(
          {
            "codigoDiagnostico": this.dataSourceMedicamento.data[index]['codeDiagnostico'],
            "codigoMedicamento": this.dataSourceMedicamento.data[index]['code'],
            "dosis": +this.dataSourceMedicamento.data[index]['dosis'],
            "unidadMedidaDosis": this.dataSourceMedicamento.data[index]['unidadMedidaDosis'],
            "frecuencia": +this.dataSourceMedicamento.data[index]['frecuencia'],
            "unidadMedidaFrecuencia": this.dataSourceMedicamento.data[index]['unidadMedidaFrecuencia'],
            "duracion": +this.dataSourceMedicamento.data[index]['duracion'],
            "unidadMedidaDuracion": this.dataSourceMedicamento.data[index]['unidadMedidaDuracion'],
            "cantidadProducto": this.dataSourceMedicamento.data[index]['cantidadProducto'],
            "indicacionMedica": this.dataSourceMedicamento.data[index]['indicacionMedica']
          }
        )
      }


    }
  }

  guardarDataDiagnosticos() {
    this.listaServicios = true;

    //formando los array
    //this.guardarDiagnosticos();
    this.guardarApoyoDiagnostico();
    this.guardarProcedimientos();
    this.guardarReceta();

  }

  cargarDosis() {
    this.consultaMedService.cargarDosis()
      .subscribe((response: any) => {
        if (response.mensaje == 'OK' && response.operacion == 200) {
          this.listaDosis = response.data;
        }
      })
  }

  cargarFrecuencia() {
    this.consultaMedService.cargarFrecuencia()
      .subscribe((response: any) => {
        if (response.mensaje == 'OK' && response.operacion == 200) {
          this.listaFrecuencias = response.data;
        }
      })
  }

  cargarDuracion() {
    this.consultaMedService.cargarDuracion()
      .subscribe((response: any) => {
        if (response.mensaje == 'OK' && response.operacion == 200) {
          this.listaDuracion = response.data;
        }
      })
  }

  createArray(): any {
    this.guardarDataDiagnosticos();

    if (this.dataSourceServicio.data.length > 0) {
      this.enviarApoyoDiagnosticoService();
    }

    if (this.dataSourceProcedimiento.data.length > 0) {
      this.enviarProcedimientosService();
    }

    if (this.dataSourceMedicamento.data.length > 0) {
      this.enviarRecetasService();
    }
  }

  createArrayGetData(array: any, arrayString: any): any {
    if (this.stringArraySaveAll.includes('guardarApoyoDiagnostico') || this.stringArraySaveAll.includes('actualizarApoyoDiagnostico')) {
      array.push(this.consultaMedService.getApoyoDiagnosticos(this.numeroConsulta));
      arrayString.push('guardarApoyoDiagnostico');
    }
    if (this.stringArraySaveAll.includes('guardarProcedimientos') || this.stringArraySaveAll.includes('actualizarProcedimientos')) {
      array.push(this.consultaMedService.getProcedimientos(this.numeroConsulta));
      arrayString.push('guardarProcedimientos');
    }
    if (this.stringArraySaveAll.includes('guardarReceta') || this.stringArraySaveAll.includes('actualizarReceta')) {
      array.push(this.consultaMedService.getRecetas(this.numeroConsulta));
      arrayString.push('guardarReceta');
    }
  }

  createArrayUpdateData(arrayString: any, respuesta: any): any {
    if (arrayString.includes('guardarApoyoDiagnostico')) {
      const index = arrayString.indexOf('guardarApoyoDiagnostico');
      const getApoyoResp = respuesta[index];
      this.respGetApoyoDiagnostico(getApoyoResp);
    };
    if (arrayString.includes('guardarProcedimientos')) {
      const index = arrayString.indexOf('guardarProcedimientos');
      const getProcedimientoResp = respuesta[index];
      this.respGetProcedimientos(getProcedimientoResp);
    };
    if (arrayString.includes('guardarReceta')) {
      const index = arrayString.indexOf('guardarReceta');
      const getRecetaResp = respuesta[index];
      this.respGetRecetas(getRecetaResp);
    };
  }

  guardarTodo(flag:any = null): any {
    if (this.frmServicio && !this.frmServicio.form.valid) {
      this.alertaFormularioServicio();
      return;
    }
    if (this.frmProcedimiento && !this.frmProcedimiento.form.valid) {
      this.alertaFormularioProcedimiento();
      return;
    }
    if (this.formularioMedicamento && !this.formularioMedicamento.form.valid) {
      this.alertaFormulario();
      return;
    }
    if (this.informacion_paciente.dirty) {
      this.guardarCabeceraConsulta(null, null, null, null, 'informacion', true);
    }
    if (!this.formCreate.valid) {
      markFormGroupTouched(this.formCreate);
      const mensaje = {
        title : 'Mensaje del sistema',
        message : 'Los datos del formulario Detalle de la atención, no son válidos.'
      };
      this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: mensaje }
      });
      return;
    } else {
      this.guardarCabeceraConsulta(null, null, null, null, 'detalle', true);
    }
    const errorReceta = this.dataSourceMedicamento.data.find((f: any) => f.cantidadProducto > 999);
    if(errorReceta) {
      const mensaje = {
        title : 'Mensaje del sistema',
        message : 'Existen medicamentos con cantidades mayores a 999 dentro de la Receta.'
      };
      this.dialog.open(AlertComponent, {
          width: '400px', data: { alert: mensaje }
      });
      return;
    }
    if (!flag) {
     this.createArray();
    }
    if(flag) {
      return forkJoin(this.obsArraySaveAll);
    } else {
        forkJoin(this.obsArraySaveAll).subscribe(res => {
        this.updateDiagnosticos();
        let array = [];
        let arrayString = [];
        this.createArrayGetData(array, arrayString);
        forkJoin(array).subscribe(respuesta => {
          this.createArrayUpdateData(arrayString, respuesta);
              this.ejecutarEvento();
        });
        this.clearArray();
      }, (err: any) => {
        this.clearArray();
        const errorData = this.consultaMedService.errorValue;
        const index = errorData.error.data.length;
        this.dialog.closeAll();
        const data = {
          title : 'Mensaje del sistema',
          message : errorData.error.data[index -1].codigoProcedimiento ||  errorData.error.data[index -1].codigoMedicamento ||  errorData.error.data[index -1].codigoDiagnostico,
        }
        this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
        });
      });
    }
  }

  actualizarDetalleAtencion() {
    this.formCreate.controls.signosSintomas.setValue(this.data_consulta.signosSintomas);
    this.formCreate.controls.anamesis.setValue(this.data_consulta.anamesis);
    this.formCreate.controls.examenPreferencial.setValue(this.data_consulta.examenPreferencial);
    this.formCreate.controls.apoyoDiagnostico.setValue(this.data_consulta.apoyoDiagnostico);
    this.formCreate.controls.tratamiento.setValue(this.data_consulta.tratamiento);
    this.formCreate.controls.procedimientos.setValue(this.data_consulta.procedimientos);
    this.formCreate.controls.recomendaciones.setValue(this.data_consulta.recomendaciones);
  }



  getDetalleConsultaMedica(numeroConsulta: string) {
    let obs = this.consultaMedService.getConsultorios(numeroConsulta).pipe(mergeMap(
      (lista) => {
        return forkJoin([
          of(lista),
    this.consultaMedService.getDetalleConsultaMedica(numeroConsulta)
        ])
      }
    ));
    this.subscription = obs.subscribe(res => {
      const respConsultorio = res[0];
      const response = res[1];
      if(respConsultorio.status === 200) {
        if( respConsultorio.body.data) {
          this.consultoriosList = respConsultorio.body.data;
        }
      }
        if (response && response.mensaje == 'OK' && response.operacion == 200 && response.data) {
          //información del paciente
          if (response.data['peso'] || response.data['talla'] || response.data['imc'] || response.data['frecuenciaRespiratoria'] ||
            response.data['frecuenciaCardiaca'] || response.data['presion'] || response.data['temperaturaOral'] ||
            response.data['temperaturaOtica'] || response.data['temperaturaRectal'] || response.data['temperaturaRectal']) {
            this.inf_paciente = true;
          }
          this.informacion_paciente.controls.peso.setValue(response.data['peso']);
          this.informacion_paciente.controls.talla.setValue(response.data['talla']);
          this.informacion_paciente.controls.imc.setValue(response.data['imc']);
          this.informacion_paciente.controls.frecuenciaRespiratoria.setValue(response.data['frecuenciaRespiratoria']);
          this.informacion_paciente.controls.frecuenciaCardiaca.setValue(response.data['frecuenciaCardiaca']);
          this.informacion_paciente.controls.presion.setValue(response.data['presion']);
          this.informacion_paciente.controls.temperaturaOral.setValue(response.data['temperaturaOral']);
          this.informacion_paciente.controls.temperaturaOtica.setValue(response.data['temperaturaOtica']);
          this.informacion_paciente.controls.temperaturaRectal.setValue(response.data['temperaturaRectal']);
          this.informacion_paciente.controls.temperaturaAxilar.setValue(response.data['temperaturaAxilar']);
        this.informacion_paciente.controls.nroConsultorio.setValue(response.data['nroConsultorio']);
        this.informacion_paciente.controls.consultorio.setValue(response.data['nroConsultorio']);
        this.informacion_paciente.controls.tipoCita.setValue(response.data['tipoCita']);

          //detalle de la atención
          if (response.data['signosSintomas'] || response.data['anamesis'] || response.data['examenPreferencial'] ||
            response.data['apoyoDiagnostico'] || response.data['tratamiento'] || response.data['procedimientos']
            || response.data['recomendaciones']) {
            this.detalle_paciente = true;
          }
          this.formCreate.controls.signosSintomas.setValue(response.data['signosSintomas']);
          this.formCreate.controls.anamesis.setValue(response.data['anamesis']);
          this.formCreate.controls.examenPreferencial.setValue(response.data['examenPreferencial']);
          this.formCreate.controls.apoyoDiagnostico.setValue(response.data['apoyoDiagnostico']);
          this.formCreate.controls.tratamiento.setValue(response.data['tratamiento']);
          this.formCreate.controls.procedimientos.setValue(response.data['procedimientos']);
          this.formCreate.controls.recomendaciones.setValue(response.data['recomendaciones']);

          //datos de la consulta medica

          if (response.data['estado'] == 'EN ATENCION' || response.data['estado'] == 'EN ESPERA' || response.data['estado'] == 'EN ESPERA TRIAJE') {
            this.editarInformacion = true;
          }
          
          this.data_consulta = response.data

        if(response.data['tipoCita'] === 'P') {
          this.informacion_paciente.controls.consultorio.setValidators([Validators.required]);
          this.informacion_paciente.controls.consultorio.updateValueAndValidity();
        }
        if(response.data['nroConsultorio']) {
          this.codConsultorio = this.consultoriosList.find(c => c.descripcion === response.data['nroConsultorio']);
        }
        }
      })

  }

  getDiagnosticosIdentificados(numeroConsulta: string) {
    this.consultaMedService.getDiagnosticosIdentificados(numeroConsulta)
      .subscribe((response: any) => {
        if (response && response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {

          this.itemsDiagnosticos = true;
          this.listaServicios = true;
          this.data_diagnosticos = false;

          ELEMENT_DATA.length = 0
          for (let index = 0; index < response.data.length; index++) {
            ELEMENT_DATA.push(
              {
                value: response.data[index]['descripcionDiagnostico'],
                code: response.data[index]['codigoDiagnostico'],
                indicador: response.data[index]['indicador']
              }
            );

            this.cboservDiag.push(
              {
                code: response.data[index]['codigoDiagnostico'],
                value: response.data[index]['descripcionDiagnostico'],
                value_search: response.data[index]['descripcionDiagnostico'].substr(0, 4)
              }
            );
          }
          this.tempDiagnosticos = ELEMENT_DATA;
          this.dataSource.data = ELEMENT_DATA;
        } else {
          ELEMENT_DATA = [];
          this.cboservDiag = [];
          this.tempDiagnosticos = ELEMENT_DATA;
          this.dataSource.data = ELEMENT_DATA;
        }
      })
  }


  getApoyoDiagnosticos(numeroConsulta: string) {
    this.consultaMedService.getApoyoDiagnosticos(numeroConsulta)
  }

  respGetApoyoDiagnostico(response: any) {
        if(!response){
          ELEMENT_DATA_SERV = [];
          this.dataSourceServicio.data = ELEMENT_DATA_SERV;
    } else
          if (response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {
            this.itemsDiagnosticos = true;
            this.listaServicios = true;
            this.data_diagnosticos = false;
  
            ELEMENT_DATA_SERV.length = 0
            for (let index = 0; index < response.data.length; index++) {
              ELEMENT_DATA_SERV.push(
                {
                  numeroMovimiento: response.data[index]['numeroMovimiento'],
                  numeroOrden: response.data[index]['numeroOrden'],
                  code: response.data[index]['codigoProcedimiento'],
                  codeDiagnostico: response.data[index]['codigoDiagnostico'],
                  diagnosticoSeleccionado: response.data[index]['descripcionDiagnostico'],
                  servicio: response.data[index]['descripcionProcedimiento'],
                  cantidad: response.data[index]['cantidad'],
                  numOA: '-',
                  realizado: response.data[index]['realizado'],
                  interno: response.data[index]['interno']
                }
              );
            }
            this.dataSourceServicio.data = ELEMENT_DATA_SERV;
          }
        }

  getProcedimientos(numeroConsulta: string) {
    this.consultaMedService.getProcedimientos(numeroConsulta)
  }

  respGetProcedimientos(response: any) {
        if (response) {
          if (response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {
            this.itemsDiagnosticos = true;
            this.listaServicios = true;
            this.data_diagnosticos = false;

            ELEMENT_DATA_PROC.length = 0
            for (let index = 0; index < response.data.length; index++) {
              ELEMENT_DATA_PROC.push(
                {
                  numeroMovimiento: response.data[index]['numeroMovimiento'],
                  numeroOrden: response.data[index]['numeroOrden'],
                  code: response.data[index]['codigoProcedimiento'],
                  codeDiagnostico: response.data[index]['codigoDiagnostico'],
                  procedimientoSeleccionado: response.data[index]['descripcionDiagnostico'],
                  procedimiento: response.data[index]['descripcionProcedimiento'],
                  cantidad: response.data[index]['cantidad'],
                  numOA: '-',
                  realizado: response.data[index]['realizado'],
                  interno: response.data[index]['interno']
                }
              );
            }
            this.dataSourceProcedimiento.data = ELEMENT_DATA_PROC;
          }
        } else {
          ELEMENT_DATA_PROC = [];
          this.dataSourceProcedimiento.data = ELEMENT_DATA_PROC;
        }
  }


  getCodUsuario() {
    this.consultaMedService.getCodUsuario(this.current_user['loginUserName'])
      .subscribe((response: any) => {
        this.getSedeByCodMedico(response.data.codigo);
      });
  }

  getSedeByCodMedico(codMedico: string) {
    this.profesionalservice.getSede(codMedico)
      .subscribe((response: any) => {
        this.destinos = response.data;
        this.formularioReferencia.controls.origen.setValue(this.data_consulta['sede'])
      });
  }

  getRecetas(numeroConsulta: string) {
    this.consultaMedService.getRecetas(numeroConsulta)
  }

  respGetRecetas(response: any) {
        if (response) {
          if (response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {
            this.itemsDiagnosticos = true;
            this.listaServicios = true;
            this.data_diagnosticos = false;

            ELEMENT_DATA_MED.length = 0
            for (let index = 0; index < response.data.length; index++) {
              ELEMENT_DATA_MED.push(
                {

                  numeroMovimiento: response.data[index]['correlativo'],
                  //numeroOrden: response.data[index]['numeroMovimiento'],
                  codeDiagnostico: response.data[index]['codigoDiagnostico'],
                  //codeDiagnostico : "E039",
                  code: response.data[index]['codigoMedicamento'],
                  medicamentoSelecionado: response.data[index]['nombre'],
                  dosis: response.data[index]['dosis'],
                  unidadMedidaDosis: response.data[index]['unidadMedidaDosis'],
                  frecuencia: response.data[index]['frecuencia'],
                  unidadMedidaFrecuencia: response.data[index]['unidadMedidaFrecuencia'],
                  duracion: response.data[index]['duracion'],
                  unidadMedidaDuracion: response.data[index]['unidadMedidaDuracion'],
                  cantidadProducto: response.data[index]['cantidadProducto'],
                  indicacionMedica: response.data[index]['indicacionMedica'],
                  indicaciones: response.data[index]['indicaciones']

                }
              );
            }
            this.dataSourceMedicamento.data = ELEMENT_DATA_MED;
          }
        } else {
          ELEMENT_DATA_MED = [];
          this.dataSourceMedicamento.data = ELEMENT_DATA_MED;
        }
  }

  getReferencia(numeroConsulta: string) {

    this.consultaMedService.getReferencia(numeroConsulta)
      .subscribe((response: any) => {
        if (response) {
          if (response.mensaje == 'OK' && response.operacion == 200 && response.data) {
            this.getUPS();
            this.datos_referencia = true;
            this.agregarReferencia = true;
            this.formularioReferencia.controls.nroReferencia.setValue(response.data['numeroReferencia']);
            this.formularioReferencia.controls.fechaReferencia.setValue(response.data['fecha']);
            this.formularioReferencia.controls.origen.setValue(response.data['establecimientoOrigen']);
            this.formularioReferencia.controls.destino.setValue(response.data['establecimientoDestino']);
            this.formularioReferencia.controls.upsReferencia.setValue(response.data['codigoUpsDestino'] + '|' + response.data['upsDestino']);
            this.formularioReferencia.controls.upsReferencia_desc.setValue(response.data['upsDestino']);
            this.formularioReferencia.controls.examenEspecial.setValue(response.data['codigoProcedimiento'] + '|' + response.data['procedimiento']);
            this.formularioReferencia.controls.examenEspecial_desc.setValue(response.data['procedimiento']);
            this.formularioReferencia.controls.especialidades.setValue(response.data['codigoEspecialidadDestino']);
            this.formularioReferencia.controls.condicion.setValue(response.data['codigoCondicionInicial']);

          }
        }

      });
  }

  editarDiagnosticos() {
    this.listaServicios = false;
  }

  getUPS() {
    this.consultaMedService.getUPS()
      .subscribe((response: any) => {
        if (response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {
          this.ups = response.data
        }
      });
  }

  getSedes() {
    this.consultaMedService.getSedes()
      .subscribe((response: any) => {
        if (response.mensaje == 'OK' && response.operacion == 200 && response.data.length > 0) {
          this.establecimiento = response.data
        }
      });
  }

  enviarDiagnosticosService() {
    this.consultaMedService.guardarDiagnosticos(this.diagnosticosGuardar, this.numeroConsulta)
      .subscribe((response: any) => {
      });
  }

  clearArray() {
    this.obsArraySaveAll = [];
    this.stringArraySaveAll = [];
  }


  enviarApoyoDiagnosticoService() {
    if (this.apoyoGuardar.apoyosDiagnostico.length > 0) {
      this.obsArraySaveAll.push(this.consultaMedService.guardarApoyoDiagnostico(this.apoyoGuardar, this.numeroConsulta));
      this.stringArraySaveAll.push('guardarApoyoDiagnostico');
    }

    if (this.apoyoActualizar.apoyosDiagnostico.length > 0) {
      this.obsArraySaveAll.push(this.consultaMedService.actualizarApoyoDiagnostico(this.apoyoActualizar, this.numeroConsulta));
      this.stringArraySaveAll.push('actualizarApoyoDiagnostico');
    }
  }

  enviarProcedimientosService() {
    if (this.procedimientosGuardar.procedimientos.length > 0) {
      this.procedimientosGuardar.procedimientos.forEach(element => {
        this.apoyoGuardar.apoyosDiagnostico.push(element);
      });
      const index = this.stringArraySaveAll.indexOf('guardarApoyoDiagnostico')
      if(index >= 0) {
        this.obsArraySaveAll[index] = this.consultaMedService.guardarApoyoDiagnostico(this.apoyoGuardar, this.numeroConsulta);
      } else {
        this.obsArraySaveAll.push(this.consultaMedService.guardarApoyoDiagnostico(this.apoyoGuardar, this.numeroConsulta));
        this.stringArraySaveAll.push('guardarApoyoDiagnostico');
      }
      // this.obsArraySaveAll.push(this.consultaMedService.guardarProcedimientos(this.procedimientosGuardar, this.numeroConsulta));
      this.stringArraySaveAll.push('guardarProcedimientos');
    }

    if (this.procedimientosActualizar.procedimientos.length > 0) {
      this.procedimientosActualizar.procedimientos.forEach(element => {
        this.apoyoActualizar.apoyosDiagnostico.push(element);
      });
      const index = this.stringArraySaveAll.indexOf('actualizarApoyoDiagnostico')
      if(index >= 0) {
        this.obsArraySaveAll[index] = this.consultaMedService.actualizarApoyoDiagnostico(this.apoyoActualizar, this.numeroConsulta);
      } else {
        this.obsArraySaveAll.push(this.consultaMedService.actualizarApoyoDiagnostico(this.apoyoActualizar, this.numeroConsulta));
        this.stringArraySaveAll.push('actualizarApoyoDiagnostico');
      }
      // this.obsArraySaveAll.push(this.consultaMedService.actualizarProcedimientos(this.procedimientosActualizar, this.numeroConsulta));
      this.stringArraySaveAll.push('actualizarProcedimientos');
    }
  }

  enviarRecetasService() {
    if (this.recetaGuardar.recetas.length > 0) {
      this.obsArraySaveAll.push(this.consultaMedService.guardarReceta(this.recetaGuardar, this.numeroConsulta));
      this.stringArraySaveAll.push('guardarReceta');
    }

    if (this.recetaActualizar.recetas.length > 0) {
      this.obsArraySaveAll.push(this.consultaMedService.actualizarReceta(this.recetaActualizar, this.numeroConsulta));
      this.stringArraySaveAll.push('actualizarReceta');
    }
  }


  guardarCabeceraConsulta( estado:string = null, numDocfirmado: number = null, permiteFirmar: any = null, numIntentoFirmado: number = null, formulario: any = null, btnGuardar?: any) {
   
   
    switch(formulario) {
      case 'informacion':
        markFormGroupTouched(this.informacion_paciente);
    if(!this.informacion_paciente.valid) {
      return;
    }
        break;
      case 'detalle':
        markFormGroupTouched(this.formCreate);
        if(!this.formCreate.valid) {
          return;
        }
        break;
      default:
        // code block
    }
    
    if (this.informacion_paciente.controls.peso.value || this.informacion_paciente.controls.talla.value ||
      this.informacion_paciente.controls.imc.value || this.informacion_paciente.controls.frecuenciaRespiratoria.value ||
      this.informacion_paciente.controls.frecuenciaCardiaca.value || this.informacion_paciente.controls.presion.value ||
      this.informacion_paciente.controls.temperaturaRectal.value || this.informacion_paciente.controls.temperaturaOtica.value ||
      this.informacion_paciente.controls.temperaturaAxilar.value || this.informacion_paciente.controls.temperaturaOral.value) {

      this.inf_paciente = true;

    }

    if (this.formCreate.controls.signosSintomas.value || this.formCreate.controls.anamesis.value ||
      this.formCreate.controls.examenPreferencial.value || this.formCreate.controls.apoyoDiagnostico.value ||
      this.formCreate.controls.tratamiento.value || this.formCreate.controls.procedimientos.value ||
      this.formCreate.controls.recomendaciones.value) {

      this.detalle_paciente = true;

    }

    if(this.isNurseValue && this.data_consulta['estado'] === 'EN ESPERA TRIAJE') {
      estado = 'E'
    }
    if(this.isNurseValue && this.data_consulta['estado'] === 'EN ESPERA') {
      estado = 'E'
    }

    const cabecera = {
      "peso": this.informacion_paciente.controls.peso.value ? +this.twoDecimal(this.informacion_paciente.controls.peso.value) : 0,
      "talla": this.informacion_paciente.controls.talla.value ? this.twoDecimal(this.informacion_paciente.controls.talla.value) : 0,
      "imc": this.informacion_paciente.controls.imc.value ? this.informacion_paciente.controls.imc.value : '',
      "frecuenciaRespiratoria": this.informacion_paciente.controls.frecuenciaRespiratoria.value
        ? this.informacion_paciente.controls.frecuenciaRespiratoria.value : '',
      "frecuenciaCardiaca": this.informacion_paciente.controls.frecuenciaCardiaca.value
        ? this.informacion_paciente.controls.frecuenciaCardiaca.value : '',
      "presion": this.informacion_paciente.controls.presion.value ? this.informacion_paciente.controls.presion.value : '',
      "temperaturaOral": this.informacion_paciente.controls.temperaturaOral.value ? this.twoDecimal(this.informacion_paciente.controls.temperaturaOral.value) : 0,
      "temperaturaOtica": this.informacion_paciente.controls.temperaturaOtica.value ? this.twoDecimal(this.informacion_paciente.controls.temperaturaOtica.value) : 0,
      "temperaturaRectal": this.informacion_paciente.controls.temperaturaRectal.value ? this.twoDecimal(this.informacion_paciente.controls.temperaturaRectal.value) : 0,
      "temperaturaAxilar": this.informacion_paciente.controls.temperaturaAxilar.value ? this.twoDecimal(this.informacion_paciente.controls.temperaturaAxilar.value) : 0,
      "nroConsultorio": this.codConsultorio ? this.codConsultorio.codigo : '',
      "signosSintomas": this.formCreate.controls.signosSintomas.value,
      "anamesis": this.formCreate.controls.anamesis.value,
      "examenPreferencial": this.formCreate.controls.examenPreferencial.value,
      "apoyoDiagnostico": this.formCreate.controls.apoyoDiagnostico.value,
      "tratamiento": this.formCreate.controls.tratamiento.value,
      "procedimientos": this.formCreate.controls.procedimientos.value,
      "recomendaciones": this.formCreate.controls.recomendaciones.value,
      "estado": estado
    }
    this.eventTracker.postEventTracker("opc54", JSON.stringify(cabecera)).subscribe()
    if(estado){
    this.consultaMedService.actualizarCabeceras(cabecera, this.numeroConsulta)
      .subscribe((response: any) => {
        this.clearArray();
        if (response.operacion == 201) {
          if (this.data_consulta['estado'] === 'EN ATENCIÓN') {
            this.data_consulta['estado'] = 'ATENDIDO';
          }
          if(this.isNurseValue && this.data_consulta['estado'] === 'EN ESPERA TRIAJE') {
            this.ejecutarEvento();
            return;
          }
          if(this.isNurseValue && this.data_consulta['estado'] === 'EN ESPERA') {
            this.ejecutarEvento();
            return;
          }
          const data = {
            title: 'Éxito',
            message: `Se firmaron ${numIntentoFirmado} de ${numDocfirmado} documentos.`,
            type: 4
          }
          const data2 = {
            title: 'Alerta',
            message: 'EL MÉDICO NO CUENTA CON EL CERTIFICADO DIGITAL',
            type: 4
          }
          
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '400px', data: { alert: permiteFirmar ? data : data2 }
          });
          
          dialogRef.afterClosed().subscribe(result => {
            this.ejecutarEvento();
          });          
        }
      });
    }else{
      this.consultaMedService.actualizarCabeceras(cabecera, this.numeroConsulta)
      .subscribe((response: any) => {
        this.clearArray();
        if (response.operacion == 201) {
          if (this.codConsultorio && this.codConsultorio.descripcion) {
           this.informacion_paciente.controls.nroConsultorio.setValue(this.codConsultorio.descripcion);
          }
          if (this.data_consulta['estado'] == 'EN ESPERA') {
            this.data_consulta['estado'] = 'EN ATENCIÓN';
          }
            this.ejecutarEvento();

          const data = {
            title: 'Éxito',
            message: 'El detalle del paciente ha sido actualizado con éxito.',
            type: 4
          }

          if (!btnGuardar) {
          const dialogRef = this.dialog.open(SuccessComponent, {
              width: "400px",
              data: { alert: data },
          });
          }

          /*}else{
            this.router.navigate(['medical-appointments']);
          }*/
        }
      });
  }
  }

  twoDecimal(value) {
    return parseFloat(value);
  }


  enviarReferencia() {
   
  
    this.datos_referencia = true;
    var arrayUPS = this.formularioReferencia.controls.upsReferencia.value.split('|')

    if (this.formularioReferencia.controls.examenEspecial.value != '') {
      var arrayExamenEspecial = this.formularioReferencia.controls.examenEspecial.value.split('|')
    }

    const request = {
      "codigoSede": this.data_consulta['codigoSede'],
      "fecha": moment(this.formularioReferencia.controls.fechaReferencia.value).format(BASE_DATE_FORMAT_API),
      "establecimientoOrigen": this.formularioReferencia.controls.origen.value,
      "establecimientoDestino": this.formularioReferencia.controls.destino.value,
      "codigoUpsDestino": +arrayUPS[0],
      "codigoProcedimiento": this.formularioReferencia.controls.examenEspecial.value ? null : 0,
      "codigoEspecialidadDestino": this.formularioReferencia.controls.especialidades? 0 : +this.formularioReferencia.controls.especialidades.value,
      "codigoCondicionInicial": +this.formularioReferencia.controls.condicion.value
    }
    this.eventTracker.postEventTracker("opc53", JSON.stringify(request)).subscribe()

    if (this.formularioReferencia.controls.nroReferencia.value > 0) {
      this.consultaMedService.actualizarReferencia(request, this.formularioReferencia.controls.nroReferencia.value, +this.numeroConsulta)
        .subscribe((response: any) => {
          if (response.operacion == 201) {
            this.formularioReferencia.get('nroReferencia').patchValue(response.data.numeroReferencia);
            const data = {
              title: 'Éxito',
              message: 'La referencia ha sido actualizada con éxito.',
              type: 4
            }

            const dialogRef = this.dialog.open(SuccessComponent, {
              width: '400px', data: { alert: data }
            });
          }
        });
    } else {
      this.consultaMedService.enviarReferencia(request, +this.numeroConsulta)
        .subscribe((response: any) => {
          if (response.operacion == 201) {

            const data = {
              title: 'Éxito',
              message: 'La referencia ha sido registrada con éxito.',
              type: 4
            }

            const dialogRef = this.dialog.open(SuccessComponent, {
              width: '400px', data: { alert: data }
            });
          }
        });
    }

  }

  registrarReferencia(estado: boolean) {

    this.datos_referencia = estado;
    this.formularioReferencia.controls.fechaReferencia.setValue(
      moment(this.formularioReferencia.controls.fechaReferencia.value).format(BASE_DATE_FORMAT_API));
  }


  setUPS(origen: any) {
    //this.formularioReferencia.controls.upsReferencia.setValue(origen.codigo)
    var arrayDeCadenas = origen.value.split('|');
    this.formularioReferencia.controls.upsReferencia_desc.setValue(arrayDeCadenas[1])
    if (arrayDeCadenas[0] == '3') {
      this.formularioReferencia.controls.especialidades.setValue('0');
    } else {
      this.formularioReferencia.controls.examenEspecial.setValue('');
    }
  }

  setExamenEspecial(origen: any) {
    var arrayDeCadenas = origen.value.split('|');
    //this.formularioReferencia.controls.examenEspecial.setValue(origen.codigo)
    this.formularioReferencia.controls.examenEspecial_desc.setValue(arrayDeCadenas[1])
  }

  changeInterno(e: any, element: any) {
    let index = this.dataSourceServicio.data.indexOf(element, 0)
    this.dataSourceServicio.data[index]['interno'] = e.value;
  }

  changeInternoProc(e: any, element: any) {
    let index = this.dataSourceProcedimiento.data.indexOf(element, 0)
    this.dataSourceProcedimiento.data[index]['interno'] = e.value;
  }

  imprimir( base64:string, nombre:string){
    let data="data:application/pdf;base64,"+base64;
    this.pdfBase64 = data;
    
    const pdf = document.getElementById('pdf')

    var winparams = 'resizable,width=850px,height=1050px';
    var printWindow = window.open('', "PDF", winparams);

    printWindow.document.head.innerHTML = '<title>'+ nombre+'</title>';
    printWindow.document.body.append(pdf)
  
    printWindow.document.getElementById('print')
    setTimeout(
      ()=>printWindow.print(),
      1500
    )
    printWindow.onbeforeunload = ()=>{
      document.getElementById('print').append(pdf)
    }

    printWindow.onafterprint = ()=>{
      printWindow.close()
    }              
  } 

  imprimirReceta() {

    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: 0,
      tipoDocumento: "receta"
    }

    this.eventTracker.postEventTracker("opc47", JSON.stringify(request)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
        let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'receta',
      token:'123456'
        }

        if(response.status == 200){

            const firmado = response.body.data.estaFirmado;

            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if(response){
                /*if(!firmado){
                  this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)
                }else{
                  const base64Response = await fetch( "data:application/pdf;base64,"+response.data.base64 )
                  const blob = await base64Response.blob();

                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = response.data.nombre;
                  a.click()
                }*/
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              }
            })
          
        }else if(response.status == 204){
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if(response){              
                //this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)  
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              }
            })
          
        }else{
          const data = {
            title : 'Mensaje del sistema',
            message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
          }

          this.dialog.open(AlertComponent, { 
              width: '400px', data: { alert: data } 
          });
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

/*     this.consultaMedService.generarArchivo(this.data_consulta['numeroConsulta'], request)
      .subscribe((response: any) => {
        if (response) {

          let data="data:application/pdf;base64,"+response.data.base64;
          this.pdfBase64 = data;
          
          const pdf = document.getElementById('pdf')

          var winparams = 'resizable,width=850px,height=1050px';
          var printWindow = window.open('', "PDF", winparams);

          printWindow.document.head.innerHTML = '<title>'+ response.data.nombre+'</title>'+'<style type="text/css" media="print"> @page { size: landscape; }</style> ';
          printWindow.document.body.append(pdf)
        
          setTimeout(
            ()=>printWindow.print(),
            1500
          )
          printWindow.onbeforeunload = ()=>{
            document.getElementById('print').append(pdf)
          }

          printWindow.onafterprint = ()=>{
            printWindow.close()
          }

        } else {
          const data = {
            title: 'Mensaje del sistema',
            message: 'Lo sentimos, en estos momentos no podemos generar el documento.',
          }

          const dialogRef = this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
          });
        }
      }); */



  imprimirProcedimientos() {
   
   
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: this.dataSourceProcedimiento.data.length > 0?this.dataSourceProcedimiento.data[0]['numeroOrden']:0,
      tipoDocumento: "orden_atencion_procedimiento"
    }

    this.eventTracker.postEventTracker("opc44", JSON.stringify(request)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
    let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
          ordenAtencion: this.dataSourceProcedimiento.data.length > 0?this.dataSourceProcedimiento.data[0]['numeroOrden']:0,
      tipoDocumento: 'orden_atencion_procedimiento',
          token:'123456'
    }
          
        if(response.status == 200){

            const firmado = response.body.data.estaFirmado;

            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if(response){
                /*if(!firmado){
                  this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)
                }else{
                  const base64Response = await fetch( "data:application/pdf;base64,"+response.data.base64 )
                  const blob = await base64Response.blob();
        
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = response.data.nombre;
                  a.click()
                }*/
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
          }
            })

        }else if(response.status == 204){
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if(response){              
                //this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)  
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
          }
            })
          
        } else {
          const data = {
            title: 'Mensaje del sistema',
            message: 'Lo sentimos, en estos momentos no podemos generar el documento.',
          }

          this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: data }
          });
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  imprimirApoyoDiag() {
    
  
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: this.dataSourceServicio.data.length?this.dataSourceServicio.data[0]['numeroOrden']:0,
      tipoDocumento: "orden_atencion_apoyo_dx"
    }

    this.eventTracker.postEventTracker("opc41", JSON.stringify(request)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
    let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: this.dataSourceServicio.data.length?this.dataSourceServicio.data[0]['numeroOrden']:0,
      tipoDocumento: 'orden_atencion_apoyo_dx',
      token:"123456"
    }

        if(response.status == 200){

            const firmado = response.body.data.estaFirmado;

            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if(response){
                /*if(!firmado){
                  this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)
                }else{
                  const base64Response = await fetch( "data:application/pdf;base64,"+response.data.base64 )
                  const blob = await base64Response.blob();
        
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = response.data.nombre;
                  a.click()
                }*/
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
          }
            })

        }else if(response.status == 204){
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if(response){              
                //this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)  
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
          }
            })
        
        } else {
          const data = {
            title: 'Mensaje del sistema',
            message: 'Lo sentimos, en estos momentos no podemos generar el documento.',
          }

          this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: data }
          });
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  previewFichaConsentimiento() {
    this.showComponentPDF('assets/files/HC.pdf');
  }

  showComponentPDF(src: any) {
    let dialogRef = this.dialog.open(PdfViewerComponent, {
      id: 'pdf-view-dialog',
      height: '95vh'
    });

    let instance = dialogRef.componentInstance;
    instance.src = src;
    instance.originalSize = false;
    instance.autoresize = true;
    instance.fitToPage = true;
    instance.renderText = true;
    instance.showAll = true;

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  calcularCantidad(e: any, index: number) {

    if (+this.dataSourceMedicamento.data[index]['dosis'] >= 0 &&
      this.dataSourceMedicamento.data[index]['unidadMedidaDosis'] != '' &&
      +this.dataSourceMedicamento.data[index]['frecuencia'] >= 0 &&
      this.dataSourceMedicamento.data[index]['unidadMedidaFrecuencia'] != '' &&
      +this.dataSourceMedicamento.data[index]['duracion'] >= 0 &&
      this.dataSourceMedicamento.data[index]['unidadMedidaDuracion'] != '') {

      const request = {
        "dosis": +this.dataSourceMedicamento.data[index]['dosis'],
        "unidadMedidaDosis": this.dataSourceMedicamento.data[index]['unidadMedidaDosis'],
        "frecuencia": +this.dataSourceMedicamento.data[index]['frecuencia'],
        "unidadMedidaFrecuencia": this.dataSourceMedicamento.data[index]['unidadMedidaFrecuencia'],
        "duracion": +this.dataSourceMedicamento.data[index]['duracion'],
        "unidadMedidaDuracion": this.dataSourceMedicamento.data[index]['unidadMedidaDuracion']
      }

      this.consultaMedService.calcularCantidad(request, +this.numeroConsulta)
        .subscribe((response: any) => {
          if (response.operacion == 200) {
            this.dataSourceMedicamento.data[index]['cantidadProducto'] = response.data.cantidadMedicamentos;
          }
        });

    }

  }

  finalizarAtencion() {
    this.alertaFormulario();
    if(this.hasError) return;
    this.eventTracker.postEventTracker("opc55",JSON.stringify(this.data_consulta)).subscribe()
  
    this.createArray();
    if(this.obsArraySaveAll.length === 0) {
      this.finalizaTemp();
    } else {
    this.guardarTodo(true).subscribe(res => {
        this.updateDiagnosticos();
        let array = [];
        let arrayString = [];
        this.createArrayGetData(array, arrayString);
        forkJoin(array).subscribe(respuesta => {
          this.createArrayUpdateData(arrayString, respuesta);
            this.ejecutarEvento();
        });
      this.clearArray();
      this.finalizaTemp();
    }, (err: any) => {
      const errorData = this.consultaMedService.errorValue;
      const index = errorData.error.data.length;
      this.dialog.closeAll();
      const data = {
        title : 'Mensaje del sistema',
        message : errorData.error.data[index -1].codigoProcedimiento,
      }
      this.dialog.open(AlertComponent, {
          width: '400px', data: { alert: data }
      });
      return null;
    });
    }
    // rutina buscar si tiene certificado
  }

  async finalizaTemp() {
    if (this.informacion_paciente.dirty) {
      this.guardarCabeceraConsulta(null, null, null, null, 'informacion', true);
    }
    if (!this.formCreate.valid) {
      markFormGroupTouched(this.formCreate);
      const mensaje = {
        title : 'Mensaje del sistema',
        message : 'Los datos del formulario Detalle de la atención, no son válidos.'
      };
      this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: mensaje }
      });
      return;
    } else {
      this.guardarCabeceraConsulta(null, null, null, null, 'detalle', true);
    }
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    let requestGenera:any = {
        codigoMedico:+localStorage.getItem('codMedico'),
        ordenAtencion: 0,
        tipoDocumento: 'odontograma_inicial',
        token: '123456'
    }
    // const responseGenera = await this.consultaMedService.generarArchivo(numeroConsulta, requestGenera).toPromise();
    let request = {
      token: '000000',
      codigoMedico: +localStorage.getItem('codMedico'),
      ordenAtencionApoyoDx: this.dataSourceServicio.data.length ? this.dataSourceServicio.data[0]['numeroOrden'] : 0,
      ordenAtencionConstanciaAtencion: 0,
      ordenAtencionEpisodioActual: 0,
      ordenAtencionHcInicial: 0,
      ordenAtencionProcedimiento: this.dataSourceProcedimiento.data.length ? this.dataSourceProcedimiento.data[0]['numeroOrden'] : 0,
      ordenAtencionReceta: 0,
      ordenAtencionDescansoMedico: 0,
      odontogramaInicial: 0,
      odontogramaEvolutivo: 0
    }
    if (this.medico && this.medico.certificado) {
      let dialogRef = this.dialog.open(SignDocumentComponent, {
        width: '550px',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          request.token = result;

          const filtro = {
            "token":  request.token
          }
          this.eventTracker.postEventTracker("opc56",JSON.stringify({...request, ...filtro})).subscribe()

          this.consultaMedService.finalizarAtencion2(this.data_consulta['numeroConsulta'], request).subscribe((response: any) => {
            if (response.operacion == 200) {
              this.guardarCabeceraConsulta('T', +response.data.numeroDocumentoFirmado, response.data.permiteFirmar, +response.data.numeroIntentoFirmado);
            } else {
              const data = {
                title: 'Alerta',
                message: response.mensaje,
                type: 4
              }

              const dialogRef = this.dialog.open(AlertComponent, {
                width: '400px', data: { alert: data }
              });
            }
          });
        }
      });
    } else {
      this.consultaMedService.finalizarAtencion2(this.data_consulta['numeroConsulta'], request).subscribe((response: any) => {
        if (response.operacion == 200) {
          this.guardarCabeceraConsulta('T', +response.data.numeroDocumentoFirmado, response.data.permiteFirmar, +response.data.numeroIntentoFirmado);
        } else {
          const data = {
            title: 'Alerta',
            message: response.mensaje,
            type: 4
          }

          const dialogRef = this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
          });
        }
      });
    }
  }

  generarPedido() {
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'receta',
      token:'123456'
    }

    this.consultaMedService.generarPedido(numeroConsulta, request)
      .subscribe( async (response: any) => {
        if(response) {
          if(response.operacion == 200) {
            const data = { title: 'Éxito', message: 'El pedido se ha generado con éxito.', type: 4 };
            const dialogRef = this.dialog.open(SuccessComponent, {
              width: '400px', data: { alert: data }
            });
          } else {
            const data = { title : 'Mensaje del sistema', message : response.mensaje };
            this.dialog.open(AlertComponent, { 
                width: '400px', data: { alert: data } 
            });
          }
        }
      });
  }

  openMedicalRestModal(): void {
    
   
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request: any = {
      ordenAtencion: 0,
      tipoDocumento: 'descanso_medico'
    };

    const filtro = {
      "numeroConsulta":this.data_consulta['numeroConsulta'],
      "tipoDocumento": 'descanso_medico'
    }

    this.eventTracker.postEventTracker("opc57", JSON.stringify(filtro)).subscribe()

    this.consultaMedService.validarArchivo(numeroConsulta, request).subscribe(
      (res) => {
        const status = res.status === 200 ? false : true;
        const firmado = !status ? res.body.data.estaFirmado : false;
        if (firmado) {
          const dato = { title: 'Mensaje del sistema', message: 'El documento ya se encuentra firmado' };
          this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: dato }
          });
          return;
        } else {
          this.consultaMedService.consultarDescansoMedico(numeroConsulta)
            .subscribe((response: any) => {
              const data = response ? true : false;
              const dias = data ? response.data.numeroDiaDescanso : null;
              const dialogRef = this.dialog.open(MedicalRestComponent, {
                width: '550px',
                autoFocus: false,
                data: { data, numeroConsulta, dias }
              });
            })
        }
      },
      error => {

      }
    );


  }

  alertaDuplicados(mensaje: any = null) {
    const data = {
      title : 'Mensaje del sistema',
      message : mensaje ? mensaje : 'El código ya se encuentra registrado.'
    }
    this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: data }
    });
  }

  selectConsultorio(event): any  {
    this.codConsultorio = this.consultoriosList.find(c => c.descripcion === event.value);
  }

  alertaFormulario(mensaje: any = null) {
    if( this.formularioMedicamento && this.formularioMedicamento.form) {
      markFormGroupTouched(this.formularioMedicamento.form);
      if (!this.formularioMedicamento.form.valid) {
        this.hasError = true;
        const data = {
          title: "Mensaje del sistema",
          message: mensaje
            ? mensaje
            : "Ingrese la información requerida para cada medicamento de la receta.",
        };
      this.dialog.open(AlertComponent, {
          width: "400px",
          data: { alert: data },
      });
     }
    }
  }

  alertaFormularioServicio(mensaje: any = null) {
    if( this.frmServicio && this.frmServicio.form) {
    markFormGroupTouched(this.frmServicio.form);
    if (!this.frmServicio.form.valid) {
      const data = {
        title: "Mensaje del sistema",
        message: mensaje
          ? mensaje
          : "Ingrese la información requerida para cada diagnóstico.",
      };
    this.dialog.open(AlertComponent, {
        width: "400px",
        data: { alert: data },
    });
   }
  }
  }

  alertaFormularioProcedimiento(mensaje: any = null) {
    if( this.frmProcedimiento && this.frmProcedimiento.form) {
    markFormGroupTouched(this.frmProcedimiento.form);
    if (!this.frmProcedimiento.form.valid) {
      const data = {
        title: "Mensaje del sistema",
        message: mensaje
          ? mensaje
          : "Ingrese la información requerida para cada procedimiento.",
      };
    this.dialog.open(AlertComponent, {
        width: "400px",
        data: { alert: data },
    });
   }
  }
  }

  updateDiagnosticos() {
    forkJoin([
      this.consultaMedService.getApoyoDiagnosticos(this.numeroConsulta),
      this.consultaMedService.getProcedimientos(this.numeroConsulta),
      this.consultaMedService.getRecetas(this.numeroConsulta)]).subscribe(response => {
        this.respGetApoyoDiagnostico(response[0]);
        this.respGetProcedimientos(response[1]);
        this.respGetRecetas(response[2]);
    });
  }

  guardarNewReferencia(event: any) {
    if (!this.formCreate.valid) {
      markFormGroupTouched(this.formCreate);
      
      const mensaje = {
        title : 'Mensaje del sistema',
        message : 'Los datos del formulario Detalle de la atención, no son válidos.'
      };

      this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: mensaje }
      });
    } else {
      this.guardarReferencia(event.request, event.data, event.diagnostico);
    }
  }

  guardarReferencia(request: any, referencia: any, diagnostico: any) {
    this.guardarDiagnosticoReferencia(diagnostico);
    
    this.referenciaService.nuevaReferencia(request)
    .subscribe((response) => {
      if (response && response.codErr == 0) {
        const data = {
          title: 'Éxito',
          message: 'Referencia registrada con éxito.',
          type: 4
        };

        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '400px', data: { alert: data }
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.enviarNuevaReferencia(response.idReferencia, referencia);
        });
      }
    });
  }

  cargarReferencia(idReferencia: any) {
    const request = { CReferencia: idReferencia };

    this.referenciaService.detalleReferencia(request)
    .subscribe(response => {
      if(response && response.codErr == 0) {
        this.data_referencia = response.referencia;
        
        this.datos_referencia = true;
        this.agregarReferencia = true;
      }
    })
  }

  enviarNuevaReferencia(referenciaId: string, data: any) {
    const request = {
      referenciaIdOim: referenciaId,
      fecha: moment().format(BASE_DATE_FORMAT_API),
      establecimientoOrigen: data.establecimientoOrigen,
      establecimientoDestino: data.establecimientoDestino,
      codigoProcedimiento: data.codigoProcedimiento,
      codigoSede: data.codigoSede,
      codigoUpsDestino: data.codigoUpsDestino,
      codigoEspecialidadDestino: data.codigoEspecialidadDestino,
      codigoCondicionInicial: data.codigoCondicionInicial,
      observaciones: data.observaciones
    };

    this.consultaMedService.enviarReferencia(request, parseInt(this.numeroConsulta))
    .subscribe((response: any) => {
      if (response.operacion == 201) {
        this.cargarReferencia(referenciaId);
      }
    });
  }

  getNewReferencia(numeroConsulta: string) {
    this.consultaMedService.getReferencia(numeroConsulta)
    .subscribe((response: any) => {
      if (response && response.mensaje == 'OK' && response.operacion == 200 && response.data) {
        const idReferencia = response.data.numeroReferencia;
        this.cargarReferencia(idReferencia);
      }
    });
  }

  guardarDiagnosticoReferencia(diagnostico: any) {
    ELEMENT_DATA.push({ code: diagnostico.code, value: diagnostico.value, indicador: 'P' });
    this.dataSource.data = ELEMENT_DATA;
    this.itemsDiagnosticos = true;

    const data = {
      diagnosticos: [
        {
          codigoDiagnostico: diagnostico.code,
          indicador: 'P'
        }
      ]
    };

    this.consultaMedService.guardarDiagnosticos(data, this.numeroConsulta).subscribe((response: any) => {});
  }
}