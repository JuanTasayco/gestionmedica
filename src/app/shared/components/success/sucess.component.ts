import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { IAlerta } from '@shared/models/common/interfaces/alert.interface';

@Component({
  selector: 'mapfre-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.scss']
})

export class SuccessComponent implements OnInit {
  alert: IAlerta;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.alert = this.data.alert;
  }

}
