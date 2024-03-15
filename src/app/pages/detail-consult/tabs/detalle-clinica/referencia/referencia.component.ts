import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertComponent } from '@shared/components/alert/alert.component';

import { CONTENT_TYPE, downloadBase64, downloadBase64Async } from '@shared/helpers';

import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';

@Component({
  selector: 'detalle-clinica-referencia',
  templateUrl: './referencia.component.html',
  styleUrls: ['./referencia.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ReferenciaComponent implements OnInit {
  @Input() hasDatosReferencia: boolean;
  @Input() datosConsulta: any;
  @Input() datosReferencia: any;

  @Output() close = new EventEmitter();
  @Output() saveReferencia = new EventEmitter();

  currentStep: number = 1;

  completeSteps: boolean = false;

  data: any = {};
  sede: any = {};
  paciente: any = {};
  otrosDatos: any;

  constructor(private consultaMedicaService: ConsultaMedicaService, private dialog: MatDialog) {}
  
  ngOnInit() {
    if(this.datosConsulta) {
      this.sede = {
        value: this.datosConsulta.CODPRESTADORA,
        text: this.datosConsulta.sede
      }

      this.consultaMedicaService.getOtrosDatosReferencia(this.datosConsulta.numeroConsulta)
      .subscribe((response) => {
        if(response && response.operacion == 200) {
          this.otrosDatos = response.data;

          this.paciente = {
            idAfiliado: this.datosConsulta.codigoAfiliado,
            centroOrigen: this.datosConsulta.codigoSede,
            numContrato: this.otrosDatos.contrato,
            tipoOrigen: this.otrosDatos.tipoOrigen
          }
        }
      });
    }
  }

  closeNewReference() {
    this.close.emit();
  }

  enviarReferencia() {
    const request = this.generateSaveReferenciaObject(this.data);
    const data = this.generateDataReferencia(request);
    const diagnostico = {code: this.data[1].diagnosticoIngreso, value: this.data[1].nomDiagnosticoIngreso};
    
    this.saveReferencia.emit({request: request, data: data, diagnostico: diagnostico});
  }

  saveStep(event: any, step: number) {
    if(step >= this.currentStep) this.currentStep = step + 1;
    this.data[step] = event.data;
    this.completeSteps = step === 3;
  }

  generateSaveReferenciaObject(data: any) {
    let refsCrear = {
      CTipOrigAseg: '',
      CAsegurado: '',
      TNdoc: '',
      Ndoc: '',
      CProveedorOrigen: '',
      CProveedorDestino: '',
      ListaRequerimientos: [],
      CodCompania: '',
      CTReferencia: '',
      CProducto: '',
      NomRspnsble: '',
      TelRspnsble: '',
      MailRspnsble: '',
      CCondicionIngr: '',
      CDiagnosticoIngr: '',
      CProvMeTraslado: '',
      CTipMeTraslado: '',
      CMeTraslado: '',
      NumAutorizacion: '',
      NumContrato: '',
      Observacion: '',
      OtroRqmnto: '',
      ResumenHistClinica: '',
      FRefeForzada: false
    };

    if (this.paciente) refsCrear.CAsegurado = this.paciente.idAfiliado;

    if (data) {
      if (data[1].proveedorOrigen) refsCrear.CProveedorOrigen = data[1].proveedorOrigen;
      if (data[1].tipoReferencia) refsCrear.CTReferencia = data[1].tipoReferencia;
      if (data[1].condicionPaciente) refsCrear.CCondicionIngr = data[1].condicionPaciente;
      if (data[1].diagnosticoIngreso) refsCrear.CDiagnosticoIngr = data[1].diagnosticoIngreso;

      refsCrear.FRefeForzada = data[2].forceDestino;
      if (data[2].listChecked) refsCrear.ListaRequerimientos = data[2].listChecked;
      if (data[2].medioTraslado) refsCrear.CMeTraslado = data[2].medioTraslado;
      if (data[2].tipoTraslado) refsCrear.CTipMeTraslado = data[2].tipoTraslado;
      if (data[2].proveedorTraslado) refsCrear.CProvMeTraslado = data[2].proveedorTraslado;
      if (data[2].idProveedor) refsCrear.CProveedorDestino = data[2].idProveedor;

      if (data[3].observaciones) refsCrear.Observacion = data[3].observaciones;
      if (data[3].otros) refsCrear.OtroRqmnto = data[3].otros;
      if (data[3].resumen) refsCrear.ResumenHistClinica = data[3].resumen;
    }

    if (this.otrosDatos) {
      refsCrear.NomRspnsble = this.otrosDatos.nombreResponsable;
      refsCrear.TelRspnsble = this.otrosDatos.telefonoResponsable;
      refsCrear.MailRspnsble = this.otrosDatos.correoResponsable;
      refsCrear.CTipOrigAseg = this.otrosDatos.tipoOrigen;
      refsCrear.TNdoc = this.otrosDatos.tipoDocResponable;
      refsCrear.Ndoc = this.otrosDatos.numDocResponsable;
      refsCrear.CodCompania = this.otrosDatos.compania;
      refsCrear.CProducto = this.otrosDatos.producto;
      refsCrear.NumContrato = this.otrosDatos.contrato;
    }

    return refsCrear;
  }

  getRequerimientosDestino(data: any) {
    let requerimientos = [];
    if(data) {
      data.forEach(element => {
        requerimientos.push(element.nombreRequerimiento);
      });
    }

    return requerimientos.join(', ');
  }

  getNombrePaciente(data: any) {
    const nombre = data && data.nombre ? data.nombre : '';
    const apellidoP = data && data.apellidoP ? data.apellidoP : '';
    const apellidoM = data && data.apellidoM ? data.apellidoM : '';
    const paciente = nombre + ' ' + apellidoP  + ' ' + apellidoM;
    return paciente.trim() !== '' ? paciente : this.datosConsulta.nombrePaciente;
  }

  descargarPdf(event: any) {
    event.stopPropagation();
    
    const numeroConsulta = this.datosConsulta['numeroConsulta'];

    const requestValidar: any = {
      ordenAtencion: 0,
      tipoDocumento: 'REFERENCIA'
    };
    
    let requestGenerar: any = {
      codigoMedico: 0,
      ordenAtencion: 0,
      tipoDocumento: 'REFERENCIA',
      token: '123456'
    };
    
    this.consultaMedicaService.validarArchivo(numeroConsulta, requestValidar).subscribe((response: any) => {
      if(response.status == 200){
        this.consultaMedicaService.generarArchivo(numeroConsulta, requestGenerar)
        .subscribe(async (response: any) => {
          if(response){
            await downloadBase64Async(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
          }
        })
      } else if(response.status == 204){
          this.consultaMedicaService.generarArchivo(numeroConsulta, requestGenerar)
          .subscribe((response: any) => {
            if(response){              
              downloadBase64(response.data.base64, response.data.nombre, CONTENT_TYPE.pdf);
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
    (error: any)=>{
      console.log(error)
    });
  }

  generateDataReferencia(data: any) {
    let idRequerimientos = [];

    data.ListaRequerimientos.forEach((item: any) => {
      idRequerimientos.push(item.idRequerimiento);
    });

    const request = {
      establecimientoOrigen: data.CProveedorOrigen,
      establecimientoDestino: data.CProveedorDestino,
      codigoProcedimiento: idRequerimientos.length > 0 ? idRequerimientos[0] : 0,
      codigoSede: data.CProveedorOrigen,
      codigoUpsDestino: data.CTReferencia,
      codigoEspecialidadDestino: idRequerimientos.length > 0 ? idRequerimientos[0] : 0,
      codigoCondicionInicial: data.CCondicionIngr,
      observaciones: data.Observacion
    };

    return request;
  }
}