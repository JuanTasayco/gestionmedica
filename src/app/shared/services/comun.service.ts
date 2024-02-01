import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import { PATH_SERVICE } from '@shared/helpers';

import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ComunService {
  constructor(private dataService: DataService) { }
  getComun(id, param1?, param2?, param3?, param4?){
    const pathService = environment.urlService + PATH_SERVICE.comun + id;

    let parameters = new HttpParams();
    parameters = parameters.append('tipo', param1 ? param1 : '');
    parameters = parameters.append('valor', param2 ? param2 : '');
    parameters = parameters.append('pagina', param3 ? param3 : '');
    parameters = parameters.append('tamanio', param4 ? param4 : '');

    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus(parameters);
  }
}
