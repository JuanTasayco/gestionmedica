import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentoService } from '@shared/services/documento.service';
import { ModalMessageService } from '@shared/services/modal-message.service';

@Component({
  selector: 'mapfre-sign-document',
  templateUrl: './sign-document.component.html',
  styleUrls: ['./sign-document.component.scss']
})

export class SignDocumentComponent{
  codigo: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private documentoService: DocumentoService,
              private modalService: ModalMessageService,
              @Optional() private matDialogRef: MatDialogRef<SignDocumentComponent>) {}


  signDocument() {
    const signData = {IPBATCH: this.codigo, firmas: this.data.documents };
    this.documentoService.signDocument(signData)
      .subscribe(res => {
        if(res.status == 500){
          return this.modalService.alert(false, '', 'Error al firmar digitalmente el documento OTP no es el esperado');
        }
        this.matDialogRef.close();
        this.modalService.success(false, '', 'Exito');
      });
  }

}
