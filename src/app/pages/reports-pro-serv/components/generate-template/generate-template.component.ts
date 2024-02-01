import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';
import { MIN_CHARACTERS_SEARCH } from '@shared/helpers';
import { IGetListMasterRequest, IGetListProfessionalsRequest } from '@shared/models/request/interfaces';
import { ComunService } from '@shared/services/comun.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'mapfre-generate-template',
  templateUrl: './generate-template.component.html',
  styleUrls: ['./generate-template.component.scss']
})
export class GenerateTemplateComponent implements OnInit {
  formGroupSearchTemplate: FormGroup;

  especialidadesData:any[];
  tipo_examenData:any[];
  clasificacionsData:any[];

  @Input() codProveedorSede:string;

  medicosData: any;
  codMedico:number = 0;
  descMedico:string ='';

  profile:any;
  username:any;

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
      this.getMedicByDni(this.profile.documentNumber)
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
      tipo_examen: [0],
      medico: [''],
      especialidad: [999],
      clasificacion: [0]
    });
  }

  getComunes(){
    setTimeout(() => {
      this.getEspecialidades();
      this.getTipoExamen();
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

  generateTempalte(){
    this.eventTracker.postEventTracker("opc30", JSON.stringify(this.formGroupSearchTemplate.value)).subscribe()
     
    this.dialogRef.close(this.formGroupSearchTemplate.value)
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
         this.descMedico =response.data[0].nombreApellido
         this.formGroupSearchTemplate.get('medico').patchValue({
          descripcion:response.data[0].nombreApellido,
          codigo:response.data[0].codigo
        })
       }
     }
   )
 }

}
