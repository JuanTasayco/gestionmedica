import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import { PATH_IP_SERVICE, PATH_SERVICE } from '@shared/helpers';

import { IListMaestroRequest } from '@shared/models/request/interfaces';


@Injectable({ providedIn: 'root' })
export class MaestroService {
  constructor(private dataService: DataService) { }

  getIpLocal() {
    const pathService = `${PATH_IP_SERVICE}`;
    this.dataService.set(pathService);

    return this.dataService.execGet().pipe();
  }
}
