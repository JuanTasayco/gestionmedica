import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import { PATH_IP_SERVICE, PATH_SERVICE } from '@shared/helpers';

import { IListMaestroRequest } from '@shared/models/request/interfaces';
import { IListMaestroResponse } from '@shared/models/response/interfaces';

@Injectable({ providedIn: 'root' })
export class MaestroService {
  constructor(private dataService: DataService) { }

  getListMaestro(request: IListMaestroRequest): Observable<IListMaestroResponse> {
    const pathService = `${environment.urlService}${PATH_SERVICE[0]}`;
    this.dataService.set(pathService);

    return this.dataService.execGet(request).pipe();
  }
  getIpLocal() {
    const pathService = `${PATH_IP_SERVICE}`;
    this.dataService.set(pathService);

    return this.dataService.execGet().pipe();
  }
}
