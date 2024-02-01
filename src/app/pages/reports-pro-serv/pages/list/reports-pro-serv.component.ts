import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { DeleteAlertComponent } from '@shared/components/delete-alert/delete-alert.component';
import { ALERT_MESSAGES, ALERT_TYPE, BASE_DATE_FORMAT_API, CONTENT_TYPE, downloadBase64, MIN_CHARACTERS_SEARCH, MODULES, PATH_URL_DATA } from '@shared/helpers';
import { IMaestro, IPrograma } from '@shared/models/common/interfaces';
import { ICancelMedicalReportRequest, IGetListMedicalReportRequest, IGetListProfessionalsRequest, IListMaestroRequest, ISearchProgramRequest } from '@shared/models/request/interfaces';
import { IGetModulesResponse } from '@shared/models/response/interfaces';
import { AuthenticationService } from '@shared/services/authentication.service';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { MedicoService } from '@shared/services/medico.service';
import { ModalMessageService } from '@shared/services/modal-message.service';
import * as moment from 'moment';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'mapfre-reports-pro-serv',
  templateUrl: './reports-pro-serv.component.html',
  styleUrls: ['./reports-pro-serv.component.scss']
})
export class ReportsProServComponent implements OnInit {

  formGroupInformeMedico: FormGroup;

  isFilterVisible: boolean;
  disableButton: boolean;
  isSearched: boolean;

  companies: IMaestro[] = [];
  products: IMaestro[] = [];
  states: IMaestro[] = [];

  programs: IPrograma[] = [];
  pagination = 1;
  totalItems = 0;
  totalPages = 0;
  totalItemsPage = 3;

  companySelected: string;

  username: string;
  currentIp: string;
  sedesData: any;
  estadoData: any;
  especialidadesData: any;
  medicosData: any;
  diagnosticosData: any;
  procedimientosData: any;
  beneficiosData: any;
  hasRecords: boolean;
  statusFirmaInforme:boolean = false;
  dataSource: Array<any>;
  dataSourcePendiente: Array<any>;
  dataSourceFirmado: Array<any>;
  tipoDocumentoData: any;
  mostrarFiltros = false;
  codMedico:any=null;
  profile:any= null;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private comunService: ComunService,
              private medicoService:MedicoService,
              private modalService:ModalMessageService,
              private reportsProServService: ReportsProServService,
              private authService: AuthenticationService,
              private documentoService: DocumentoService,
              private router: Router,
              private eventTracker: EventTrackerService) { }

  ngOnInit() {
    this.eventTracker.postEventTracker("opc16", "").subscribe()
    this.setValuesFormBuilder();

    this.initComponents();

    this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.username = this.profile ? this.profile.loginUserName : 'WEBMASTER';

    // this.getIp();

    if(this.isMedic(this.profile)){
      this.getMedicByDni(this.profile.documentNumber)
    }else{
      setTimeout(() => {
        this.getComunes();
      });

      this.formGroupInformeMedico.controls.medico.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        tap(value => {
          if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
            this.getMedicos(value);
          }
        })
      ).subscribe();
    }
  }

  // Inicializar componente de filtro (estilos)
  initComponents() {
    let isDesktop = window.innerWidth > 991;
    let heightDevice = window.innerHeight;
    let element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }
  }

  getComunes() {
    this.comunService.getComun('estados')
      .subscribe((response: any) => {
        this.estadoData = response.body.data;
      });
    this.search(1);
  }

  // Valores iniciales de datos de formulario de búsqueda
  setValuesFormBuilder() {
    let fecha_desde = new Date();
    fecha_desde.setDate(fecha_desde.getDate()-30)
    this.formGroupInformeMedico = this.fb.group({
      sede: [''],
      nombre_dni: [''],
      medico: [''],
      especialidad: [999],
      fecha_desde: [fecha_desde],
      fecha_hasta: [new Date()],
      numeroConsulta: [''],
      delivery: [false],
      estado: ['A']
    });
  }

  getMedicos(text: any) {
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.body.data;
      });
  }

  onSelectedSearch(tipo: string, e: any) {
    switch (tipo) {
      case 'M':
        this.medicosData = [];
        this.getSedeByMedic(e.option.value.codigo);
      break;
      case 'S':
        var codMedico = this.formGroupInformeMedico.get('medico').value.codigo ? this.formGroupInformeMedico.get('medico').value.codigo : 0
        this.getEspecialidadByMedicAndSede(codMedico, e.value);
      break;
    }
  }

  descriptionMedico(cod:number){
    let medico:any ;
    if(this.medicosData == null)return ''
    medico = this.medicosData.find((data:any)=>data.codigo == cod)
    if(medico)return medico.descripcion
  }

  onDisplaySearch(value) {
    return value ? value.descripcion : '';
  }

  // Obtener IP local
  verFiltros() {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
      } else {
      this.mostrarFiltros = true;
    }
  }

  search(numPagina:number) {
    const request:IGetListMedicalReportRequest = {
      pacienteDatos       : this.formGroupInformeMedico.get('nombre_dni').value.toUpperCase(),
      registroClinico     : this.formGroupInformeMedico.get('numeroConsulta').value?this.formGroupInformeMedico.get('numeroConsulta').value:0,
      codigoSede          : this.formGroupInformeMedico.get('sede').value?this.formGroupInformeMedico.get('sede').value:0,
      codigoMedico        : this.formGroupInformeMedico.get('medico').value.codigo ? this.formGroupInformeMedico.get('medico').value.codigo : 0,
      codigoEspecialidad  : this.formGroupInformeMedico.get('especialidad').value?this.formGroupInformeMedico.get('especialidad').value:0,
      estadoFirmado       : this.statusFirmaInforme,

      fechaRegistro       :{
        fechaInicio         : this.formGroupInformeMedico.get('fecha_desde').value ?
                            moment(this.formGroupInformeMedico.get('fecha_desde').value).format(BASE_DATE_FORMAT_API)+' 00:00:00' : '',
        fechaFin            : this.formGroupInformeMedico.get('fecha_hasta').value ?
                            moment(this.formGroupInformeMedico.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API)+' 00:00:00' : ''
      },
      numeroPagina       : numPagina,
      tamanioPagina        : this.totalItemsPage
    };

    const filter = {
      "pacienteDatos: " : request.pacienteDatos,
      "registroClinico: " : request.registroClinico,
      "codigoSede: " : request.codigoSede,
      "codigoMedico: " : request.codigoMedico,
      "codigoEspecialidad: " : request.codigoEspecialidad,
      "estadoFirmado: " : request.estadoFirmado,
      "fechaInicio: " : request.fechaRegistro.fechaInicio,
      "fechaFin: " : request.fechaRegistro.fechaFin,
    }
    this.eventTracker.postEventTracker("opc17", JSON.stringify(filter)).subscribe()


    this.reportsProServService.getListMedicalReport(request)
    .subscribe((response) => {
      if ( response && response.data.length != 0) {
        this.dataSource = response.data;
        this.pagination = numPagina;
        this.hasRecords = true;
        this.totalItems = response.numeroRegistros;
        const totalPages = response.totalPaginas;
        if (totalPages < 1) { this.totalPages = 1; }
        if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
      } else {
        this.dataSource = null
        this.hasRecords = false;
      }
    },
    (error)=>{

    });
  }

  // Limpiar datos de formulario de búsqueda
  clean() {
    if(this.isMedic(this.profile)){
      let medico = this.formGroupInformeMedico.get('medico').value
      this.setValuesFormBuilder();
      this.formGroupInformeMedico.get('medico').patchValue(medico)
    }else{
      this.setValuesFormBuilder();
    }
    this.isSearched = false;
    this.hasRecords = false;
    this.dataSource= [];
  }

  // Enviar datos de formulario de búsqueda al servicio
  formGroupInformeMedicoSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
  }

  // Cambio de página con mismos filtros
  changePage(event: any) {
    this.pagination = event.page;
    this.search(this.pagination);
  }

  // Validar que tenga acceso al modulo PROGRAMAS
  validateRole() {
    this.authService.getModules().subscribe((response: IGetModulesResponse) => {
      if (response.codRpta == 200) {
        const { data } = response;
        if (data.length != 0) {
          let hasProgram = data.filter(obj => obj.nomCorto == MODULES.programas);
          if (hasProgram.length == 0) { this.openModalAccessError(); }
        } else {
          this.openModalAccessError();
        }
      } else {
        this.openModalAccessError();
      }
    });
  }

  // Mostrar/Ocultar filtro en vista responsive
  toggleFilter() {
    let isDesktop = window.innerWidth > 991;
    if (isDesktop) {
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      this.isFilterVisible = !this.isFilterVisible;
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      }
    }
  }

  // Objeto Request para filtro de empresas
  getCompaniesRequest(): IListMaestroRequest {
    return {
      opt: '1'
    };
  }

  // Objeto Request para filtro de productos (por empresa)
  getProductsRequest(codCompany: string): IListMaestroRequest {
    return {
      opt: '2',
      param3: codCompany
    };
  }

  // Objeto Request para filtro de estados
  getStatesRequest(): IListMaestroRequest {
    return {
      opt: '999',
      param3: '1'
    };
  }

  // Objeto Request para filtro de programas
  searchProgramRequest(fg: FormGroup): ISearchProgramRequest {
    let request: ISearchProgramRequest = {};
    if (fg.value.sede) { request.compania = fg.value.sede; }
    if (fg.value.producto) { request.codigoProducto = fg.value.producto; }
    if (fg.value.programa) { request.nombrePrograma = fg.value.programa; }
    if (fg.value.etiquetas) { request.etiqueta = fg.value.etiquetas; }
    if (fg.value.delivery) { request.medicamento = fg.value.delivery; }
    if (fg.value.estado) { request.estado = fg.value.estado; }
    request.p_size = String(this.totalItemsPage);
    request.p_page = String(this.pagination);
    return request;
  }

  // Mostrar modal de alerta
  openModalError() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.search)[0];

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  // Mostrar modal de alerta para archivo
  openModalErrorFile() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
    alert.title = 'Alerta';
    alert.message = 'No se pudo descargar el archivo correspondiente.';

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  // Mostrar modal de alerta en caso no tenga acceso a modulos
  openModalAccessError() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];

    alert.title = 'Alerta';
    alert.message = ALERT_MESSAGES[4].message + ' (Módulo PROGRAMAS)';

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.href = environment.oimHome;
    });
  }

  tabChange(e:any){
    switch(e.index){
      case 0:
        this.statusFirmaInforme = false
      break;

      case 1:
        this.statusFirmaInforme = true
      break;

      default:
    }

    this.search(1)
  }

  // Inicializar componente de filtro (estilos) cuando la ventana cambia de tamaño
  @HostListener('window:resize')
  onResize() {
    let isDesktop = window.innerWidth > 991;
    let heightDevice = window.innerHeight;
    let element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      this.isFilterVisible = false;
      element.style.top = 'auto';
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      element.style.top = heightDevice - 70 + 'px';
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      }
    }
  }

  openView(id) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  viewDetail(program) {
    let id = program.codigoPrograma;
    this.router.navigate([PATH_URL_DATA[4], id], { replaceUrl: false });
  }

  newReport(){
    this.eventTracker.postEventTracker("opc24", "").subscribe()
    this.router.navigate([PATH_URL_DATA.urlInformesProcServ,PATH_URL_DATA.urlNuevoInforme ]) ;
  }

  editInforme(id:number, dataInforme:any){
    // var filtro = {
    //   "codigoInformeMdico": id
    // }
    this.eventTracker.postEventTracker("opc18", JSON.stringify(dataInforme)).subscribe()
    this.router.navigate([PATH_URL_DATA.urlInformesProcServ,PATH_URL_DATA.urlDetalleInforme, id]) ;
  }

  download(informe:any){
    this.eventTracker.postEventTracker("opc23", JSON.stringify(informe)).subscribe()
    const filename:string= 'Informe No. '+informe.codigoInformeMedico+'.pdf';

    const request:any = {
      codigoItem: 29,
      numeroConsulta: informe.registroClinico.numeroConsulta,
      ordenAtencion: informe.registroClinico.numeroOrdenAtencion
    };

    this.documentoService.download(request).subscribe(
        (response)=>{
          if(response){
            downloadBase64(response.body.data.object, filename, CONTENT_TYPE.pdf);
          }else{
            return this.modalService.alert(false, '', ALERT_MESSAGES[5].message);
          }
        }
    )
  }

  delete(informe:any){
    this.eventTracker.postEventTracker("opc22", JSON.stringify(informe)).subscribe()

    let informeData:ICancelMedicalReportRequest = {
      fechaRegistro: informe.fechaRegistro,
      estadoFirmado: informe.estadoFirmado,
      estado: "A",
      usuarioActualizacion: this.username
    }

    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
    alert.title = 'Alerta';
    alert.message = '¿Seguro que desea eliminar el informe médico? ';

    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result){
          this.reportsProServService.cancelMedicalReport(informeData,informe.codigoInformeMedico).subscribe(
            (response)=>{
              if(response){
                this.search(this.pagination);
              }else{
                return this.modalService.alert(false, '', ALERT_MESSAGES[5].message);
              }

            }
          )
        }
      }
    );
  }

  isMedic( profile:any){
     let rolesCode =(profile.rolesCode as Array<any>).find( r=> r.nombreAplicacion =='GESMED')
     if(rolesCode.codigoRol == 'MEDICO'){
       return true
     }
     return false;
  }

  getMedicByDni(dni){
    let request:IGetListProfessionalsRequest = {
      nombreApellidoDocumento : dni,
      codMedico: 0,
      fechaNacimiento : '',
      sexo : '',
      numeroPagina : 1,
      tamanioPagina : 10,
    }

    this.reportsProServService.getListProfessionals(request).subscribe(
      (response:any) =>{
        if(response){
          if(response.data){
            this.codMedico =response.data[0].codigo
            this.formGroupInformeMedico.get('medico').patchValue({
              descripcion:response.data[0].nombreApellido,
              codigo:response.data[0].codigo
            })

            this.getSedeByMedic(response.data[0].codigo);
          }
        }
      }
    )
  }

  getSedeByMedic(codeMedic: number) {
    this.medicoService.getSedesByMedico(codeMedic)
    .subscribe((response: any) => {
      this.sedesData = response.body.data;
    });
  }

  getEspecialidadByMedicAndSede(codeMedic: number, codSede: number) {
    this.medicoService.getEspecialidadByMedico(codeMedic, codSede)
    .subscribe((response: any) => {
      this.especialidadesData = response.body.data;
    });
  }

  getIp(){
    this.reportsProServService.getIp().subscribe(
      response=>{
        localStorage.setItem('clientIp', response.ip)
      }
    )
  }

}
