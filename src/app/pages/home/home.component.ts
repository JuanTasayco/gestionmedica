import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';

import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE, getEvoProfile, getOptions, MODULES, PATH_URL_DATA, ROLE_ADMIN, ROLE_ADMISIONISTA, ROLE_MEDIC, ROLE_PERSADMINIS, searchElementInArray } from '@shared/helpers';

import { IGetModulesResponse } from '@shared/models/response/interfaces';

import { AuthenticationService } from '@shared/services/authentication.service';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { ModalMessageService } from '@shared/services/modal-message.service';

@Component({
  selector: 'mapfre-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  hasUploadHistory: boolean = false;
  hasHistoryTray: boolean = false;
  hasListDocumentTray: boolean = false;
  profile: any;
  usuario = '';
  opciones = [];
  constructor(private router: Router,
              private modalService: ModalMessageService,
              private authService: AuthenticationService,
              private consultaMedService : ConsultaMedicaService,
              private dialog: MatDialog,
              private eventTrackerService: EventTrackerService) {
                this.profile = JSON.parse(localStorage.getItem('evoProfile'));
                this.usuario = JSON.parse(localStorage.getItem('profile')).username;
              }

  ngOnInit() {
    this.authService.getVersion().subscribe(p => console.log("version", p))
    this.eventTrackerService.setTracker();

    this.checkRoles();
    if(this.isMedic(this.profile)){
      this.getCodUsuario();
    }

    console.log("Version V2023-06-27 13:00");
    console.log("Pase V2023-08-04 09:00");
    console.log("Pase historial V2023-08-29 17:00");
    console.log("Pase 00425656 V2024-02-05 15:00");
  }

  checkRoles(){
    if(getEvoProfile() == null){
      return this.modalService.alert(false, '',ALERT_MESSAGES[12].message);
        }
    getEvoProfile().rolesCode.forEach(element => {
        if(element.codigoRol == ROLE_MEDIC || element.codigoRol == ROLE_ADMIN){
          this.hasUploadHistory = true;
          this.hasHistoryTray = true;
          this.hasListDocumentTray = true;
      }
        if(element.codigoRol == ROLE_ADMISIONISTA){
          this.hasHistoryTray = true;
    }
        if(element.codigoRol == ROLE_PERSADMINIS){
          this.hasUploadHistory = true;
        }
    });
    this.authService.getRol().subscribe((response) => {
      localStorage.setItem('opciones', JSON.stringify(response.body.data));
      this.opciones = getOptions();

    });

  }
  openView(id) {
    switch(id){
      case 3: this.router.navigate([PATH_URL_DATA.urlMedicalAppointments ]) ; break;
      case 2: this.router.navigate([PATH_URL_DATA.urlMaintenance ]) ; break;
      case 0: this.router.navigate([PATH_URL_DATA.urlDefault]) ; break;
      case 5: this.router.navigate([PATH_URL_DATA.urlHistorialDocumento ]) ; break;
      case 1: this.router.navigate([PATH_URL_DATA.urlBandejaHistorias ]) ; break;
      case 20: this.router.navigate([PATH_URL_DATA.urlBandejaDocumento ]) ; break;
      case 60: this.router.navigate([PATH_URL_DATA.urlInformesProcServ ]) ; break;
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

  isNurse(profile: any){
    const rolesCode = (profile.rolesCode as Array<any>).find( r => r.nombreAplicacion === 'GESMED');
    if (rolesCode.codigoRol === 'ENFERMERO') {
      return true;
    }
    return false;
  }

  isMedic(profile:any){
    let rolesCode =(profile.rolesCode as Array<any>).find( r=> r.nombreAplicacion =='GESMED')
    if(rolesCode.codigoRol == 'MEDICO'){
      return true
    }
    return false;
 }

 getCodUsuario(){
  this.consultaMedService.getCodUsuario(this.usuario)
  .subscribe((response: any) => {
      localStorage.setItem('codMedico', response.data.codigo);
  });
}

searchElement(element, array){
  return  searchElementInArray(element, array);
}

}
