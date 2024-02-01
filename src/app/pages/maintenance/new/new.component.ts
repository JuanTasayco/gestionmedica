import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalMessageComponent } from '@shared/components/modal-message/modal-message.component';
import { ProfesionalService } from '@shared/services/profesional.service';
import * as moment from 'moment';
import { BASE_DATE_FORMAT, BASE_DATE_FORMAT_API, PATH_URL_DATA_AUX } from '../../../shared/helpers/constants';
import { ALERT_MESSAGES, ALERT_TYPE, formatBytes, MODULES, PATH_URL_DATA } from '@shared/helpers';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LoaderService } from '@core/services';
import { EventTrackerService } from '@shared/services/event-tracker.service';

enum Action {
  EDIT= 'Editar',
  NEW= 'Nuevo'
}
@Component({
  selector: 'mapfre-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewComponent implements OnInit {
  formNuevoProfesional: FormGroup;
  codMedico: any;
  tipoDocumentos : any;
  especialidades : any;
  sedes : any;
  longitudDocumento : string = "0";

  listaEspecialidades = [];
  especialidad_FormControl = new FormControl('');
  especialidadFiltrados: Observable<Array<any>>;
  diagSeleccionado_Serv:string;

  especialidadesSelected = [];

  formGroupUploadDocument: FormGroup;
  items: FormArray;
  usuario = '';
  profile: any;
  medico: any;
  imagePath: any;
  imageFile: any;
  
  actionTODO = Action.NEW;
  tipoModulo: string;
  
  constructor(private router : Router, private route: ActivatedRoute, private dialog: MatDialog,
    private profesionalService: ProfesionalService, private consultaservice: ConsultaMedicaService,
    private fb : FormBuilder, public loaderService: LoaderService,private eventTracker: EventTrackerService) { }
  
    
  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.tipoModulo = params.tipoModulo;
     });

   
    this.setValuesFormBuilder();
    this.formNuevoProfesional = this.fb.group ({
      codmedico: new FormControl({value: '', disabled: true}),
      primerNombre: new FormControl('', [Validators.required]),
      segundoNombre: new FormControl(''),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      tipoDocumento: new FormControl('', [Validators.required]),
      numeroDocumento: new FormControl('', [Validators.required]),
      codigoUsuario: new FormControl(''),
      cpm: new FormControl(''),
      usuario: new FormControl(''),
      codigo: new FormControl(''),
      certificado: new FormControl(''),
      especialidades: this.fb.array([])
    });

    this.codMedico = this.route.snapshot.paramMap.get('codMedico') || null;
    console.log(this.codMedico);
   
    if(this.codMedico){
      this.obtenerDataMedico(this.codMedico);
      this.obtenerEspecialidades(this.codMedico);
    }

    this.listarTipoDocumentos();    
    this.listarEspecialidades();   
    this.listarSedes(); 

  }

  regresarProfesionales(){
    var path = PATH_URL_DATA_AUX[2];
    this.router.navigate([path], { replaceUrl: false });
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9/]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  setValuesFormBuilder() {
    this.formGroupUploadDocument = this.fb.group({
      items: this.fb.array([ ])
    });
  }

  fileBrowseHandler(files, e) {

    this.prepareFilesList(files, e);
  }

  prepareFilesList(files: Array<any>, e) {
    if (this.items && this.items.length > 0) {
      this.deleteFile(0);
    }
    this.loaderService.show();
    for (const item of files) {
      item.progress = 0;
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        this.addItem(item, encoded);
        e.target.value = '';

        const filtros={
          "name": item.name,
          "type": item.type,
          "base64": encoded
        }
          this.eventTracker.postEventTracker("opc76", JSON.stringify(filtros)).subscribe()
        }
    }

    this.loaderService.hide();
  }

  onFileDropped($event) {
    this.prepareFilesList($event, $event);
  }

  getArrayLength() {
    const arrayControl = this.getFormArray();
    return arrayControl.length;
   }

  addItem(value , base64): void {
    const row = { file: value, base64  };
    this.items = this.getFormArray();
    this.items.push(this.createItem(row));
  }

  createItem(value?): FormGroup {
    return this.fb.group({
      archivo: value.file,
      base64: value.base64
    });
  }

  getFormArray() {
    return this.formGroupUploadDocument.get('items') as FormArray;
  }

  formatBytes(bytes) {
    return formatBytes(bytes, 0);
  }

  deleteFile(index: number) {
    this.imageFile = null;
    this.items.removeAt(index);
  }

  return() {
    if (this.items && this.items.length > 0) {
      this.deleteFile(0);
    }
    if (this.medico.rubricaFirma) {
      const imageName = 'rubrica.jpeg';
      const imageBlob = this.dataURItoBlob(this.medico.rubricaFirma);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
      this.imageFile = imageFile;
      this.addItem(this.imageFile, this.medico.rubricaFirma);
    }
  }

  validForm() {
    if (!this.formGroupUploadDocument.valid) {
      return false;
     } else {
       return true;
     }
  }

  disableButton() {
    const arrayLength = this.getArrayLength();
    if (arrayLength === 0 && this.validForm()) {
      return true;
    }
    return false;
  }

  registrarProfesional(){
    const infoDocumento = {
      documentos: []
    };
    this.getFormArray().controls.forEach(element => {
        const detalle = {documentoBase64: element.value.base64,
                        nombreDocumento: element.value.archivo.name
                          };
        infoDocumento.documentos.push(detalle);
      });

    const request = {
      "primerNombre": this.formNuevoProfesional.controls.primerNombre.value,
      "segundoNombre": this.formNuevoProfesional.controls.segundoNombre.value,
      "apellidoPaterno": this.formNuevoProfesional.controls.apellidoPaterno.value,
      "apellidoMaterno": this.formNuevoProfesional.controls.apellidoMaterno.value,
      "fechaNacimiento":  moment(this.formNuevoProfesional.controls.fechaNacimiento.value).format(BASE_DATE_FORMAT_API),
      "genero": this.formNuevoProfesional.controls.genero.value,
      "tipoDocumento": this.formNuevoProfesional.controls.tipoDocumento.value,
      "numeroDocumento": this.formNuevoProfesional.controls.numeroDocumento.value,
      "codigoUsuario": this.formNuevoProfesional.controls.codigoUsuario.value,
      "cpm": this.formNuevoProfesional.controls.cpm.value,
      "usuario": this.formNuevoProfesional.controls.usuario.value,
      "codigo": this.formNuevoProfesional.controls.codigo.value,
      "certificado": this.formNuevoProfesional.controls.certificado.value,
      rubricaFirma: this.codMedico ? this.medico.rubricaFirma : infoDocumento.documentos.length > 0 ? infoDocumento.documentos[0].documentoBase64 : null,
      idGestor: this.codMedico ? this.medico.idGestor : ''
    }
    this.eventTracker.postEventTracker("opc75", JSON.stringify(request)).subscribe()
    if ( this.codMedico != null ) {
      this.profesionalService.actualizarProfesional(this.codMedico, request)
      .subscribe((response: any) => {
          if (response.operacion == 201 && response.mensaje == 'UPDATED') {
            if ( this.formNuevoProfesional.controls.especialidades.value.length > 0 ) {
                  this.registrarSedeEspec("0");
            }else{
              let modal = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
              modal.message = 'Profesional de la salud actualizado con éxito';
              const dialogRef = this.dialog.open(ModalMessageComponent, {
                width: '400px', data: { success: modal }
              });
              dialogRef.afterClosed().subscribe(result => { 
                var path = PATH_URL_DATA_AUX[1];
                this.router.navigate([path, this.codMedico], { replaceUrl: false });
              });
            }
            
          }
    });
    }else{
      this.profesionalService.registrarProfesional(request)
      .subscribe((response: any) => {
          if (response.operacion == 201 && response.mensaje == 'CREATED') {
            this.codMedico = response.data;
            if ( this.formNuevoProfesional.controls.especialidades.value.length > 0 ) {
              this.registrarSedeEspec(response.data);
            }else{
              let modal = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
              modal.message = 'Profesional de la salud actualizado con éxito';
              const dialogRef = this.dialog.open(ModalMessageComponent, {
                width: '400px', data: { success: modal }
              });
              dialogRef.afterClosed().subscribe(result => { 
                var path = PATH_URL_DATA_AUX[1];
                this.router.navigate([path, this.codMedico], { replaceUrl: false });
              });
            }
            
          }
    });
    }

    

  }

  /* listarSedes(){
    this.profesionalService.listarSedes()
            .subscribe((response: any) => {
              if (response) {
                this.listaServDiagnosticos = response.data;
                console.log(this.listaServDiagnosticos);
                this.servDiagFiltrados = this.servDiag_FormControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => typeof value === 'string' ? value : value.descripcion),
                  map(descripcion => descripcion ? this._filterServDiag(descripcion) : this.listaServDiagnosticos.slice())
                );
              }
              
          });
  }
  */

  obtenerDataMedico(codMedico:string){
    this.profesionalService.obtenerDataMedico(codMedico)
      .subscribe((response: any) => {
          console.log(response.data);
          this.medico = response.data;
          this.actionTODO = response.data.codigoMedico ? Action.EDIT : Action.NEW;
          this.formNuevoProfesional.controls.codmedico.setValue(response.data.codigoMedico);
          this.formNuevoProfesional.controls.primerNombre.setValue(response.data.primerNombre);
          this.formNuevoProfesional.controls.segundoNombre.setValue(response.data.segundoNombre);
          this.formNuevoProfesional.controls.apellidoPaterno.setValue(response.data.apellidoPaterno);
          this.formNuevoProfesional.controls.apellidoMaterno.setValue(response.data.apellidoMaterno);
          this.formNuevoProfesional.controls.genero.setValue(response.data.genero);
          this.formNuevoProfesional.controls.tipoDocumento.setValue(response.data.tipoDocumento);
          this.changeLongitudDoc(response.data.tipoDocumento);
          this.formNuevoProfesional.controls.numeroDocumento.setValue(response.data.numeroDocumento);
          this.formNuevoProfesional.controls.codigoUsuario.setValue(response.data.codigoUsuario);
          this.formNuevoProfesional.controls.cpm.setValue(response.data.cmp);
          this.formNuevoProfesional.controls.usuario.setValue(response.data.usuario);
          this.formNuevoProfesional.controls.codigo.setValue(response.data.codigo);
          this.formNuevoProfesional.controls.certificado.setValue(response.data.certificado);
          this.formNuevoProfesional.controls.fechaNacimiento.setValue(response.data.fechaNacimiento);
      })
  }

  listarTipoDocumentos(){
    this.profesionalService.getTipoDocumentos()
      .subscribe((response: any) => {
          console.log(response)
          if (response.mensaje == 'OK' && response.operacion == 200) {
              this.tipoDocumentos = response.data;
          }
      })
  }

  listarEspecialidades(){
    this.profesionalService.getEspecialidades( "0", "0")
      .subscribe((response: any) => {
          
        if (response) {
          this.listaEspecialidades = response.data;
          this.especialidadFiltrados = this.especialidad_FormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.descripcion),
            map(descripcion => descripcion ? this._filterEspeicilidades(descripcion) : this.listaEspecialidades.slice())
          );
        }
          
      })
  }

  private _filterEspeicilidades(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaEspecialidades.filter(especialidad => especialidad.descripcion.toLowerCase().includes(filterValue));
  }



  changeLongitudDoc(value:number){
    this.formNuevoProfesional.controls.numeroDocumento.reset();
    this.profesionalService.getLongitudTipoDoc(value)
      .subscribe((response: any) => {
          console.log(response)
          if (response.mensaje == 'OK' && response.operacion == 200) {
              this.longitudDocumento = response.data.longitud.toString();
          }
      })
  }

  obtenerCodUsuario(){
    let tipoDocumento = this.formNuevoProfesional.controls.tipoDocumento.value;
    let numeroDocumento = this.formNuevoProfesional.controls.numeroDocumento.value;
    this.profesionalService.getObtenerCodUsuario(tipoDocumento, numeroDocumento)
      .subscribe((response: any) => {
          console.log(response)
          this.formNuevoProfesional.controls.codigoUsuario.setValue(response.data.codigo);
      })
  }


  especialidadSeleccionado(event: MatAutocompleteSelectedEvent): void {
   console.log("ssss");
      let encontrado = 0;

      for (let index = 0; index < this.formNuevoProfesional.controls.especialidades.value.length; index++) {
        if (event.option.value.codigo == this.formNuevoProfesional.controls.especialidades.value[index].codigoEspecialidad ) {
          const data = {
            title : 'Alerta',
            message : 'La especialidad seleccionada ya está agregada. Por favor, seleccione otro.',
          }

          const dialogRef = this.dialog.open(AlertComponent, { 
              width: '400px', data: { alert: data } 
          });
          encontrado = 1;
          break;

        }
      }

      if ( encontrado == 0) {
        const especialidadForm = this.fb.group({
          codigoEspecialidad: [ event.option.value.codigo , Validators.required],
          descEspecialidad: [ event.option.viewValue , Validators.required],
          rne: ['', Validators.required],
          tiempoAtencion: ['', Validators.required],
          sedes : [ [] ]
        });
        this.eventTracker.postEventTracker("opc77", JSON.stringify(especialidadForm.value)).subscribe()
        this.obtenerSede.push(especialidadForm);
        
      }
      

      this.especialidad_FormControl.setValue('');

  }

  listarSedes(){
    this.consultaservice.getSedes()
      .subscribe((response: any) => {
          for (let index = 0; index < response.data.length; index++) {
            response.data[index]['descripcion'] = response.data[index]['descripcion'].replace('CENTRO MEDICO','CM MAPFRE')
          }
          this.sedes = response.data;
    });
  }

  get obtenerSede(){
    return this.formNuevoProfesional.controls['especialidades'] as FormArray;
  }

  agregarSede( row:number, especialidad: any, codSede: string, e:any){


      for (let index = 0; index < this.formNuevoProfesional.controls.especialidades.value.length; index++) {
        if ( especialidad.codigoEspecialidad == this.formNuevoProfesional.controls.especialidades.value[index].codigoEspecialidad ) {
          if (e.checked) {
            this.formNuevoProfesional.controls.especialidades.value[index].sedes.push(codSede);
            //console.log(this.formNuevoProfesional.controls.especialidades.value[index])
          }else{
            let row = this.formNuevoProfesional.controls.especialidades.value[index]['sedes'].indexOf(codSede, 0)
            this.formNuevoProfesional.controls.especialidades.value[index]['sedes'].splice(row, 1);
          }
        }
      }

      console.log(this.formNuevoProfesional.controls.especialidades.value);
  }

  registrarSedeEspec(codMedico : string){

    const request = {
      "especialidades": []
    }

    if ( +codMedico > 0) {
      this.codMedico = codMedico
    }

    for (let index = 0; index < this.formNuevoProfesional.controls.especialidades.value.length; index++) {
      let sedesEspecialidad = this.formNuevoProfesional.controls.especialidades.value[index]['sedes'];
      for (let j = 0; j < sedesEspecialidad.length; j++) {
        request.especialidades.push(
          {
            "estado": "V",
            "codigoSede": +sedesEspecialidad[j],
            "codigoEspecialidad": +this.formNuevoProfesional.controls.especialidades.value[index].codigoEspecialidad,
            "tiempoAtencion": +this.formNuevoProfesional.controls.especialidades.value[index].tiempoAtencion,
            "rne": this.formNuevoProfesional.controls.especialidades.value[index].rne
          }
        );
      }
    }

    this.profesionalService.registrarSedeEspec(this.codMedico, request )
      .subscribe((response: any) => {
          console.log(response)
          let modal = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
            modal.message = 'Profesional de la salud actualizado con éxito';
            const dialogRef = this.dialog.open(ModalMessageComponent, {
              width: '400px', data: { success: modal }
            });
            dialogRef.afterClosed().subscribe(result => { 
              var path = PATH_URL_DATA_AUX[1];
              this.router.navigate([path, this.codMedico], { replaceUrl: false });
            });
      })  

    
  }

  groupArrayOfObjects(list, key) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  obtenerEspecialidades(codMedico:string){
    this.profesionalService.obtenerEspecialidades(codMedico)
    .subscribe((response: any) => { 

      let result = Object.values(response.data.reduce((c, {codigoSede,...u}) => {
        let k = u.codigoEspecialidad;   
        let p = codigoSede;                 
        c[k] = c[k] || {
            codEspecialidad:  u.codigoEspecialidad,
            especialidad:  u.especialidad,
            rne:  u.rne,
            tiempoAtencion:  u.tiempoAtencion,
            sedes : []
        };   
        c[k]['sedes'] = c[k]['sedes'] || [];  
        c[k]['sedes'].push(p);                   
        return c;
      }, {}));
      
      for (let index = 0; index < result.length; index++) {
        const especialidadForm = this.fb.group({
          codigoEspecialidad: [ result[index]['codEspecialidad'] , Validators.required],
          descEspecialidad: [ result[index]['especialidad'] , Validators.required],
          rne: [result[index]['rne'] , Validators.required],
          tiempoAtencion: [result[index]['tiempoAtencion'], Validators.required],
          sedes : [result[index]['sedes']]
        });
        this.obtenerSede.push(especialidadForm);

      }

    })
  }

  eliminarEspecialidad(indice:number, especialidadForm: any){
    this.eventTracker.postEventTracker("opc78",JSON.stringify(especialidadForm.value)).subscribe()
   
    this.obtenerSede.removeAt(indice)
  }

}
