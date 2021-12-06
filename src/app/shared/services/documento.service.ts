import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { DataService } from '@core/services';

import {PATH_SERVICE } from '@shared/helpers';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  cargarDocumentos(infoDocumento) {
    const pathService = environment.urlService  + PATH_SERVICE.documento + 'cargar';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(infoDocumento);
  }
  constructor(private dataService: DataService) { }
  getBandejaDocumentos(request: any) {
    const pathService = environment.urlService + PATH_SERVICE.documentosFiltro;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }
  getConsultaOA(nroConsulta) {
    const pathService = environment.urlService  + PATH_SERVICE.documento + 'consulta/' + nroConsulta;

    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }

  getBandejaHistoriaClinica(request) {
    const pathService = environment.urlService +  PATH_SERVICE.historiaClinicas;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }
  signDocument(request) {
    const pathService = environment.urlService + PATH_SERVICE.historiaClinicas + PATH_SERVICE.firmar;

    this.dataService.set(pathService);
    return this.dataService.execPostJsonAndStatus(request);
  }
  download(request) {
    const pathService = environment.urlService + PATH_SERVICE.documento + PATH_SERVICE.descarga;

    this.dataService.set(pathService);
    return this.dataService.execPostJsonAndStatus(request);
  }
  getDetalleDocumento(idDetalle) {
    const pathService = environment.urlService  +  PATH_SERVICE.documento +  idDetalle + PATH_SERVICE.detalle;

    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }
}
