import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentoService } from '@shared/services/documento.service';
import { ModalMessageService } from '@shared/services/modal-message.service';

@Component({
  selector: 'mapfre-sign-document',
  templateUrl: './sign-document.component.html',
  styleUrls: ['./sign-document.component.scss']
})

export class SignDocumentComponent implements OnInit {
  formGroupSignDocument: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              @Optional() private matDialogRef: MatDialogRef<SignDocumentComponent>) {}

  public ngOnInit(): void {
    this.setValuesFormBuilder();
  }

  keypressNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  setValuesFormBuilder() {
    this.formGroupSignDocument = this.fb.group({
      token: new FormControl('', 
      Validators.compose(
          [Validators.minLength(6), Validators.maxLength(6),Validators.required, Validators.pattern(/^[0-9]\d*$/)]))
      });
  }

  sendDocument() {
    this.matDialogRef.close(this.formGroupSignDocument.get('token').value);
  }

}
