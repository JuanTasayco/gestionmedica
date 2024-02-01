import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentoService } from '@shared/services/documento.service';
import { b64toBlob, downloadBase64, getEvoProfile, getProfile, printPdfBase64 } from '@shared/helpers/utils';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { ALERT_MESSAGES, COMMON_TYPES, CONTENT_TYPE, DEFAULT_FILENAME, HTTP_NO_CONTENT, ROLE_MEDIC } from '@shared/helpers';
import { MatDialog } from '@angular/material';
import { SignDocumentComponent } from '@pages/document-tray/modals/sign/sign-document.component';
import { IDetalleResult } from '@shared/models/common/interfaces';
import { UsuarioService } from '@shared/services/usuario.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})

export class DocumentDetailComponent implements OnInit {
  formGroupSearchDocuments: FormGroup;

  disableButton: boolean;
  isFilterVisible: boolean;
  isVisible = false; // false
  dataDetalle: IDetalleResult;
  tipoModulo: string;
  src: any;
  numeroConsulta: string;
  codigoItem: string;
  compania: string;
  numeroItem: string;
  isMedico: boolean;
  codMedico: number;
  pdfDetalle: string;
  filtrosTracker:any={};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private modalService: ModalMessageService,
    private documentoService: DocumentoService,
    private eventTracker: EventTrackerService) {
  }

  ngOnInit() {
   this.route.params.subscribe(params => {
     this.tipoModulo = params.tipoModulo;
     this.numeroConsulta = params.numeroConsulta;
     this.codigoItem = params.codigoItem;
     this.compania = params.compania;
     this.numeroItem = params.numeroItem;
     this.checkRoles();
     this.getDetalle(this.compania, this.numeroConsulta, this.codigoItem, this.numeroItem);
     this.bindFiltersTracker();
    });
  }
  return() {
    this.router.navigate([this.tipoModulo]);
  }
  downloadFile(base64, operation) {
   
    const detalleFiltros= {...this.dataDetalle};
    detalleFiltros.documentoBase64 = "";
    if(operation === 'P') {
      //buscar por url
      if(this.tipoModulo=="historial-documentos"){
        this.eventTracker.postEventTracker("opc7",  JSON.stringify({detalleFiltros, ...this.filtrosTracker})).subscribe()
      }
      if(this.tipoModulo=="bandeja-historias"){
        this.eventTracker.postEventTracker("opc12",  JSON.stringify({detalleFiltros, ...this.filtrosTracker})).subscribe()
      }
     
      printPdfBase64(base64);
    }
    if (operation === 'D') {
      if(this.tipoModulo=="historial-documentos"){
        this.eventTracker.postEventTracker("opc8", JSON.stringify({detalleFiltros, ...this.filtrosTracker})).subscribe()
      }
      if(this.tipoModulo=="bandeja-historias"){
        this.eventTracker.postEventTracker("opc13",  JSON.stringify({detalleFiltros, ...this.filtrosTracker})).subscribe()
      }
      downloadBase64(base64, DEFAULT_FILENAME, CONTENT_TYPE.pdf);
    }
  }

  signDocument() {
    const detalleFiltros= {...this.dataDetalle};
    detalleFiltros.documentoBase64 = "";
    this.eventTracker.postEventTracker("opc6", JSON.stringify({detalleFiltros, ...this.filtrosTracker})).subscribe()
    if(!this.isMedico){
      return this.modalService.alert(false, '',ALERT_MESSAGES[11].message);
    }
    const sendData = [];
    sendData.push({numeroConsulta: this.numeroConsulta, codigoItem:this.codigoItem});
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { codMedico: this.codMedico, send: true, documents: sendData }, panelClass: 'upload'
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result.reload){
        this.getDetalle(this.compania, this.numeroConsulta, this.codigoItem, this.numeroItem);
      }
    });
  }

  checkRoles(){ 
    this.isMedico = false;
    if(getEvoProfile() == null){return;}
    getEvoProfile().rolesCode.forEach(element => {
        if(element.codigoRol == ROLE_MEDIC){
          this.isMedico = true;
        }
    });
    if(this.isMedico){
      this.usuarioService.getMedicoByUser(getProfile().username).subscribe((response) => { 
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.medico);
        }   
          this.codMedico = response.body.data.codMedico;
      });
    }
  }
   
  getDetalle(compania: string, numeroConsulta: string, codigoItem: string, numeroItem: string) {
    const idDetalle = compania + '_' + numeroConsulta + '_' + codigoItem + '_' + numeroItem;
    this.documentoService.getDetalleDocumento(idDetalle)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[0].message);
        }else {
          this.dataDetalle = response.body.data;
          this.pdfDetalle =  URL.createObjectURL(b64toBlob(this.dataDetalle.documentoBase64,CONTENT_TYPE.pdf));
        }        
      });
  }

  bindFiltersTracker() {
    var filtros ={
      "tipoModulo": this.tipoModulo,
      "numeroConsulta": this.numeroConsulta,
      "codigoItem": this.codigoItem,
      "compania": this.compania,
      "numeroItem": this.numeroItem
    }
    this.filtrosTracker = filtros;
  }
}




