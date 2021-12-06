import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ModalMessageComponent } from '@shared/components/modal-message/modal-message.component';
import { ALERT_MESSAGES, ALERT_TYPE } from '@shared/helpers';
@Injectable({ providedIn: 'root' })
export class ModalMessageService {
  constructor(
    private dialog: MatDialog,
    private router: Router) { }

  success(redirect, redirectTo, mensaje) {
    const dialogRef = this.dialog.open(ModalMessageComponent, {
      width: '400px', data: { success: {message: mensaje}}
    });
    if (redirect) {
      dialogRef.afterClosed().subscribe(_ => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate([redirectTo]));
      });
    }
  }
  alert(redirect, redirectTo, mensaje) {
    const alert = ALERT_MESSAGES.filter(obj => obj.type === ALERT_TYPE.custom)[0];
    alert.title = 'Alerta';
    alert.message = mensaje;
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
  });
    if (redirect) {
    dialogRef.afterClosed().subscribe(_ => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([redirectTo]));
    });
  }
  }
}
