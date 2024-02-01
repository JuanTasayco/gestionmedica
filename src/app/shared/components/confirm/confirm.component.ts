import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAlerta } from '@shared/models/common/interfaces/alert.interface';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {
  alert: IAlerta;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialogRef: MatDialogRef<ConfirmComponent>) { }
  
              ngOnInit() {
                this.alert = this.data.alert;
              }

  confirmOk() {
    this.matDialogRef.close(true);
  }

}
