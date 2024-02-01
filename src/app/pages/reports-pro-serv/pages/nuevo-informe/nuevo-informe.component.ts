import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';
import { BASE_DATE_FORMAT_API, MIN_CHARACTERS_SEARCH, PATH_URL_DATA} from '@shared/helpers';
import { IMaestro, IPrograma } from '@shared/models/common/interfaces';
import { IGetListProfessionalsRequest } from '@shared/models/request/interfaces';
import { IGetListProcedureServiceRequest } from '@shared/models/request/interfaces/get-list-procedure-service.interface';
import { IProcedureService} from '@shared/models/response/interfaces';
import { AuthenticationService } from '@shared/services/authentication.service';
import { ComunService } from '@shared/services/comun.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { MedicoService } from '@shared/services/medico.service';
import * as moment from 'moment';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'mapfre-nuevo-informe',
  templateUrl: './nuevo-informe.component.html',
  styleUrls: ['./nuevo-informe.component.scss']
})
export class NuevoInformeComponent implements OnInit {

  formGroupNuevoInformeMedico: FormGroup;

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
  totalItemsPage = 10;

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
  dataSource: IProcedureService[];
  tipoDocumentoData: any;
  mostrarFiltros = false;
  selectedConsult:any = null;
  codMedico:any=null;
  profile:any= null;

  notHasRecord = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private medicoService:MedicoService,
    private comunService: ComunService,
    private authService: AuthenticationService,
    private reportsProServService: ReportsProServService, 
    private router: Router,
    private eventTracker: EventTrackerService
    ) { }

  ngOnInit() {
  
    this.setValuesFormBuilder();
    this.initComponents()

    this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.username = this.profile ? this.profile.loginUserName : 'WEBMASTER';

    setTimeout(() => {
      this.getProcedimientos('');
    });

    if(this.isMedic(this.profile)){
      this.getMedicByDni(this.profile.documentNumber)
    }else{
      this.formGroupNuevoInformeMedico.controls.codigoMedico.valueChanges.pipe(
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

  // Valores iniciales de datos de formulario de búsqueda
  setValuesFormBuilder() {
    let fecha_desde = new Date();
    fecha_desde.setDate(fecha_desde.getDate()-30)
    this.formGroupNuevoInformeMedico = this.fb.group({
      pacienteDatos: [''],
      registroClinico:[''],
      codigoProcedimientoServicio: ['0'],
      codigoSede:['0'],
      codigoEspecialidad:['999'],
      codigoMedico: [''],
      fechaRegistro:this.fb.group({
        fechaInicio: [fecha_desde],
        fechaFin: [new Date()],
      }),
      numeroPagina:[1],
      tamanioPagina:[5]
    });
  }

  getMedicos(text: any) {
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.body.data;
      });
  }
  getProcedimientos(text: any) {
    this.comunService.getComun('procedimientos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.procedimientosData = response.body.data;
      });
  }

  toggleFilter(){
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

  onDisplaySearch(value) {
    return value ? value.descripcion : '';
  }

  onSelectedSearch(tipo: string, e: any) {
    switch (tipo) {
      case 'M': 
        this.medicosData = []; 
        this.getSedeByMedic(e.option.value.codigo);
      break;
      case 'S': 
        var codMedico = this.formGroupNuevoInformeMedico.get('codigoMedico').value.codigo ? this.formGroupNuevoInformeMedico.get('codigoMedico').value.codigo : 0
        this.getEspecialidadByMedicAndSede(codMedico, e.value);
      break;
      case 'D': this.diagnosticosData = []; break;
      case 'P': this.procedimientosData = []; break;
    }
  }

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

  search( numPagina:number ){

    let request:IGetListProcedureServiceRequest = this.formGroupNuevoInformeMedico.value;
    request.fechaRegistro.fechaFin = moment(request.fechaRegistro.fechaFin).format(BASE_DATE_FORMAT_API)+' 23:59:59';
    request.fechaRegistro.fechaInicio = moment(request.fechaRegistro.fechaInicio).format(BASE_DATE_FORMAT_API)+' 00:00:00';
    request.numeroPagina = numPagina;
    request.registroClinico= request.registroClinico?request.registroClinico:'0';
    request.codigoMedico = this.formGroupNuevoInformeMedico.get('codigoMedico').value.codigo ? this.formGroupNuevoInformeMedico.get('codigoMedico').value.codigo : 0;

    const filtros = {
      "fechaFin":request.fechaRegistro.fechaFin,
      "fechaInicio":request.fechaRegistro.fechaInicio,
      "registroClinico":request.registroClinico,
      "codigoMedico":request.codigoMedico
    }
    this.eventTracker.postEventTracker("opc25", JSON.stringify(filtros)).subscribe()

    this.reportsProServService.getListProcedureService(request).subscribe(
      (response)=>{
        if ( response && response.data.length != 0) {
          this.dataSource = response.data;
          this.pagination = numPagina;
          this.hasRecords = true;
          this.notHasRecord = false;
          this.totalItems = response.numeroRegistros;
          const totalPages = response.totalPaginas
          if (totalPages < 1) { this.totalPages = 1; }
          if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
        } else {
          this.dataSource = null
          this.hasRecords = false;
          this.notHasRecord = true;
        }
      },
      (error)=>{

      }
    )
  }

  seleccionarConsulta(item:any){
    this.selectedConsult = item;
  }

  editInforme(item:IProcedureService){
    //enviar los datos seleccionados
    this.eventTracker.postEventTracker("opc26", JSON.stringify(item)).subscribe()
   
    localStorage.setItem('newProcedureService',JSON.stringify(item))
    this.router.navigate([PATH_URL_DATA.urlInformesProcServ,PATH_URL_DATA.urlNuevoInforme, 0]) ;
  }

  clean() {
    if(this.isMedic(this.profile)){
      let medico = this.formGroupNuevoInformeMedico.get('codigoMedico').value
      this.setValuesFormBuilder();
      this.formGroupNuevoInformeMedico.get('codigoMedico').patchValue(medico)
    }else{
      this.setValuesFormBuilder();
    }
    this.isSearched = false;
    this.hasRecords = false;

  }

  regresar(){
    this.router.navigate([PATH_URL_DATA.urlInformesProcServ]) ;
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
     response =>{
       if(response.data){
         
         this.codMedico =response.data[0].codigo
         this.formGroupNuevoInformeMedico.get('codigoMedico').patchValue({
           descripcion:response.data[0].nombreApellido,
           codigo:response.data[0].codigo
         })

         this.getSedeByMedic(response.data[0].codigo);
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

}
