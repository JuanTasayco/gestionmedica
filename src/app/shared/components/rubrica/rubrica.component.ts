import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'mapfre-rubrica',
  templateUrl: './rubrica.component.html',
  styleUrls: ['./rubrica.component.scss']
})

export class RubricaComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


}
