import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import { PATH_SERVICE_REFERENCIA } from '@shared/helpers';

@Injectable({ providedIn: 'root' })
export class ReferenciaService {

  constructor(private dataService: DataService) { }

  getFiltros(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.filtros;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  filterProveedor(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.filtrarProveedor;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  searchProveedores(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.buscarProveedores;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  detalleProveedor(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.detalleProveedor;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  nuevaReferencia(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.nuevaReferencia;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  detalleReferencia(request: any) {
    const pathService = environment.oimReferencia + PATH_SERVICE_REFERENCIA.detalleReferencia;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }
}
