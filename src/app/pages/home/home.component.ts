import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';

import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE, MODULES, PATH_URL_DATA } from '@shared/helpers';

import { IGetModulesResponse } from '@shared/models/response/interfaces';

import { AuthenticationService } from '@shared/services/authentication.service';

@Component({
  selector: 'mapfre-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  hasMedicalRequest: boolean = false;
  hasInsured: boolean = false;
  hasProgram: boolean = false;

  constructor(private router: Router, private authService: AuthenticationService, private dialog: MatDialog) {}

  ngOnInit() {
    this.hasProgram = true;
    this.hasInsured = true;
    this.hasMedicalRequest = true;
    //this.validateRole();
  }

  // Validar acceso a modulos
  validateRole() {
    this.authService.getModules().subscribe((response: IGetModulesResponse) => {
      if(response.codRpta == 200) {
        const { data } = response;
        if (data.length != 0) {
          data.forEach(module => {
            switch(module.nomCorto) {
              case MODULES.programas:
                this.hasProgram = true;
                break;
              case  MODULES.asegurados:
                this.hasInsured = true;
                break;
              case MODULES.solicitudes:
              case MODULES.auditoria:
                this.hasMedicalRequest = true;
                break;  
            }
          });
        } else {
          this.openModalAccessError();
        }
      } else {
        this.openModalAccessError();
      }
    });

    
  }

  openView(id) {
    switch(id){
      case 0: this.router.navigate([PATH_URL_DATA.urlDefault]) ; break;
      case 5: this.router.navigate([PATH_URL_DATA.urlHistorialDocumento ]) ; break; 
      case 1: this.router.navigate([PATH_URL_DATA.urlBandejaHistorias ]) ; break; 
      case 20: this.router.navigate([PATH_URL_DATA.urlBandejaDocumento ]) ; break; 
    }
  }

  // Mostrar modal de alerta en caso no tenga acceso a modulos
  openModalAccessError() {
    let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];

    alert.title = 'Alerta';
    alert.message = ALERT_MESSAGES[4].message;
    
    const dialogRef = this.dialog.open(AlertComponent, { 
      width: '400px', data: { alert: alert } 
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.href = environment.oimHome;
    });
  }

}
