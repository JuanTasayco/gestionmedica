import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {  MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SignDocumentComponent } from '@shared/components/sign-document/sign-document.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { SearchDocumentComponent } from '@shared/components/search-document/search-document.component';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { TabDetalleClinicaComponent } from './tabs/detalle-clinica/detalle-clinica.component';
import { PdfViewerComponent } from '@shared/components/custom-pdf-viewer/custom-pdf-viewer.component';
import { downloadBase64Async, downloadBase64 } from '@shared/helpers/utils';
import { CONTENT_TYPE, ESTADOS, ODONTOGRAM_TYPE, printPdfBase64 } from "@shared/helpers";
import { SuccessComponent } from '@shared/components/success/sucess.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { OdontogramaService } from '@shared/services/odontograma.service';

@Component({
  selector: 'mapfre-detail-consult',
  templateUrl: './detail-consult.component.html',
  styleUrls: ['./detail-consult.component.scss']
})

export class DetailConsultComponent implements OnInit  {
  @ViewChild(TabDetalleClinicaComponent) child;
  @ViewChildren('tab') tabs: QueryList<ElementRef>;
  data_consulta:any ;
  diagnostico : string;
  pdfBase64:string;
  src:any;
  showButtonMedicalRest = false;
  signMedicalRest = false;
  statusMedicalRest: any;

  profile: any;
  nurseValue = false;

  index: any;
  indexOld: any;
  hasChange = false;
  hasChangeHistoria = false;
  hasChangeAntecedentes = false;
  showOdontogramButton = false;

  constructor(private router: Router, private route:ActivatedRoute ,private dialog: MatDialog, private consultaMedService: ConsultaMedicaService,  private eventTracker: EventTrackerService,
    private odontogramaService: OdontogramaService) {
    this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.nurseValue = this.isNurse(this.profile);
  }

  isNurse(profile: any){
    const rolesCode = (profile.rolesCode as Array<any>).find( r => r.nombreAplicacion === 'GESMED');
    if (rolesCode.codigoRol === 'ENFERMERO') {
      return true;
    }
    return false;
  }

  getMensaje(e){
    this.ngOnInit();
  }

  ngOnInit() {
    let numeroConsulta= this.route.snapshot.paramMap.get('numeroConsulta')
    this.getDetalleConsultaMedica(numeroConsulta)
    this.validateMedicalRest();
  }

  ngAfterViewInit() {
	}

  volverConsulta(){
      this.router.navigate(['medical-appointments']);   
  }

  previewPDF(){

    const filtro = {
      "numeroConsulta": this.data_consulta['numeroConsulta'],
      "tempDiagnosticos": this.child.tempDiagnosticos[0]['code']
    }
    this.eventTracker.postEventTracker("opc64", JSON.stringify(filtro)).subscribe()
  
    this.consultaMedService.obtenerGuiaPractica( +this.data_consulta['numeroConsulta'], this.child.tempDiagnosticos[0]['code'])
        .subscribe((response: any) => {
            if ( response) { 
              this.showComponentPDF('data:application/pdf;base64, '+response.data.base64);              
          }     else{
            const data = {
              title : 'Mensaje del sistema',
              message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
            }
  
            const dialogRef = this.dialog.open(AlertComponent, { 
                width: '400px', data: { alert: data } 
            });
          }    
    });

  }

  searchDocument(){
    
  
    let dialogRef = this.dialog.open(SearchDocumentComponent, {
      width : '650px',
      autoFocus : false,
      data : +this.data_consulta['numeroConsulta']
    });


    const filtro = {
      "numeroConsulta": this.data_consulta['numeroConsulta']
    }
    this.eventTracker.postEventTracker("opc65", JSON.stringify(filtro)).subscribe()
  }

  anularConsulta(){
    const filtro={
      "numeroConsulta": this.data_consulta['numeroConsulta']
    }
    
    this.eventTracker.postEventTracker("opc67", JSON.stringify(filtro)).subscribe()
  
    this.consultaMedService.anularConsulta( +this.data_consulta['numeroConsulta'] )
        .subscribe((response: any) => {
            if ( response.operacion == 200 && response.mensaje == 'Ok' ) {
              this.router.navigate(['medical-appointments']);                 
            }else{
            }        
        });
  }

  previewHistoria(){
   
  
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: 0,
      tipoDocumento: "hc_inicial"
    }
    const filtro ={
      "numeroConsulta" : this.data_consulta['numeroConsulta'],
      "tipoDocumento": "hc_inicial"
    }
    this.eventTracker.postEventTracker("opc63", JSON.stringify(filtro)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
    let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'hc_inicial',
          token:'123456'
    }
              
        if(response.status == 200){
    
            const firmado = response.body.data.estaFirmado;
    
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if(response && response.data){
                /*if(!firmado){
                  this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)
                }else{
                  const base64Response = await fetch( "data:application/pdf;base64,"+response.data.base64 )
                  const blob = await base64Response.blob();
            
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = response.data.nombre;
                  a.click()
                }*/
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              } else {
                const mensaje = {
                  title : 'Mensaje del sistema',
                  message: 'No existe Historia Clínica para esta consulta.',
                };
        
                this.dialog.open(AlertComponent, {
                    width: '400px', data: { alert: mensaje }
                });
              }
            })
    
        }else if(response.status == 204){
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if(response && response.data){              
                //this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)  
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              } else {
                const mensaje = {
                  title : 'Mensaje del sistema',
                  message: 'No existe Historia Clínica para esta consulta.',
                };
        
                this.dialog.open(AlertComponent, {
                    width: '400px', data: { alert: mensaje }
                });
              }                          
            })
          
            }else{
              const data = {
                title : 'Mensaje del sistema',
                message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
              }
    
          this.dialog.open(AlertComponent, { 
                  width: '400px', data: { alert: data } 
              });
            }      
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  previewEpisodio(){
    
   
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: 0,
      tipoDocumento: "episodio_actual"
    }
    const filtro ={
      "numeroConsulta":  this.data_consulta['numeroConsulta'],
      "tipoDocumento": "episodio_actual"
    }
    this.eventTracker.postEventTracker("opc62", JSON.stringify(filtro)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
    let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'episodio_actual',
          token:'123456'
    }
              
        if(response.status == 200){
    
            const firmado = response.body.data.estaFirmado;
    
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if(response){
                /*if(!firmado){
                  this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)
                }else{
                  const base64Response = await fetch( "data:application/pdf;base64,"+response.data.base64 )
                  const blob = await base64Response.blob();
            
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = response.data.nombre;
                  a.click()
                }*/
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              }
            })
    
        }else if(response.status == 204){
            this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if(response){              
                //this.showComponentPDF("data:application/pdf;base64,"+response.data.base64)  
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              }                           
            })
          
          }   else{
            const data = {
              title : 'Mensaje del sistema',
              message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
            }
  
          this.dialog.open(AlertComponent, { 
                width: '400px', data: { alert: data } 
            });
          }      
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  previewConstancia(){
    
  
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request:any = {
      ordenAtencion: 0,
      tipoDocumento: "constancia_atencion"
    }
    const filtro = {
      "numeroConsulta": this.data_consulta['numeroConsulta'],
      "tipoDocumento": "constancia_atencion"
    }
    this.eventTracker.postEventTracker("opc58", JSON.stringify(filtro)).subscribe()

    this.consultaMedService.validarArchivo( numeroConsulta, request).subscribe(
      (response)=>{
        if (response.status == 200) {

          if (response.body.data.estaFirmado) {
            this.obtenerConstancia(numeroConsulta)
          } else {
            let dialogRef = this.dialog.open(SignDocumentComponent, {
              width: '550px',
              autoFocus: false,
            });


            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.obtenerConstancia(numeroConsulta, result, true);
              }
            })
          }

        } else if (response.status == 204) {
          let dialogRef = this.dialog.open(SignDocumentComponent, {
            width: '550px',
            autoFocus: false,
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.obtenerConstancia(numeroConsulta, result, true);
            }
          })
        } else {
          const data = {
            title: 'Mensaje del sistema',
            message: 'Lo sentimos, en estos momentos no podemos generar el documento.',
          }

          this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
          });
        }
      },
      (error) => {
        console.log(error)
      }
    )


    /* let dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let request:any = {
          codigoMedico:+localStorage.getItem('codMedico'),
          ordenAtencion: 0,
          tipoDocumento: 'constancia_atencion',
          token: result
        }
        this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if ( response ) { 
                this.imprimir( response.data.base64, response.data.nombre)
              } else{
                const data = {
                  title : 'Mensaje del sistema',
                  message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
                }
      
                const dialogRef = this.dialog.open(AlertComponent, { 
                    width: '400px', data: { alert: data } 
                });
              }      
        });
      }
    }) */

  }

  obtenerConstancia( numeroConsulta:string, token:string = null, firma: boolean = null) {
    let request:any = {
      codigoMedico:+localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'constancia_atencion',
      token: token
    }

    this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
                if ( response ) { 
                  if (firma) {
                    const data = {
                      title: 'Éxito',
                      message:  `Se firmó el documento Constancia Médica exitosamente.`,
                      type: 4
                    };

                    const dialogRef = this.dialog.open(SuccessComponent, {
                      width: '400px', data: { alert: data }
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        printPdfBase64(response.data.base64);
                    });

                  } else {
                  printPdfBase64(response.data.base64);
                  }

              } else{
                const data = {
                  title : 'Mensaje del sistema',
                  message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
                };
      
                const dialogRef = this.dialog.open(AlertComponent, { 
                    width: '400px', data: { alert: data } 
                });
              }      
        });
  }

  imprimir( base64:string, nombre:string){
    let data="data:application/pdf;base64,"+base64;
                  this.pdfBase64 = data;
                  
    const pdf = document.getElementById('pdf1')
        
                  var winparams = 'resizable,width=850px,height=1050px';
                  var printWindow = window.open('', "PDF", winparams);
        
    printWindow.document.head.innerHTML = '<title>'+ nombre+'</title>';
                  printWindow.document.body.append(pdf)
                
    printWindow.document.getElementById('print1')
                  setTimeout(
                    ()=>printWindow.print(),
                    1500
                  )
                  printWindow.onbeforeunload = ()=>{
      document.getElementById('print1').append(pdf)
                  }
        
                  printWindow.onafterprint = ()=>{
                    printWindow.close()
                  }              
  } 

  showComponentPDF(src : any){
    let dialogRef = this.dialog.open(PdfViewerComponent, {
      id:'pdf-view-dialog',
      height: '95vh'
    });

    let instance = dialogRef.componentInstance;
    instance.src = src;
    instance.originalSize = false;
    instance.autoresize = true;
    instance.fitToPage = true;
    instance.renderText = true;
    instance.showAll = true;

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  buscarHistorial(e:any){
    //console.log(e.index)
    if (e.index == 1) {

      /* const request = {
        "pagina": "1",
        "tamanio": "100",
        "codigoAfiliado": "1126178",
        "codigoSede": "6",
        "fechaInicio": "2021-01-01",
        "fechaFin": "2021-10-01"
      }
  
      this.consultaMedService.buscarHistorial( request )
          .subscribe((response: any) => {
              if ( response.operacion == 200  ) {
                console.log(response)             
              }       
          }); */

    }
    
  }

  getDetalleConsultaMedica(numeroConsulta: string) {
    this.consultaMedService.getDetalleConsultaMedica(numeroConsulta)
      .subscribe((response: any) => {
        if (response && response.mensaje == 'OK' && response.operacion == 200 && response.data) {          
          this.data_consulta = response.data;
          this.showOdontogramButton = response.data.indicadorOdontogica === ODONTOGRAM_TYPE.TYPE ? true : false;
          localStorage.setItem('data_consulta',  JSON.stringify(this.data_consulta));
        }
      })
  }

  showFormMedicalRest(): void {
    
   
    const status = this.statusMedicalRest;
    const numeroConsulta = this.data_consulta['numeroConsulta'];
    const request: any = {
      codigoMedico: +localStorage.getItem('codMedico'),
      ordenAtencion: 0,
      tipoDocumento: 'descanso_medico',
      token: '123456'
    };

    this.eventTracker.postEventTracker("opc49", JSON.stringify(request)).subscribe()
    switch (status) {
      case 200:
        this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe( async (response: any) => {
              if (response && response.data) {
                await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              } else {
                const mensaje = {
                  title : 'Mensaje del sistema',
                  message : 'No existe Descanso Médico para esta consulta.',
                };
        
                this.dialog.open(AlertComponent, {
                    width: '400px', data: { alert: mensaje }
                });
              }
            });
        break;

      case 204:
        this.consultaMedService.generarArchivo(numeroConsulta, request)
            .subscribe((response: any) => {
              if (response && response.data) {
                downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
              } else {
                const mensaje = {
                  title : 'Mensaje del sistema',
                  message : 'No existe Descanso Médico para esta consulta.',
                };
        
                this.dialog.open(AlertComponent, {
                    width: '400px', data: { alert: mensaje }
                });
              }
            });
        break;

      default:
        const data = {
          title : 'Mensaje del sistema',
          message : 'Lo sentimos, en estos momentos no podemos generar el documento.',
        };

        this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: data }
        });
        break;
    }
  }

  validateMedicalRest(): any {
    const numeroConsulta = this.route.snapshot.paramMap.get('numeroConsulta');
    const request: any = {
      ordenAtencion: 0,
      tipoDocumento: 'descanso_medico'
    };

    this.consultaMedService.validarArchivo(numeroConsulta, request).subscribe(
      (response) => {
        this.statusMedicalRest = response.status;
        this.showButtonMedicalRest = response.status === 200 ? false : true;
        if (!this.showButtonMedicalRest) {
          const firmado = response.body.data.estaFirmado;
          this.signMedicalRest = firmado;
        }
      },
      error => {
        this.statusMedicalRest = error.status;
      }
    );

  }

  change(tab: any, index: any) {
    const historia = '<p><strong>✓&nbsp;</strong>Historia Clínica.</p>';
    const antecedentes = '<p><strong>✓&nbsp;</strong>Antecedentes.</p>';
    let mensaje = `<p>¿Desea permanecer en el formulario?</p><p>Existen datos sin guardar en el formulario:</p>`;
    if (this.hasChangeHistoria) {mensaje = mensaje + historia; }
    if (this.hasChangeAntecedentes) {mensaje = mensaje + antecedentes; }
    this.indexOld = this.index;
    this.index = index;
    const indexOldVal = this.indexOld && this.indexOld.index ? this.indexOld.index : 0;
    const indexVal = this.index && this.index.index ? this.index.index : 0;
    // if (indexOldVal === 2 && this.hasChange && confirm(mensaje)) {
    //   tab.selectedIndex = indexOldVal;
    // }
    if (indexOldVal === 2 && this.hasChange  ) {
      tab.selectedIndex = indexOldVal;
      this.openConfirm(mensaje).subscribe(data => {
        if (data) {
          tab.selectedIndex = indexOldVal;
        } else {
          this.hasChange = false ;
          tab.selectedIndex = indexVal;
        }
      });
    }
  }

  getMensajeHistoria(event) {
    this.hasChangeHistoria = event;
    this.validateConfirm();
  }
  getMensajeAntecedentes(event) {
    this.hasChangeAntecedentes = event;
    this.validateConfirm();
  }

  validateConfirm() {
    this.hasChange = this.hasChangeAntecedentes !== this.hasChangeHistoria
     ? true : this.hasChangeAntecedentes === true &&  this.hasChangeHistoria === true
     ? true : false;
  }

  openConfirm(msg: any) {
    const mensaje = {
      title: 'Mensaje del sistema',
      message: msg,
    };

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px', data: { alert: mensaje }
    });

    return dialogRef.afterClosed();
  }

  openOdontogramaInicial() {
    if (this.data_consulta['estado'] === ESTADOS.atendido) {
      const numeroConsulta = this.data_consulta['numeroConsulta'];
      let request:any = {
        codigoMedico:+localStorage.getItem('codMedico'),
        ordenAtencion: 0,
        tipoDocumento: 'odontograma_inicial',
        token: '123456'
      }
      this.consultaMedService.generarArchivo(numeroConsulta, request)
      .subscribe((response: any) => {
        if(response){
          downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf)
          }
      });
    } else {
    const url = window.location.href+`/odontograma-inicial`
    window.open(url, '_blank');
  }
  }

  openOdontogramaEvolutivo() {
    if (this.data_consulta['estado'] === ESTADOS.atendido) {
      const numeroConsulta = this.data_consulta['numeroConsulta'];
      let request:any = {
        codigoMedico:+localStorage.getItem('codMedico'),
        ordenAtencion: 0,
        tipoDocumento: 'odontograma_evolutivo',
        token: '123456'
        }
      this.consultaMedService.generarArchivo(numeroConsulta, request)
      .subscribe((response: any) => {
        if(response){
          downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf)
        }
      });
    } else {
    const url = window.location.href+`/odontograma-evolutivo`
    window.open(url, '_blank');
    }
  }

}
