import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { BASE_DATE_FORMAT, BASE_DATE_FORMAT_API, MIN_CHARACTERS_SEARCH } from "@shared/helpers";
import { ComunService } from "@shared/services/comun.service";
import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { EventTrackerService } from "@shared/services/event-tracker.service";
import { ProfesionalService } from "@shared/services/profesional.service";
import * as moment from "moment";
import { debounceTime, startWith, tap } from "rxjs/operators";

@Component({
    selector: 'mantenimiento-tab-historial',
    templateUrl: './historial.component.html',
    styleUrls: ['../../detail-consult.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  
  export class TabHistorialComponent implements OnInit {
  
    pagination: number = 1;
    isFilterVisible : boolean;
    @Input() data_consulta:any;
    //tab historial
    tipo_filtro : string = "1";
    consultas = [];
    ordenes = [];
    totalItems: number = 0;
    sedes : any;
    especialidad : any;
    procedimientos : any;
    estado : any;
    totalPages: number = 0;
    totalItemsPage: number = 10;
    formFiltroAtenciones : FormGroup;

    constructor( 
      private consultaMedService : ConsultaMedicaService,
      private comunService: ComunService,
      private profesionalService:ProfesionalService,
      private eventTracker: EventTrackerService,
      private router : Router
      ) {}

    ngOnInit(){
      let fecha_desde = new Date();
      fecha_desde.setDate(fecha_desde.getDate()-30)

      this.formFiltroAtenciones = new FormGroup({
        tipoBusqueda: new FormControl('', Validators.required),
        sede: new FormControl('0', Validators.required),
        fechaInicio: new FormControl(fecha_desde, Validators.required),
        fechaFin: new FormControl(new Date(), Validators.required),
        procedimiento: new FormControl(''),
        codigoEspecialidad: new FormControl(null),
        codigoProcedimiento: new FormControl(null),
        nombrePaciente: new FormControl(''),
        estado: new FormControl(''),
      });

      this.formFiltroAtenciones.controls.sede.setValue({codigo: '0'});

      this.formFiltroAtenciones.controls.tipoBusqueda.setValue('1');
      this.buscarHistorial("1");
      this.getSede();
      this.getEstados();
      this.getEspecialidadesLista('0','0')

      this.formFiltroAtenciones.controls.codigoProcedimiento.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        tap(value => {
          if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
            this.getProcedimientos(value);
          }
        })
      ).subscribe();
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

    getEstados(){
      this.consultaMedService.getEstados()
      .subscribe((response: any) => {
        this.estado = response.data;
      });
    }

    getEspecialidadesLista(codMedico:string, codSede: string){
      this.profesionalService.getEspecialidades(codMedico, codSede)
        .subscribe((response: any) => {
            if (response && response.operacion == 200) {
                this.especialidad = response.data;
            }
      })
    }

    getEspecialidadBySede(e:any){
      if ( this.formFiltroAtenciones.controls.tipoBusqueda.value == "1")return;
      const codSede:string = e.value.codigo;

      this.profesionalService.getEspecialidades("0", codSede)
        .subscribe((response: any) => {
            if (response && response.operacion == 200) {
                this.especialidad = response.data;
            }
      })
    }

    buscarHistorial(pagina:string){
      
    
      if ( this.formFiltroAtenciones.controls.tipoBusqueda.value == "1") {

        const request = {
          "pagina": pagina,
          "tamanio": "10",
          "codigoAfiliado": this.data_consulta['codigoAfiliado'],
          "codigoSede": this.formFiltroAtenciones.controls.sede.value.codigo ? this.formFiltroAtenciones.controls.sede.value.codigo  : this.data_consulta['codigoSede'],
          "fechaInicio": this.formFiltroAtenciones.controls.fechaInicio.value ? 
          moment(this.formFiltroAtenciones.controls.fechaInicio.value).format(BASE_DATE_FORMAT_API) : "2021-01-01",
          "fechaFin": this.formFiltroAtenciones.controls.fechaFin.value ? 
          moment(this.formFiltroAtenciones.controls.fechaFin.value).format(BASE_DATE_FORMAT_API) : "2021-12-31"
        }

        this.eventTracker.postEventTracker("opc68", JSON.stringify(request)).subscribe()

        this.consultaMedService.buscarHistorial( +this.data_consulta['numeroConsulta'] , request )
            .subscribe((response: any) => {
                this.ordenes = []
                this.consultas = []
                if ( response  ) {
                  for (let index = 0; index < response.data.length; index++) {
                    //const element = array[index];
                    response.data[index]['fecha'] 
                    = moment(response.data[index]['fecha']).format(BASE_DATE_FORMAT) + ' a las ' + 
                    moment(response.data[index]['fecha']).format('HH:mm a');
                  }
                  this.consultas = response.data  
                  this.pagination = +pagina;
                  this.totalItems = response.numeroRegistros;
                  const totalPages = response.numeroRegistros / this.totalItemsPage;
                  if (totalPages < 1) { this.totalPages = 1; }
                  if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
                }       
            });

      }else{

        const request = {
          "pagina": pagina,
          "tamanio": "10",
          "codigoAfiliado": this.data_consulta['codigoAfiliado'],
          "estado": this.formFiltroAtenciones.controls.estado.value,
          "codigoEspecialidad": this.formFiltroAtenciones.controls.codigoEspecialidad.value,
          "codigoProcedimiento": (this.formFiltroAtenciones.controls.codigoProcedimiento.value)?this.formFiltroAtenciones.controls.codigoProcedimiento.value.codigo:null,
          "nombrePaciente": this.formFiltroAtenciones.controls.nombrePaciente.value,
          "codigoSede": this.formFiltroAtenciones.controls.sede.value.codigo ? this.formFiltroAtenciones.controls.sede.value.codigo  : this.data_consulta['codigoSede'],
          "fechaInicio": this.formFiltroAtenciones.controls.fechaInicio.value ? 
          moment(this.formFiltroAtenciones.controls.fechaInicio.value).format(BASE_DATE_FORMAT_API) : "2021-01-01",
          "fechaFin": this.formFiltroAtenciones.controls.fechaFin.value ? 
          moment(this.formFiltroAtenciones.controls.fechaFin.value).format(BASE_DATE_FORMAT_API) : "2021-12-31"
        }
    
        this.consultaMedService.buscarHistorialOrden( +this.data_consulta['numeroConsulta'], request )
            .subscribe((response: any) => {
                this.ordenes = []
                this.consultas = []
                if ( response ) {
                  for (let index = 0; index < response.data.length; index++) {
                    //const element = array[index];
                    response.data[index]['fecha'] 
                    = moment(response.data[index]['fecha']).format(BASE_DATE_FORMAT) + ' a las ' + 
                    moment(response.data[index]['fecha']).format('HH:mm a');
                  }
                  this.ordenes = response.data;  
                  this.pagination = +pagina;
                  this.totalItems = response.numeroRegistros;
                  const totalPages = response.numeroRegistros / this.totalItemsPage;
                  if (totalPages < 1) { this.totalPages = 1; }
                  if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
                }       
            });
      }   
    }

    changePage(event: any) {
      this.buscarHistorial(event.page.toString());
    }

    getSede(){
      this.consultaMedService.getSedes()
        .subscribe((response: any) => {
            //console.log(response)
            if (response.mensaje == 'OK' && response.operacion == 200) {
                this.sedes = response.data;
            }
        })
    }
     
    clean(){
      let fecha_desde = new Date();
      fecha_desde.setDate(fecha_desde.getDate()-30)

      this.formFiltroAtenciones = new FormGroup({
        tipoBusqueda: new FormControl('', Validators.required),
        sede: new FormControl('0', Validators.required),
        fechaInicio: new FormControl(fecha_desde, Validators.required),
        fechaFin: new FormControl(new Date(), Validators.required),
        procedimiento: new FormControl(''),
        codigoEspecialidad: new FormControl(null),
        codigoProcedimiento: new FormControl(null),
        nombrePaciente: new FormControl(''),
        estado: new FormControl(''),
      });
      this.formFiltroAtenciones.controls.sede.setValue({codigo: '0'});
      
    }

    getProcedimientos(text: any) {
      this.comunService.getComun('procedimientos', '', text.toUpperCase(), '1', '10')
        .subscribe((response: any) => {
          this.procedimientos = response.body.data;
        });
    }

    onDisplaySearch(value) {
      return value ? value.descripcion : '';
    }

    getDetail(consulta:any){
      this.eventTracker.postEventTracker("opc69", JSON.stringify(consulta)).subscribe()
      const url = environment.oimHome + 'gestionmedica/#/medical-appointments/detail/'+ consulta.numeroConsulta;
      return window.open(url, '_blank');
    }
     
  }