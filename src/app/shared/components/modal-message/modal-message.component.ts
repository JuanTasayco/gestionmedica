import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'mapfre-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss']
})

export class ModalMessageComponent implements OnInit {
  success: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private modalRef: MatDialogRef<ModalMessageComponent>) { }

  ngOnInit() {
    this.success = this.data.success;
  }
  redirect() {
    this.modalRef.close();
  }
}
