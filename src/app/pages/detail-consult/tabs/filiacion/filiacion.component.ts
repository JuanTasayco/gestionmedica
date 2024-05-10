import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { SuccessComponent } from "@shared/components/success/sucess.component";
import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { ActivatedRoute } from "@angular/router";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { markFormGroupTouched, RegularExpression } from "@shared/helpers";
import { EventTrackerService } from "@shared/services/event-tracker.service";

@Component({
    selector: 'mantenimiento-tab-filiacion',
    templateUrl: './filiacion.component.html',
    styleUrls: ['../../detail-consult.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  
  export class TabFiliacionComponent implements OnInit {
    filiacionOrdenado = [];
    @Input() data_consulta:any;
    dataFiliacion = [];
    dataFiliacion_aux = [];
    formularioFiliacion : FormGroup;
    historiaCaja : boolean;
    showPersonal : boolean ;
    editarFiliacion : boolean = false;
    numeroConsulta: string;
    
    @Input() isNurseValue: boolean;
    
    valueChanges = false;
    antecedentesChanges = false;
    @Output() historia = new EventEmitter<boolean>(false);
    @Output() antecedentes = new EventEmitter<boolean>(false);
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    constructor( private consultaMedService : ConsultaMedicaService, private dialog: MatDialog, private route: ActivatedRoute, private eventTracker: EventTrackerService) {}

      ngOnInit(){
        this.antecedentes.emit(false);
        this.historia.emit(false);
        this.numeroConsulta = this.route.snapshot.paramMap.get('numeroConsulta');
        if (this.data_consulta && this.data_consulta['estado'] == 'EN ATENCION' || this.data_consulta['estado'] == 'EN ESPERA' ||
        this.data_consulta['estado'] == 'EN ESPERA TRIAJE') {
            this.editarFiliacion = true;
        }

        this.formularioFiliacion = new FormGroup({
            raza: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            nacionalidad: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            lugar_nacimiento: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            religion: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            residencia: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            distrito: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            domicilio: new FormControl('', [Validators.required, Validators.pattern(RegularExpression.LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES)]),
            responsable: new FormControl('')
          });
        this.cargarFiliacionAntecedentes();
        // this.consultaMedService.getDetalleConsultaMedica(this.numeroConsulta)
        //   .subscribe((response: any) => {
        //     if (response.mensaje === 'OK' && response.operacion === 200 && response.data) {
        //       this.data_consulta = response.data;
        //     }
        //   });
      }

      limpiarFormFormulario(){
        this.formularioFiliacion.reset()
      }
      
      cargarFiliacionAntecedentes(){
 
        this.consultaMedService.cargarFiliacionAntecedentes(this.data_consulta['numeroConsulta'])
            .subscribe((response: any) => {
              if (response) {
                this.dataFiliacion = response.data;
                this.dataFiliacion_aux = response.data;

                let subtitulos = [];
                let cajaSubitutlo = [];
                let itemsCajaSubitutlo = [];

                //agrupando la data segun el tipo
                for (let index = 0; index < this.dataFiliacion.length; index++) {
                  //cabecera
                  if ( this.dataFiliacion[index]['sgorgn'].length == 1  ) {
                    this.filiacionOrdenado.push({cabecera : this.dataFiliacion[index], subtitulos : []})
                  }
                  //subtitulos
                  if ( this.dataFiliacion[index]['sgorgn'].length == 3  ) {
                    subtitulos.push({data : this.dataFiliacion[index] , cajas : []})
                  }
                  // cajas de subtitulos
                  if ( this.dataFiliacion[index]['sgorgn'].length == 5  ) {
                    cajaSubitutlo.push({data : this.dataFiliacion[index] , items : []} )
                  }
                  // items de las cajas
                  if ( this.dataFiliacion[index]['sgorgn'].length == 7  ) {
                    itemsCajaSubitutlo.push(this.dataFiliacion[index])
                  }
                }

                //agrupando los subtitulos segun su cabecera
                for (let index = 0; index < subtitulos.length; index++) {
                  for (let j = 0; j < this.filiacionOrdenado.length; j++) {
                    if (subtitulos[index]['data']['sgorgn'].substr(0,2) == 
                    this.filiacionOrdenado[j]['cabecera']['sgorgn']+'.') {
                      this.filiacionOrdenado[j]['subtitulos'].push(subtitulos[index])
                      
                    }
                  }
                }

                this.formularioFiliacion.controls.raza.setValue(this.filiacionOrdenado[0].subtitulos[0].data.detalle)
                this.formularioFiliacion.controls.nacionalidad.setValue(this.filiacionOrdenado[0].subtitulos[1].data.detalle)
                this.formularioFiliacion.controls.lugar_nacimiento.setValue(this.filiacionOrdenado[0].subtitulos[2].data.detalle)
                this.formularioFiliacion.controls.religion.setValue(this.filiacionOrdenado[0].subtitulos[3].data.detalle)
                this.formularioFiliacion.controls.residencia.setValue(this.filiacionOrdenado[0].subtitulos[4].data.detalle)
                this.formularioFiliacion.controls.distrito.setValue(this.filiacionOrdenado[0].subtitulos[6].data.detalle)
                this.formularioFiliacion.controls.domicilio.setValue(this.filiacionOrdenado[0].subtitulos[5].data.detalle)
                this.formularioFiliacion.controls.responsable.setValue(this.filiacionOrdenado[0].subtitulos[7].data.detalle)

                //agrupando las cajas de los subtitulos 
                for (let index = 0; index < cajaSubitutlo.length; index++) {
                  for (let j = 0; j < this.filiacionOrdenado.length; j++) {
                    for (let k = 0; k < this.filiacionOrdenado[j]['subtitulos'].length; k++) {
                      if (cajaSubitutlo[index]['data']['sgorgn'].substr(0,3) == 
                      this.filiacionOrdenado[j]['subtitulos'][k]['data']['sgorgn']) {
                      this.filiacionOrdenado[j]['subtitulos'][k]['cajas'].push(cajaSubitutlo[index])
                     }
                    }
                  }
                }

                //agrupando los items de las cajas
                for (let index = 0; index < itemsCajaSubitutlo.length; index++) {
                  for (let j = 0; j < this.filiacionOrdenado.length; j++) {
                    for (let k = 0; k < this.filiacionOrdenado[j]['subtitulos'].length; k++) {
                      for (let h = 0; h < this.filiacionOrdenado[j]['subtitulos'][k]['cajas'].length; h++) {
                        if (itemsCajaSubitutlo[index]['sgorgn'].substr(0,5) == 
                        this.filiacionOrdenado[j]['subtitulos'][k]['cajas'][h]['data']['sgorgn']) {
                        this.filiacionOrdenado[j]['subtitulos'][k]['cajas'][h]['items'].push(itemsCajaSubitutlo[index])
                      }
                     }
                    }
                  }
                }

                this.onFiliacionChanges();

              }

          });
      }

      guardarHistoria(subtitulosHistoria : any, estado : boolean){

        markFormGroupTouched(this.formularioFiliacion);
        if (!this.formularioFiliacion.valid) {
          return;
        }

        this.filiacionOrdenado[0].subtitulos[0].data.detalle = this.formularioFiliacion.controls.raza.value
        this.filiacionOrdenado[0].subtitulos[1].data.detalle = this.formularioFiliacion.controls.nacionalidad.value
        this.filiacionOrdenado[0].subtitulos[2].data.detalle = this.formularioFiliacion.controls.lugar_nacimiento.value
        this.filiacionOrdenado[0].subtitulos[3].data.detalle = this.formularioFiliacion.controls.religion.value
        this.filiacionOrdenado[0].subtitulos[4].data.detalle = this.formularioFiliacion.controls.residencia.value
        this.filiacionOrdenado[0].subtitulos[6].data.detalle = this.formularioFiliacion.controls.distrito.value
        this.filiacionOrdenado[0].subtitulos[5].data.detalle = this.formularioFiliacion.controls.domicilio.value
        this.filiacionOrdenado[0].subtitulos[7].data.detalle = this.formularioFiliacion.controls.responsable.value

        const request = {
          "filiacion" : []
        };

        for (let i = 0; i < subtitulosHistoria.length; i++) {
          request.filiacion.push({
            "grupo": subtitulosHistoria[i].data.grupo,
            "subgrupo": +subtitulosHistoria[i].data.subGrupo,
            "idplantilla": +subtitulosHistoria[i].data.idPlantilla,
            "valorsino": subtitulosHistoria[i].data.valorSiNo,
            "detalle": subtitulosHistoria[i].data.detalle
          })
        }
        
        this.eventTracker.postEventTracker("opc70.1", JSON.stringify(request)).subscribe()


        this.guardarFiliacion('Historia clínica', request);
      }

      guardarAntecedentes(){
        const request = {
          "filiacion" : []
        };
        
        request.filiacion.push({
          "textoPlanilla": this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.textoPlanilla,
          "grupo": this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.grupo,
          "subgrupo": +this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.subGrupo,
          "idplantilla": +this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.idPlantilla,
          "valorsino": this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.valorSiNo,
          "detalle": this.filiacionOrdenado[1].subtitulos[0].cajas[0].data.detalle
        })

        let itemsAntecedentes = this.filiacionOrdenado[1].subtitulos[1].cajas;

        for (let i = 0; i < itemsAntecedentes.length; i++) {
          for (let j = 0; j < itemsAntecedentes[i].items.length; j++) {
            request.filiacion.push({
              "textoPlanilla": itemsAntecedentes[i].items[j].textoPlanilla,
              "grupo": itemsAntecedentes[i].items[j].grupo,
              "subgrupo": +itemsAntecedentes[i].items[j].subGrupo,
              "idplantilla": +itemsAntecedentes[i].items[j].idPlantilla,
              "valorsino": itemsAntecedentes[i].items[j].valorSiNo,
              "detalle": itemsAntecedentes[i].items[j].detalle
            })
            
          }
        }

        this.guardarFiliacion('Antecendentes', request);

      }

      guardarFiliacion(titulo :String, data:any){
        const filtro = {
          "numeroConsulta": this.data_consulta['numeroConsulta']
        }
        this.eventTracker.postEventTracker("opc70", JSON.stringify({...data, ...filtro})).subscribe()

        //LLAMAR API
        this.consultaMedService.guardarHistoria(data, this.data_consulta['numeroConsulta'])
        .subscribe((response: any) => {
            if (response.operacion == 201 && response.mensaje == "CREATED" ) {
              if (titulo == 'Historia clínica') {
                this.editarHistoria(true);
                this.historia.emit(false);
              }else{
                this.showPersonal = true;
                this.antecedentes.emit(false);
              }


              const data = {
                title : 'Éxito',
                message : titulo+ ' ha sido registrada con éxito.',
                type : 4
              }
              const dialogRef = this.dialog.open(SuccessComponent, { 
                  width: '400px', data: { alert: data } 
              });
            }
        })
      }

      editarHistoria(estado:boolean){
         this.historiaCaja = estado;
      }

      editarAntecedentes(){
        this.showPersonal = false;
      }

      onFiliacionChanges() {
        this.formularioFiliacion.valueChanges.subscribe(value => {
          this.valueChanges = value ? true : false;
          this.historia.emit(this.valueChanges);
        });
          }

      onAntecedentesChange(event) {
        this.antecedentes.emit(true);
      }

  }