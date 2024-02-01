import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import {PATH_SERVICE } from '@shared/helpers';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  constructor(private dataService: DataService) { }
  getSedesByMedico(idMedico) {
    const pathService = environment.urlService + PATH_SERVICE.medico +  idMedico + PATH_SERVICE.sedes;

    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }
  getEspecialidadByMedico(idMedico, idSede) {
    const pathService = environment.urlService + PATH_SERVICE.medico + idMedico + PATH_SERVICE.sede + idSede + PATH_SERVICE.especialidades

    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }
}
