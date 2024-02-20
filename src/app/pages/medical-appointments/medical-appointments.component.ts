import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { MIN_CHARACTERS_SEARCH,BASE_DATE_FORMAT, BASE_DATE_FORMAT_API } from '@shared/helpers';
import { Router } from '@angular/router';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { ProfesionalService } from '@shared/services/profesional.service';
import * as moment from 'moment';
import { ComunService } from '@shared/services/comun.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { UsuarioService } from '@shared/services/usuario.service';

@Component({
  selector: 'mapfre-medical-appointments',
  templateUrl: './medical-appointments.component.html',
  styleUrls: ['./medical-appointments.component.scss']
})
export class MedicalAppointmentsComponent implements OnInit {
  pagination: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  totalItemsPage: number = 10;
  hasRecords: boolean;
  usuario : string = "";

  isFilterVisible: boolean;
  mostrarFiltros = false;
  disableButton: boolean;

  sedes : any[];
  especialidades : any[] = [];
  estado:any[];

  profile:any;
  medicosData: any[];
  finaciadorData: any[];
  pacienteData: any[];
  consultasMedica_data = [];
  formFiltroBandeja : FormGroup;

  statusPaciente : number = 0;
  statusFinanciador : number = 0;

  beneficios : any[];
  sedeDefecto: number = 0;

  constructor(private router : Router, private consultaMedService : ConsultaMedicaService,
    private comunService: ComunService, private profesionalService : ProfesionalService, private eventTracker: EventTrackerService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    console.log("Sprint2-2024-02-20 0900");
    this.eventTracker.postEventTracker("opc32", "").subscribe()

    this.initComponents();

    this.formFiltroBandeja = new FormGroup({
      medico: new FormControl(''),
      codSede: new FormControl(''),
      codEspecialidad: new FormControl(''),
      fecha_desde: new FormControl(new Date()),
      fecha_hasta: new FormControl(new Date()),
      nroConsulta: new FormControl(''),
      paciente: new FormControl(''),
      financiador: new FormControl(''),
      beneficio: new FormControl(''),
      estado: new FormControl(''),
      usuario: new FormControl(''),
    });

    this.usuario = JSON.parse(localStorage.getItem('profile')).username;
    this.profile = JSON.parse(localStorage.getItem('evoProfile'));

    if(this.isMedic(this.profile) || this.isNurse(this.profile)){
      this.getCodUsuario();
    } else {
      this.getSedeLista('0');
      this.getEspecialidadesLista('0', '0');
    }

    this.formFiltroBandeja.controls.medico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getMedicos(value);
        }
      })
    ).subscribe();

    this.formFiltroBandeja.controls.financiador.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= 2 && this.statusFinanciador == 0) {

          this.getFinanciador(value);
        }
      })
    ).subscribe();

    this.formFiltroBandeja.controls.beneficio.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= 2 && this.statusFinanciador == 0) {

          this.getbeneficios(value);
        }
      })
    ).subscribe();

    this.formFiltroBandeja.controls.paciente.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= 2 && this.statusPaciente == 0) {
          this.getPaciente(value);
        }
      })
    ).subscribe();

    this.getEstados()
  }

  isMedic(profile:any){
    let rolesCode =(profile.rolesCode as Array<any>).find( r=> r.nombreAplicacion =='GESMED')
    if(rolesCode.codigoRol == 'MEDICO'){
      return true
    }
    return false;
 }

 isNurse(profile: any) {
  const rolesCode = (profile.rolesCode as Array<any>).find( r => r.nombreAplicacion === 'GESMED');
  if (rolesCode.codigoRol === 'ENFERMERO') {
    return true;
  }
  return false;
}

  listarConsultasMedicas(){
    this.consultasMedica_data = [];
    const request = {
      pagina: this.pagination,
      tamanio: this.totalItemsPage,
      codigoMedico: this.formFiltroBandeja.controls.medico.value ? this.formFiltroBandeja.controls.medico.value.codigo : '0',
      codigoSede: this.formFiltroBandeja.controls.codSede.value ? this.formFiltroBandeja.controls.codSede.value : '0',
      codigoEspecialidad: this.formFiltroBandeja.controls.codEspecialidad.value ? this.formFiltroBandeja.controls.codEspecialidad.value : '999',
      fechaInicio: this.formFiltroBandeja.controls.fecha_desde.value ? moment(this.formFiltroBandeja.controls.fecha_desde.value).format(BASE_DATE_FORMAT_API) : '',
      fechaFin: this.formFiltroBandeja.controls.fecha_hasta.value ? moment(this.formFiltroBandeja.controls.fecha_hasta.value).format(BASE_DATE_FORMAT_API) : '',
      consulta: this.formFiltroBandeja.controls.nroConsulta.value ? this.formFiltroBandeja.controls.nroConsulta.value : '',
      paciente: this.formFiltroBandeja.controls.paciente.value ? this.formFiltroBandeja.controls.paciente.value : '',
      financiador: this.formFiltroBandeja.controls.financiador.value ? this.formFiltroBandeja.controls.financiador.value : '',
      estado:  this.formFiltroBandeja.controls.estado.value? this.formFiltroBandeja.controls.estado.value:'Z',
      usuario: this.usuario,
      beneficio: this.formFiltroBandeja.controls.beneficio.value ? this.formFiltroBandeja.controls.beneficio.value.codigoBeneficio : '',
    };

    const filter = {
      codigoMedico: request.codigoMedico,
      codigoSede: +request.codigoSede,
      codigoEspecialidad: +request.codigoEspecialidad,
      fechaInicio: request.fechaInicio,
      fechaFin: request.fechaFin,
      consulta: request.consulta,
      paciente: request.paciente,
      financiador: request.financiador,
      estado:  request.estado,
      usuario: request.usuario,
    }

    this.eventTracker.postEventTracker("opc33", JSON.stringify(filter)).subscribe()


    this.consultaMedService.getBandejaConsultasMedicas(request)
      .subscribe((response: any) => {
        if (response != null) {
          for (let index = 0; index < response.data.length; index++) {
            response.data[index]['fechaConsulta']
            = moment(response.data[index]['fechaConsulta']).format(BASE_DATE_FORMAT) + ' a las ' +
            moment(response.data[index]['fechaConsulta']).format('HH:mm a');
          }

          this.consultasMedica_data = response.data;
          this.totalItems = response.numeroRegistros;
          const totalPages = Math.ceil(response.numeroRegistros / this.totalItemsPage);
          if (totalPages < 1) { this.totalPages = 1; }
          if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
        }
    });
  }

  getCodUsuario(){
    this.usuarioService.getMedicoByUser(this.usuario)
    .subscribe((response: any) => {
        this.sedeDefecto = response.body.data.sedeDefecto ? response.body.data.sedeDefecto.toString() : 0;
        if(this.isMedic(this.profile)) {
          this.formFiltroBandeja.get('medico').patchValue({
            descripcion:JSON.parse(localStorage.getItem('profile')).name,
            codigo:response.body.data.codMedico
          })
          this.getEspecialidadesLista(response.body.data.codMedico, '0')
        }
        this.getSedeLista(response.body.data.codMedico);
        this.getEspecialidadesLista('0', '0');
        localStorage.setItem('codMedico',response.body.data.codMedico);
    });
  }

  getSedeLista(codMedico:string){
    this.profesionalService.getSede2(codMedico)
      .subscribe((response: any) => {
        if (response && response.operacion == 200) {
          this.sedes = response.data;
          if(this.isNurse(this.profile)) {
            this.formFiltroBandeja.get('codSede').setValue(this.sedeDefecto);
          } else {
            this.formFiltroBandeja.get('codSede').setValue('0');
          }
          this.formFiltroBandeja.get('codEspecialidad').setValue('999');
        }
      })
  }

  getEspecialidadesLista(codMedico:string, codSede: string){
    this.profesionalService.getEspecialidades(codMedico, codSede)
      .subscribe((response: any) => {
          if (response && response.operacion == 200) {
              this.especialidades = response.data;
              // const check = this.especialidades.find(f => f.codigo === '999');
              // if(!check) {
              //   this.especialidades.unshift({codigo: "999", descripcion: "TODOS"})
              // }
              this.formFiltroBandeja.get('codEspecialidad').setValue('999')
          }
    })
  }

  onSelectedSearch(tipo: string, e: any) {
    switch (tipo) {
      case 'M':
        this.medicosData = [];
        this.getSede(e.option.value.codigo);
      break;
      case 'S':
        var codMedico = this.formFiltroBandeja.get('medico').value ? this.formFiltroBandeja.get('medico').value.codigo : 0
        this.getEspecialidadesLista(codMedico, e.value);
      break;
    }
  }

  onDisplaySearch(value) {
    return value ? value.descripcion : '';
  }

  onDisplaySearchBeneficio(value) {
    return value ? value.descripcionBeneficio : '';
  }

  getSede(codMedico:string){
    this.consultaMedService.getSedes()
      .subscribe((response: any) => {
          if (response && response.mensaje == 'OK' && response.operacion == 200) {
              this.sedes = response.data;
              this.getSedeByCodMedico(codMedico);
          }
      })
  }

  getMedicos(text: any) {
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
    .subscribe((response: any) => {
      this.medicosData = response.body.data;
    });
  }

  getFinanciador(text: string) {
    this.consultaMedService.getFinanciador(text)
    .subscribe((response: any) => {
        if (response) {
          this.finaciadorData = response.data;
        }
    });
  }

  getbeneficios(text: string){
    this.consultaMedService.getBeneficios(text)
    .subscribe((response: any) => {
        if (response) {
          this.beneficios = response.data;
        }
    });
  }

  getPaciente(text: any) {
    this.consultaMedService.getPaciente(text)
    .subscribe((response: any) => {
        if (response) {
          this.pacienteData = response.data;
        }
    });
  }

  // Cambio de página con mismos filtros
  changePage(event: any) {
    this.pagination = event.page;

    this.listarConsultasMedicas();
  }

  getSedeByCodMedico(codMedico:string){
    this.consultaMedService.getSedeByCodMedico(this.usuario)
    .subscribe((response: any) => {
        this.formFiltroBandeja.controls.codSede.setValue(response.data.codigo.toString());
        this.getEspecialidades(codMedico);
    });
  }

  getEspecialidades(codMedico:string){
    this.profesionalService.getEspecialidades(codMedico, this.formFiltroBandeja.controls.codSede.value)
      .subscribe((response: any) => {

          if (response.mensaje == 'OK' && response.operacion == 200) {
              this.especialidades = response.data;
              this.listarConsultasMedicas();
          }
    })
  }

  // Mostrar/Ocultar filtro en vista responsive
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

  verFiltros() {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
      } else {
      this.mostrarFiltros = true;
    }
  }

  clean() {
    if(this.isMedic(this.profile)){
      let medico = this.formFiltroBandeja.get('medico').value;
      this.formFiltroBandeja.reset();
      this.formFiltroBandeja.get('medico').patchValue(medico);
      this.formFiltroBandeja.get('fecha_desde').patchValue(new Date());
      this.formFiltroBandeja.get('fecha_hasta').patchValue(new Date());
      this.formFiltroBandeja.get('estado').patchValue('');
    } else{
      this.formFiltroBandeja.reset();
    }
  }

  goToGenesys(historia:any){
    this.eventTracker.postEventTracker("opc35", JSON.stringify(historia)).subscribe()
    window.open(historia.urlGenesys, "_blank")
  }

  anularConsulta(historia:any){

    this.eventTracker.postEventTracker("opc34", JSON.stringify(historia)).subscribe()
    let index = this.consultasMedica_data.indexOf(historia, 0)
    this.consultaMedService.anularConsulta( +historia.numeroConsulta )
    .subscribe((response: any) => {
        if ( response.operacion == 200 && response.mensaje == 'Ok' ) {
          this.consultasMedica_data.splice(index, 1);
        }else{
        }
    });
  }

  getEstados(){
    this.consultaMedService.getEstados()
    .subscribe((response: any) => {
      this.estado = response.data;
      if (this.isNurse(this.profile)) {
        this.estado = this.estado.filter(f => f.codigo === 'S');
        this.formFiltroBandeja.get('estado').setValue('S');
      } else {
        this.formFiltroBandeja.get('estado').setValue('E');
      }
    });
  }

  verDetalle(historia:any){
    this.eventTracker.postEventTracker("opc36", JSON.stringify(historia)).subscribe()

    localStorage.setItem('data_consulta',  JSON.stringify(historia));
    this.router.navigate(['medical-appointments/' + 'detail/' + historia.numeroConsulta ]);
  }

  initComponents() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }
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


  pacienteSeleccionado(event: MatAutocompleteSelectedEvent): void {
    //this.formFiltroBandeja.controls.paciente.setValue(event.option.value)
    this.statusPaciente = 1;
  }

  financiadorSeleccionado(event: MatAutocompleteSelectedEvent): void {
    //this.formFiltroBandeja.controls.financiador.setValue(event.option.viewValue)
    this.statusFinanciador = 1;
  }

  deleteInput(paciente : boolean){
    if (paciente) {
      this.statusPaciente = 0;
    }else{
      this.statusFinanciador = 0;
    }
  }

  deleteInputBeneficio(){
    this.beneficios = [];
  }

}
