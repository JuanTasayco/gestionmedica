import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sign-document',
  templateUrl: './sign-document.component.html',
  styleUrls: ['./sign-document.component.scss']
})

export class SignDocumentComponent implements OnInit {
  codigo : string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialogRef: MatDialogRef<SignDocumentComponent>) { }

  ngOnInit() {
    
  }

  sendDocument() {
    this.matDialogRef.close(this.codigo);
  }

}
