import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateTemplateComponent } from '@pages/reports-pro-serv/components/generate-template/generate-template.component';
import { ListTemplateComponent } from '@pages/reports-pro-serv/components/list-template/list-template.component';
import { SignDocumentComponent } from '@pages/reports-pro-serv/components/sign/sign-document.component';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { DeleteAlertComponent } from '@shared/components/delete-alert/delete-alert.component';
import { ALERT_MESSAGES, ALERT_TYPE, BASE_DATE_FORMAT_API, HTTP_CREATED, PATH_URL_DATA } from '@shared/helpers';
import { ICancelMedicalReportRequest, IGetListProfessionalsRequest, IRegisterTemplateRequest, IUpdateMedicalReportRequest } from '@shared/models/request/interfaces';
import { IRegisterSignRequest } from '@shared/models/request/interfaces/register-sign.interface';
import { IDetailMedicalReport} from '@shared/models/response/interfaces';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import * as moment from 'moment';

@Component({
  selector: 'mapfre-detail-informe',
  templateUrl: './detail-informe.component.html',
  styleUrls: ['./detail-informe.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class DetailInformeComponent implements OnInit {
  formGroupInformeMedico: FormGroup;

  public tools: object = {
    items: 
      [
        'Undo', 'Redo', '|',
        'UpperCase', '|',
        'Bold', 'Italic', 'Underline', 'StrikeThrough','FontColor', '|',
        'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent'
      ]
    };

  informeMedico:IDetailMedicalReport;

  codInformeMedico:number;
  detail_informe:string = '';
  cod_plantilla:number = 0;
  expression:boolean= false;
  username:string;
  codMedico:string;
  edit_cabecera = false;
  edit_detail = false;
  profile:any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private reportsProServService: ReportsProServService,
    private eventTracker: EventTrackerService
  ) { }

  ngOnInit() {
    this.codInformeMedico = +this.route.snapshot.paramMap.get('id')
    this.setFormBuilder();
    this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.username = this.profile ? this.profile.loginUserName : 'WEBMASTER';
    if(this.isMedic(this.profile)){
      this.getMedicByDni(this.profile.documentNumber)
    }
    
    this.getDetailMedicalReport(this.codInformeMedico);
    
  }

  setFormBuilder(){
    this.formGroupInformeMedico = this.fb.group({
      codInformeMedico: [0],
      codEspecialidad: [0],
      descEspecialidad: [''],
      codProveedorSede: [0],
      descSucursal: [''],
      codMedico: [0],
      descMedico: [''],
      codAfiliado: [0],
      nombrePaciente: [''],
      numConsulta: [0],
      numOrdenAtencion: [0],
      fechaInformeMedico: [''],
      statusInformeMedico: [''],
      numHistoriaClinica: [0],
      codPlantilla: [0],
      texto1: ['']
    });
  }

  signDocuments() {
    this.eventTracker.postEventTracker("opc20", JSON.stringify(this.informeMedico)).subscribe()
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { send: true }, panelClass: 'upload'
    });

    dialogRef.afterClosed().subscribe(result => { 

      if(result){
        
        this.firmarInformeMedico(result);

      }
      

      

     /*  dialogRef.afterClosed().subscribe(result => {
        this.router.navigate([PATH_URL_DATA.urlInformesProcServ ])
       }) */
       
    });
  }

  useTemplate(){
   
    const dialogRef = this.dialog.open(ListTemplateComponent, {
      width: '800px', data: { send: true }, panelClass: 'upload'
    });

    let instance = dialogRef.componentInstance;
    instance.descMedico = this.informeMedico.medico.descripcion;
    instance.codProveedorSede = this.informeMedico.sede.codigo;

    dialogRef.afterClosed().subscribe(result => { 

      if(result){
        const filtro={
          "codInformeMedico":this.codInformeMedico
        }
        this.eventTracker.postEventTracker("opc28",  JSON.stringify({...filtro,...result})).subscribe()

        this.cod_plantilla = result.codigoPlantilla;
        this.getBodyTemplate(result.codigoPlantilla)
      }
      
    });
  }

  generateTemplate(){
    this.eventTracker.postEventTracker("opc27", JSON.stringify(this.informeMedico)).subscribe()
        
    const dialogRef = this.dialog.open(GenerateTemplateComponent, {
      width: '500px', data: { send: true }, panelClass: 'upload'
    });

    let instance = dialogRef.componentInstance;
    instance.codProveedorSede = this.informeMedico.sede.codigo;

    dialogRef.afterClosed().subscribe(
      (result) => { 
        if(result){
          let template:IRegisterTemplateRequest ={
            clasificacion:{codigo : result.clasificacion},
            descripcion :result.descripcion,
            resumen : result.descripcion,
            contenido : this.detail_informe,
            especialidad : {codigo : result.especialidad},
            medico : {codigo : result.medico?result.medico.codigo:0},
            diagnostico : {codigo : this.informeMedico.diagnostico.codigo},
            estado : 'V',
            usuarioRegistro : this.username,
            usuarioActualizacion : this.username,
            tipoExamen:{codigo : result.tipo_examen},
            fechaRegistro : moment(new Date()).format(BASE_DATE_FORMAT_API)+' 00:00:00'
          }

         
          this.reportsProServService.registerTemplate(template).subscribe(
            response=>{
              if(response.status == HTTP_CREATED){
                let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.success)[0];
                alert.title = '';
                alert.message = 'Plantilla generada con éxito';
          
                const dialogRef = this.dialog.open(AlertComponent, { 
                  width: '400px', data: { alert: alert } 
                });
              }else{
                let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.success)[0];
                alert.title = '';
                alert.message = 'Error al generar plantilla';
          
                const dialogRef = this.dialog.open(AlertComponent, { 
                  width: '400px', data: { alert: alert } 
                });
              }
              
            }
          )          
        }

      }
    );
  }

  getDetailMedicalReport(codInformeMedico:number){
    this.reportsProServService.getDetailMedicalReport(codInformeMedico).subscribe(
      (response)=>{
        if(response.data && response){
          
          this.informeMedico = response.data;
          this.detail_informe = response.data.contenido == undefined ? '':response.data.contenido
          
        }
      }
    )
  }

  getBodyTemplate(codTemplate:number){
    this.reportsProServService.getBodyTemplate(codTemplate).subscribe(
      (response)=>{
        this.detail_informe = response.data.contenido?response.data.contenido :''
      }
    )
  }

  cancelar(){
    this.edit_detail = false;
    this.getDetailMedicalReport(this.codInformeMedico)
  }

  guardar(){


    let informeMedico:IUpdateMedicalReportRequest = {
      codigoPlantilla: this.cod_plantilla,
      contenido: this.detail_informe,
      fechaRegistro: this.informeMedico.fechaRegistro,
      estado: "R",
      estadoFirmado: false,
      fechaFirmado: null,
      especialidad: {
          codigo: +this.informeMedico.especialidad.codigo
      },
      medico: {
          codigo: +this.informeMedico.medico.codigo
      },
      paciente: {
          codigo: this.informeMedico.paciente.codigo
      },
      diagnostico: {
        codigo: this.informeMedico.diagnostico.codigo,
        nombre: this.informeMedico.diagnostico.descripcion
      },
      registroClinico: {
          numeroConsulta: this.informeMedico.registroClinico.numeroConsulta,
          numeroOrdenAtencion: this.informeMedico.registroClinico.numeroOrdenAtencion
      },
      usuarioActualizacion: this.username
    }

    this.reportsProServService.updateMedicalReport(informeMedico,this.codInformeMedico).subscribe(
      response=>{
        if(response.data){
          let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.success)[0];
              alert.title = '';
              alert.message = 'Informe Médico actualizado con éxito';
        
              const dialogRef = this.dialog.open(AlertComponent, { 
                width: '400px', data: { alert: alert } 
              });
              this.getDetailMedicalReport(this.codInformeMedico);
              this.edit_detail = false;
        }
      }
    )
  }

  editDetail(){
    this.eventTracker.postEventTracker("opc21", JSON.stringify(this.informeMedico)).subscribe()
  
    this.edit_detail = true;
  }

  delete(){
    this.eventTracker.postEventTracker("opc19", JSON.stringify(this.informeMedico)).subscribe()
  
    let informeData:ICancelMedicalReportRequest = {
      fechaRegistro: this.informeMedico.fechaRegistro,
      estadoFirmado: false,
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
          this.reportsProServService.cancelMedicalReport(informeData,this.informeMedico.codigoInformeMedico).subscribe(
            (response)=>{
              if(response){
                this.router.navigate([PATH_URL_DATA.urlInformesProcServ]) ;
              }
              
            }
          )
        }
      }
    );

  }

  firmarInformeMedico( token:string){

    let parameter:IRegisterSignRequest = {
      ipbatch : token,
      codInformeMedico : this.codInformeMedico+'',
      codMedico : +this.codMedico,
      ordenAtencion : this.informeMedico.registroClinico.numeroOrdenAtencion,
      numeroConsulta : this.informeMedico.registroClinico.numeroConsulta,
      usuarioRegistro: JSON.parse(localStorage.getItem('profile')).username
    }

    this.reportsProServService.firmarInforme(parameter).subscribe(
      response =>{
        if(response.data){
          let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.success)[0];
          alert.title = '';
          alert.message = response.mensaje;

          const dialogRef = this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: alert } 
          });

          dialogRef.afterClosed().subscribe(()=> this.router.navigate([PATH_URL_DATA.urlInformesProcServ,PATH_URL_DATA.urlDetalleInforme, this.codInformeMedico]) )
        }else{
          let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.error)[0];
          alert.title = '';
          alert.message = response.mensaje;
  
          const dialogRef = this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: alert } 
          });

          dialogRef.afterClosed().subscribe(()=> this.router.navigate([PATH_URL_DATA.urlInformesProcServ,PATH_URL_DATA.urlDetalleInforme, this.codInformeMedico]) )
        }
      },
      error=>{
        let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.error)[0];
        alert.title = '';
        alert.message = 'Error al firmar informe médico';

        const dialogRef = this.dialog.open(AlertComponent, { 
          width: '400px', data: { alert: alert } 
        });
      }
    )
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
          }
        }
      }
    )
  }

  regresar(){
    this.router.navigate([PATH_URL_DATA.urlInformesProcServ]) ;
  }

}
