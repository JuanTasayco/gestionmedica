import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';

import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE } from '@shared/helpers';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if(err.status == 401 || err.status == 403) window.location.href = environment.oimHome + 'login';
            else this.openModalError();
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    // Mostrar modal de alerta
    openModalError() {
        let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
        alert.title = 'Alerta';
        alert.message = 'Hubo un problema al ejecutar su operación.';
    
        const dialogRef = this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: alert } 
        });
    }
}
