import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';
import { MIN_CHARACTERS_SEARCH } from '@shared/helpers';
import { IGetListMasterRequest, IGetListProfessionalsRequest, IGetListTemplateRequest } from '@shared/models/request/interfaces';
import { Template } from '@shared/models/response/interfaces';
import { ComunService } from '@shared/services/comun.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { GenerateTemplateComponent } from '../generate-template/generate-template.component';

@Component({
  selector: 'mapfre-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.scss']
})
export class ListTemplateComponent implements OnInit {
  formGroupSearchTemplate: FormGroup;
  hasRecords:boolean = false;

  pagination = 1;
  totalItems = 0;
  totalPages = 1;
  totalItemsPage = 5;

  dataSource:any = null;
  especialidadesData:any[];
  tipo_examenData:any[];
  clasificacionsData:any[];

  @Input() codProveedorSede:string;

  medicosData: any;
  codMedico:number = 0;
  descMedico:string ='';

  selectedTemplate:Template;
  profile:any;
  username:any;
  notHasRecord:boolean = false;

  constructor(
    private fb: FormBuilder,
    private procedureService:ReportsProServService,
    private comunService: ComunService,
    public dialogRef: MatDialogRef<GenerateTemplateComponent>,
    private eventTracker: EventTrackerService
  ) { }

  ngOnInit() {
    this.setValueFormBuilder()
    this.getComunes();

    this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.username = this.profile ? this.profile.loginUserName : 'WEBMASTER';

    if(this.isMedic(this.profile)){
      setTimeout(() => {
        this.getMedicByDni(this.profile.documentNumber)
      })
      
    }else{
      this.formGroupSearchTemplate.controls.medico.valueChanges.pipe(
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

  setValueFormBuilder(){
    this.formGroupSearchTemplate = this.fb.group({
      descripcion: [''],
      tipo_examen: ['0'],
      medico: [this.descMedico],
      especialidad: [999],
      clasificacion: ['0']
    });
  }

  getComunes(){
    setTimeout(() => {
      this.getEspecialidades();
      this.getTipoExamen();
    });
  }

  search(){
    this.getTemplate(1);
  }

  getTemplate(pag:number){

    let request:IGetListTemplateRequest = {
      descripcionPlantilla :this.formGroupSearchTemplate.get('descripcion').value,
      codigoTipoExamen:this.formGroupSearchTemplate.get('tipo_examen').value,
      codigoEspecialidad:this.formGroupSearchTemplate.get('especialidad').value,
      codigoClasificacion:this.formGroupSearchTemplate.get('clasificacion').value,
      codigoMedico: this.codMedico,
      numeropagina:pag,
      tamanioPagina:this.totalItemsPage
    }

    this.eventTracker.postEventTracker("opc29", JSON.stringify(request)).subscribe()
    this.procedureService.getListTemplate(request).subscribe(
      (response) =>{
        if(response && response.data){
          this.dataSource = response.data
          this.hasRecords = true;
          this.totalPages = response.totalPaginas;
          this.selectedTemplate = null;
          this.pagination = pag
          
          this.notHasRecord = false
        }else{
          this.hasRecords = false;
          this.notHasRecord = true;
        }
      }
    )
  }

  onDisplaySearch(value) {
    this.codMedico = value.codigo;
    return value ? value.descripcion : '';
  }

  onSelectedSearch(tipo: string, e: MatAutocompleteSelectedEvent) {
    switch (tipo) {
      case 'M': 
        this.medicosData = []; 

      
      break;
    }
  }

  getMedicos(text: any) {
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.body.data;
      });
  }

  getEspecialidades(){
    this.comunService.getComun('especialidades')
    .subscribe((response: any) => {
      this.especialidadesData = response.body.data;
    });
  }

  getTipoExamen(){
    const request:IGetListMasterRequest = {
      parametro1:'',
      parametro2:'',
      parametro3:'',
      pagina:1,
      tamanioPagina:10
    };
    
    this.procedureService.getListMaster(request,'tipoExamen').subscribe(
      (response)=>{
        if(response && response.data){
          this.tipo_examenData = response.data
        }
      }
    )
  }

  getClasificacion(){
    const request:IGetListMasterRequest = {
      parametro1:'',
      parametro2:'',
      parametro3:this.formGroupSearchTemplate.get('tipo_examen').value,
      pagina:1,
      tamanioPagina:10
    };
    
    this.procedureService.getListMaster(request,'clasificacion').subscribe(
      (response)=>{
        if(response && response.data){
          this.clasificacionsData = response.data
        }
      }
    )
  }

  selectedTipoExamen(){
    this.getClasificacion();
  }

  changePage(event: any) {
    this.getTemplate(event.page);
  }

  selectTemplate( template:Template){
    this.selectedTemplate = template 
  }

  clear(){

    if(this.isMedic){
      this.setValueFormBuilder();
      this.formGroupSearchTemplate.get('medico').patchValue({
        descripcion:this.descMedico,
        codigo:this.codMedico
      })
    }else{
      this.setValueFormBuilder();
    }
      this.hasRecords = false;
      this.selectedTemplate = null;
  }

  continuar(){
    
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
   

   this.procedureService.getListProfessionals(request).subscribe(
     response =>{
       if(response.data){
         
         this.codMedico =response.data[0].codigo
         this.descMedico = response.data[0].nombreApellido
         this.formGroupSearchTemplate.get('medico').patchValue({
           descripcion:response.data[0].nombreApellido,
           codigo:response.data[0].codigo
         })
       }
     }
   )
 }

}
