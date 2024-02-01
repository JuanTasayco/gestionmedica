import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@core/services';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { SuccessComponent } from '@shared/components/success/sucess.component';
import { formatBytes, PATH_URL_DATA } from '@shared/helpers';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { ProfesionalService } from '@shared/services/profesional.service';
import * as moment from 'moment';
import { forkJoin, of } from 'rxjs';
import { debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';
import { BASE_DATE_FORMAT, BASE_DATE_FORMAT_API } from '../../../shared/helpers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { RubricaComponent } from '@shared/components/rubrica/rubrica.component';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  buscarHorario : boolean = false;
  public value: Date [];
  codMedico : string;
  horarios = [];
  sedes = [];
  isFilterVisible: boolean;
  especialidades = [];
  public multiselect = true;
  sede : string;
  especialidad : string;
  formRangoHorarios : FormGroup;
  nombreDoc = 'Dr. Jorge Luis Barrantes Cruz(Cód. 0054)';
  formGroupSearchHorarios: FormGroup;
  formNuevoProfesional : FormGroup;
  especialidadesSelected = [];
  
  /* selected: {startDate: Moment, endDate: Moment}; */
  ranges: any = {
   
  };

  formGroupUploadDocument: FormGroup;
  items: FormArray;
  usuario = '';
  profile: any;
  medico: any;
  imagePath: any;
  imageFile: any;
  rubricaBase: any;
  public panelOpenState = true;
  constructor(private router : Router, private route: ActivatedRoute, private profesionalService : ProfesionalService,
              private dialog: MatDialog, private fb: FormBuilder, public loaderService: LoaderService,
              private consultaMedService: ConsultaMedicaService, private sanitizer: DomSanitizer, private eventTracker: EventTrackerService) {
                this.usuario = JSON.parse(localStorage.getItem('profile')).username;
                this.profile = JSON.parse(localStorage.getItem('evoProfile'));
  }

  ngOnInit() {
    this.setValuesFormBuilder();
    //this.initComponents();

    this.formNuevoProfesional = new FormGroup({
      codmedico: new FormControl({value: '', disabled: true}),
      primerNombre: new FormControl('', [Validators.required]),
      segundoNombre: new FormControl(''),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      tipoDocumento: new FormControl('', [Validators.required]),
      numeroDocumento: new FormControl('', [Validators.required]),
      codigoUsuario: new FormControl('', [Validators.required]),
      cpm: new FormControl('', [Validators.required]),
      especialidad: new FormControl(''),
    });

    this.formGroupSearchHorarios = new FormGroup({
      fecha_desde: new FormControl(''),
      fecha_hasta: new FormControl(''),
      sede: new FormControl('',[Validators.required]),
      especialidad: new FormControl('', [Validators.required])
    });

    this.formRangoHorarios = new FormGroup({
      hora_inicio: new FormControl('08:00', [Validators.required]),
      hora_fin: new FormControl('18:00', [Validators.required]),
    });

    this.codMedico = this.route.snapshot.paramMap.get('codMedico');

    if(this.codMedico) {
      this.obtenerDataMedico(this.codMedico);
      this.obtenerEspecialidades(this.codMedico);
    }

    this.getSede();
    this.initComponents();

  this.formGroupSearchHorarios.controls.fecha_desde.valueChanges.pipe(
      startWith(''),
      tap(value => {
            if ( this.formGroupSearchHorarios.controls.fecha_desde.value && 
              this.formGroupSearchHorarios.controls.fecha_hasta.value) {

              const tiempo = this.formGroupSearchHorarios.controls.fecha_hasta.value.getTime() -
              this.formGroupSearchHorarios.controls.fecha_desde.value.getTime(); 

              const dias = tiempo / (1000 * 3600 * 24);

              if (dias > 30) {
                const result = new Date(this.formGroupSearchHorarios.controls.fecha_desde.value);
                result.setDate(result.getDate() + (dias-30));
                this.formGroupSearchHorarios.controls.fecha_desde.setValue(result);
                const data = {
                  title : 'Mensaje',
                  message : 'El rango máximo es de 30 días hábiles.',
                };
                this.dialog.open(AlertComponent, { 
                    width: '400px', data: { alert: data } 
                });
              }

            } 
        }
      )
   ).subscribe();
   
   this.formGroupSearchHorarios.controls.fecha_hasta.valueChanges.pipe(
    startWith(''),
    tap(value => {
        if ( this.formGroupSearchHorarios.controls.fecha_desde.value && 
          this.formGroupSearchHorarios.controls.fecha_hasta.value) {

          const tiempo = this.formGroupSearchHorarios.controls.fecha_hasta.value.getTime() -
          this.formGroupSearchHorarios.controls.fecha_desde.value.getTime(); 

          const dias = tiempo / (1000 * 3600 * 24);
          if (dias > 30) {
            const result = new Date(this.formGroupSearchHorarios.controls.fecha_hasta.value);
            result.setDate(result.getDate() - (dias-30));
            this.formGroupSearchHorarios.controls.fecha_hasta.setValue(result);
            const data = {
              title : 'Mensaje',
              message : 'El rango máximo es de 30 días hábiles.',
            };
            this.dialog.open(AlertComponent, { 
                width: '400px', data: { alert: data } 
            });
          }
        } 
      }
    )
    ).subscribe();

  }

  openModalRubrica() {
    const data = {
      title : 'Rúbrica del Médico',
      imagePath: this.imagePath
    };

    this.dialog.open(RubricaComponent, {
        width: '400px', data: { rubrica: data }
    });
  }

  isMedic(profile: any) {
    const rolesCode = (profile.rolesCode as Array<any>).find( r => r.nombreAplicacion === 'GESMED');
    if (rolesCode.codigoRol === 'MEDICO') {
      return true;
    }
    return false;
  }

  putRubrica(rubrica: any) {
    const medico = {
      apellidoMaterno: this.medico.apellidoMaterno,
      apellidoPaterno: this.medico.apellidoPaterno,
      certificado: this.medico.certificado,
      codigo: this.medico.codigo,
      codigoUsuario: this.medico.codigoUsuario,
      cmp: this.medico.cmp, // verificar Swagger
      fechaNacimiento: this.medico.fechaNacimiento,
      genero: this.medico.genero,
      numeroDocumento: this.medico.numeroDocumento,
      primerNombre: this.medico.primerNombre,
      idGestor: this.medico.rubricaFirma && this.medico.rubricaFirma === rubrica ?  this.medico.idGestor : '',
      rubricaFirma: rubrica,
      segundoNombre: this.medico.segundoNombre,
      tipoDocumento: this.medico.tipoDocumento,
      usuario: this.medico.usuario
    };

    this.consultaMedService.putMedico(this.codMedico, medico).subscribe(
      (response) => {
        const data = {
          title : 'Mensaje del sistema',
          message : 'La  rúbrica ha sido almacenada correctamente en el Gestor Documental.',
        };

        const dialogRef = this.dialog.open(SuccessComponent, {
            width: '400px', data: { alert: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.deleteFile(0);
          this.obtenerDataMedico(this.codMedico);
        });
      },
      error => {
        this.dialog.closeAll();
        const data = {
          title : 'Mensaje del sistema',
          message : 'Lo sentimos, no pudimos procesar su solicitud. Vuelva a intentarlo en unos momentos.',
        };

        const dialogRef = this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.dialog.closeAll();
          // this.deleteFile(0);
        });
      }
    );

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
        this.eventTracker.postEventTracker("opc81", JSON.stringify(filtros)).subscribe()
     
      };
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

  uploadDocuments() {
    const infoDocumento = {
        documentos: []
    };
    this.getFormArray().controls.forEach(element => {
        const detalle = {documentoBase64: element.value.base64,
                         nombreDocumento: element.value.archivo.name
                          };
        infoDocumento.documentos.push(detalle);
      });
    this.putRubrica(infoDocumento.documentos[0].documentoBase64);
  }

  search(){

  }

  clean() {
    this.formGroupSearchHorarios.reset();
  }

  volverListaProfesionales(){
    this.router.navigate(['professionals']);
  }

  disabledDate(args): void {
    if (args.date.getDay() === 0) {
        //set 'true' to disable the weekends
        args.isDisabled = true;
    }
  }

  onClick(e:any){
    console.log(e);
    if(this.formRangoHorarios.invalid){
      return;
    }

    /* const request = {
      "codigoSede": +this.formGroupSearchHorarios.controls.sede.value,
      "codigoEspecialidad": +this.formGroupSearchHorarios.controls.especialidad.value,
      "fechaInicio":  moment(this.formGroupSearchHorarios.controls.fecha_desde.value).format(BASE_DATE_FORMAT_API) ,
      "fechaFin":  moment(this.formGroupSearchHorarios.controls.fecha_hasta.value).format(BASE_DATE_FORMAT_API),
      "horaInicio": this.formRangoHorarios.controls.hora_inicio.value,
      "horaFin": this.formRangoHorarios.controls.hora_fin.value
    }
    */

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let diaDescripcion : string;
    switch (e.value.getDay()) {
      case 1: diaDescripcion= 'Lunes'; break;
      case 2: diaDescripcion= 'Martes'; break;
      case 3: diaDescripcion= 'Miercoles'; break;
      case 4: diaDescripcion= 'Jueves'; break;
      case 5: diaDescripcion= 'Viernes'; break;
      case 6: diaDescripcion= 'Sabado'; break;
      default:
              diaDescripcion= 'Domingo';
        break;
    }

   const horario = { 
    numeroCorrelativo : 0,
    codigoMedico : +this.codMedico,
    codigoSede : +this.formGroupSearchHorarios.controls.sede.value,
    codigoEspecialidad : +this.formGroupSearchHorarios.controls.especialidad.value,
    fecha : moment(e.value).format(BASE_DATE_FORMAT_API),
    diaDescripcion,
    fechaDia : e.value.getDate(), 
    anio : e.value.getFullYear(), 
    mesDescripcion : monthNames[e.value.getMonth()], 
    fechaInicio:   moment(e.value).format(BASE_DATE_FORMAT_API) ,
    fechaFin:   moment(e.value).format(BASE_DATE_FORMAT_API) ,
    horaInicio : this.formRangoHorarios.controls.hora_inicio.value,
    horaFin : this.formRangoHorarios.controls.hora_fin.value,
    estado : 'V'
  };

    if (!this.horarios.find((e: any) => JSON.stringify(e)  === JSON.stringify(horario) )) {
      this.horarios.push(     
        horario
      );
    }
      

    //   }
    // })

    
  }

  editarProfesional(){
    const filtros = this.formNuevoProfesional.value;
    this.eventTracker.postEventTracker("opc80",JSON.stringify(filtros)).subscribe()
    this.router.navigate(['edit-profesional/' + this.codMedico]);
  }

  getSede(){
    this.profesionalService.getSede(this.codMedico)
      .subscribe((response: any) => {
          console.log(response);
          if (response && response.operacion === 200) {
              this.sedes = response.data;
          }
      });
  }

  seleccionarSede(e : any){
    console.log(e.value)
    let codigoSede = e.value
    this.profesionalService.getEspecialidades(this.codMedico, this.formGroupSearchHorarios.controls.sede.value)
      .subscribe((response: any) => {
          console.log(response);
          if (response && response.operacion === 200) {
              this.especialidades = response.data;
          }
    });

  }

  eliminarHorario(element : any){
    this.eventTracker.postEventTracker("opc83", JSON.stringify(element)).subscribe()
    element.estado = 'A';
    /* let index = this.horarios.indexOf(element, 0)
    this.profesionalService.deleteHorario(this.codMedico, element.numeroCorrelativo )
      .subscribe((response: any) => {
          console.log(response)
          if (response.mensaje == 'REMOVED' && response.operacion == 200) {
              //this.especialidades = response.data;
              this.horarios.splice(index, 1);
          }
    }); */
  }

  
  aplicarHorario(){
      
   
      const request = {
        horarios : []
      };
/* 
        "codigoSede": +this.formGroupSearchHorarios.controls.sede.value,
        "codigoEspecialidad": +this.formGroupSearchHorarios.controls.especialidad.value,
        "fechaInicio":  moment(this.formGroupSearchHorarios.controls.fecha_desde.value).format(BASE_DATE_FORMAT_API) ,
        "fechaFin":  moment(this.formGroupSearchHorarios.controls.fecha_hasta.value).format(BASE_DATE_FORMAT_API),
        "horaInicio": this.formRangoHorarios.controls.hora_inicio.value,
        "horaFin": this.formRangoHorarios.controls.hora_fin.value
      } */

      for (let index = 0; index < this.horarios.length; index++) {
          request.horarios.push(
            {
              codigoHorario: this.horarios[index].numeroCorrelativo,
              codigoSede: +this.horarios[index].codigoSede,
              codigoEspecialidad: +this.horarios[index].codigoEspecialidad,
              fechaInicio: this.horarios[index].fechaInicio,
              fechaFin: this.horarios[index].fechaFin,
              horaInicio: this.horarios[index].horaInicio,
              horaFin: this.horarios[index].horaFin,
              estado: this.horarios[index].estado
            }
          );
      }
      this.eventTracker.postEventTracker("opc84", JSON.stringify(request)).subscribe()
      //agregando o actualizando data

      //if ( data_agregar.length > 0) {
        this.profesionalService.agregarHorario(this.codMedico, request )
        .subscribe((response: any) => {
            console.log(response);
            if (response.mensaje === 'CREATED' && response.operacion === 201) {
                this.buscarHorarioFiltro();
            }
        });
      //}

      // //actualizando data
      // if ( data_actualizar.length > 0) {
      //   this.profesionalService.actualizarHorario(this.codMedico, data_actualizar)
      //   .subscribe((response: any) => {
      //       console.log(response)
      //       if (response.mensaje == 'UPDATED' && response.operacion == 201) {
      //           console.log('horario actualizado')
      //       }
      //   })
      // }
  }

  obtenerDataMedico(codMedico:string){
    this.profesionalService.obtenerDataMedico(codMedico)
      .subscribe((response: any) => {
          this.medico = response.data;
          this.imagePath =  response.data.rubricaFirma ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + response.data.rubricaFirma) : null;
          this.rubricaBase = response.data.rubricaFirma ? response.data.rubricaFirma : null;
          this.return();
          this.formNuevoProfesional.controls.codmedico.setValue(response.data.codigoMedico);
          this.formNuevoProfesional.controls.primerNombre.setValue(response.data.primerNombre);
          this.formNuevoProfesional.controls.segundoNombre.setValue(response.data.segundoNombre);
          this.formNuevoProfesional.controls.apellidoPaterno.setValue(response.data.apellidoPaterno);
          this.formNuevoProfesional.controls.apellidoMaterno.setValue(response.data.apellidoMaterno);
          this.formNuevoProfesional.controls.genero.setValue(response.data.genero);
          this.formNuevoProfesional.controls.tipoDocumento.setValue(response.data.tipoDocumento);
          this.formNuevoProfesional.controls.fechaNacimiento.setValue(moment(response.data.fechaNacimiento).format(BASE_DATE_FORMAT));
          this.formNuevoProfesional.controls.numeroDocumento.setValue(response.data.numeroDocumento);
          this.formNuevoProfesional.controls.codigoUsuario.setValue(response.data.codigoUsuario);
          this.formNuevoProfesional.controls.cpm.setValue(response.data.cmp);
      });
  }

  obtenerEspecialidades(codMedico:string){
    this.profesionalService.obtenerEspecialidades(codMedico)
    .subscribe((response: any) => { 
      if(response) {
        let result = Object.values(response.data.reduce((c, {sede,...u}) => {
          let k = u.codigoEspecialidad;   
          let p = sede;                 
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
            this.especialidadesSelected.push(
              {
                codigo: result[index]['codEspecialidad'],
                descripcion: result[index]['especialidad'],
                tiempo: result[index]['tiempoAtencion'],
                rne: result[index]['rne'],
                sedes : result[index]['sedes'].join(', ')
              }
            );
        }
      }
      
    });
  }

  toggleFilter() {
    const isDesktop = window.innerWidth > 991;
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

  initComponents() {
    /* const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    } */
  }


  @HostListener('window:resize')
  onResize() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
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

  formGroupSearchHorariosSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
    this.toggleFilter();
  }

  buscarHorarioFiltro(){
    const fechaInicio = moment(this.formGroupSearchHorarios.controls.fecha_desde.value);
    const fechaFin = moment(this.formGroupSearchHorarios.controls.fecha_hasta.value);
    if (fechaInicio.isAfter(fechaFin)) {
      this.alertaBuscarHorario('La Fecha Desde es mayor a la Fecha Hasta');
      return;
    }
    if (!this.formGroupSearchHorarios.valid) {
      this.alertaBuscarHorario();
      return;
    }

    const request = {
      "codigoSede": +this.formGroupSearchHorarios.controls.sede.value,
      "codigoEspecialidad": +this.formGroupSearchHorarios.controls.especialidad.value,
      "fechaInicio":  moment(this.formGroupSearchHorarios.controls.fecha_desde.value).format(BASE_DATE_FORMAT_API) ,
      "fechaFin":  moment(this.formGroupSearchHorarios.controls.fecha_hasta.value).format(BASE_DATE_FORMAT_API)
    }

    const filtro={
      "codigoSede: " : request.codigoSede,
      "codigoEspecialidad: " : request.codigoEspecialidad,
      "fechaInicio: " : request.fechaInicio,
      "fechaFin: " : request.fechaFin,
    }
    this.eventTracker.postEventTracker("opc82",JSON.stringify(filtro)).subscribe()


    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    this.profesionalService.buscarHorarioFiltro(this.codMedico, request)
    .subscribe((response: any) => { 
        this.horarios = [];
        this.buscarHorario = true;
        if(response){
          for (let index = 0; index < response.data.length; index++) {

            let diaDescripcion : string;  

            switch (new Date(response.data[index].fechaInicio).getDay()) {
              case 1: diaDescripcion= 'Lunes'; break;
              case 2: diaDescripcion= 'Martes'; break;
              case 3: diaDescripcion= 'Miercoles'; break;
              case 4: diaDescripcion= 'Jueves'; break;
              case 5: diaDescripcion= 'Viernes'; break;
              case 6: diaDescripcion= 'Sabado'; break;
              default:
                      diaDescripcion= 'Domingo';
                break;
            } 
        
            this.horarios.push(     
              { 
                numeroCorrelativo : response.data[index].numeroCorrelativo,
                codigoMedico : response.data[index].codigoMedico,
                codigoSede : +response.data[index].codigoSede,
                codigoEspecialidad : +response.data[index].codigoEspecialidad,
                fecha : response.data[index].fecha,
                diaDescripcion,
                fechaDia : new Date(response.data[index].fechaInicio + 'T00:00:00').getDate(), 
                anio : new Date(response.data[index].fechaInicio).getFullYear(), 
                mesDescripcion : monthNames[new Date(response.data[index].fechaInicio).getMonth()], 
                fechaInicio:  response.data[index].fechaInicio ,
                fechaFin:  response.data[index].fechaFin,
                horaInicio : response.data[index].horaInicio,
                horaFin : response.data[index].horaFin,
                estado : response.data[index].estado
              }
            );
            
          }

          

        }
    } 
    );
  }

  setearDias(){
    console.log('-');
  }

  alertaBuscarHorario(mensaje: any = null) {
    const data = {
      title: "Mensaje del sistema",
      message: mensaje
        ? mensaje
        : "Debe seleccionar una sede y especialidad para la búsqueda de horario.",
    };
  this.dialog.open(AlertComponent, {
      width: "400px",
      data: { alert: data },
  });
  }
}
