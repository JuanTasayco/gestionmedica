import { Component, OnInit, Inject, Optional, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ALERT_MESSAGES, HTTP_ACCEPTED, HTTP_CREATED, HTTP_METHOD_NOT_ALLOWED } from '@shared/helpers';
import { DocumentoService } from '@shared/services/documento.service';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'mapfre-sign-document',
  templateUrl: './sign-document.component.html',
  styleUrls: ['./sign-document.component.scss']
})

export class SignDocumentComponent implements OnInit {
  codigo: string;
  formGroupSignDocument: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    private documentoService: DocumentoService,
    private modalService: ModalMessageService,
    private fb: FormBuilder,
    @Optional() private matDialogRef: MatDialogRef<SignDocumentComponent>) { }

  public ngOnInit(): void {
    this.setValuesFormBuilder();
  }

  setValuesFormBuilder() {
    this.formGroupSignDocument = this.fb.group({
      codigo: new FormControl('', 
      Validators.compose(
          [Validators.minLength(6), Validators.maxLength(6),Validators.required, Validators.pattern(/^[0-9]\d*$/)]))
    });
  }

  closeDialog(){
    this.matDialogRef.close({reload: false});
  }
  signDocument() {
    if(!this.formGroupSignDocument.valid){
      return this.modalService.alert(false, '',ALERT_MESSAGES[10].message);
    }
    const signData = { codMedico: this.data.codMedico, IPBATCH: this.formGroupSignDocument.get('codigo').value, firmas: this.data.documents };

    this.documentoService.signDocument(signData)
      .subscribe(res => {
        if(res.status == HTTP_METHOD_NOT_ALLOWED){
          return this.modalService.alert(false, '',ALERT_MESSAGES[13].message);
        } 
        this.modalService.success(false, '', res.body.mensaje);          
        this.matDialogRef.close({reload: true});
      });
  }
}
