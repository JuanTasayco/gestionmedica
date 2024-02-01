import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';

import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE, PATH_URL_DATA } from '@shared/helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private consultaMedicaService: ConsultaMedicaService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err);
            this.consultaMedicaService.errorSubjectObsData = err;
            if(err.status == 401 || err.status == 403) window.location.href = environment.oimHome + 'login';
            if(err.status == 404 && this.getRoute() == PATH_URL_DATA.urlMedicalAppointmentsDetail) {
                console.warn('Se ingresó como Administrador a esta sección');
                const error = err.error.message || err.statusText;
                return throwError(error);
            };
            // if(err.status == 412) this.openModalError(err.error.mensaje);
            // else this.openModalError();
            const msg = err.error.mensaje || err.statusText;
            const url = err.error.mensaje || err.url;
            this.openModalError(`${msg} <br> servicio: ${url}`);
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    // Mostrar modal de alerta
    openModalError( message:string = null) {
        let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
        alert.title = 'Alerta';
        alert.message = message ? message : 'Hubo un problema al ejecutar su operacixF3n.';

        const dialogRef = this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: alert }
        });
    }


    getRoute(){
        let urlTree = this.activatedRoute.firstChild.routeConfig.path;
        return urlTree.toString();
    }
}
