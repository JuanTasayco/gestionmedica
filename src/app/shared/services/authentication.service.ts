import { Injectable } from '@angular/core';
import { DataService } from '@core/services/data.service';
import { environment } from '@environments/environment';
import { PATH_SERVICE } from '@shared/helpers';
import { IGetModulesResponse } from '@shared/models/response/interfaces';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private dataService: DataService) { }

  logout() {
    const pathService = `${environment.oimApiPath}${environment.logoutPath}`;
    this.dataService.set(pathService);

    return this.dataService.execPostJson().pipe();
  }

  getModules() : Observable<IGetModulesResponse>  {
    const pathService = `${environment.urlService}${PATH_SERVICE[37]}`;
    this.dataService.set(pathService);

    return this.dataService.execGetJson().pipe();
  }
  getRol(){
    const pathService = environment.urlService + PATH_SERVICE.rol;
    
    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }

  getVersion() : Observable<any>  {
    const pathService = environment.urlVersion + "version";
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }
}
