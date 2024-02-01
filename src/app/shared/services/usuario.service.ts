import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import {PATH_SERVICE } from '@shared/helpers';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private dataService: DataService) { }
  getMedicoByUser(idUsuario) {
    const pathService = environment.urlService + PATH_SERVICE.usuario +  idUsuario;

    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }
}
