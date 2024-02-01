import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import {COMMON_TYPES, PATH_SERVICE } from '@shared/helpers';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IVersionOdontogramaRequest } from '@shared/models/request/interfaces';


@Injectable({ providedIn: 'root' })
export class OdontogramaService {
  private data: any;
  errorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private dataService: DataService) { }

  getBandejaConsultasMedicas(request: any) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedica;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  cargarListaDiagnosticos(valor : string , pagina : string, tamanio : string, tipo : string) {
    // const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaDiagnosticoOdontologico;
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaDiagnosticoOdontologico;
    let parameters = new HttpParams();
    parameters = parameters.append('valor', valor);
    parameters = parameters.append('pagina', pagina );
    parameters = parameters.append('tamanio', tamanio );
    parameters = parameters.append('tipo', tipo );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(map((m : any)=> {
      const data = m.data;
      data.map(element => {
        element.checked = false;
      });
      return data;
    }), shareReplay(1));
  }

  cargarListaHallazgos(valor : string , pagina : string, tamanio : string, tipo : string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaHallazgoOdontologico;
    let parameters = new HttpParams();
    parameters = parameters.append('valor', valor);
    parameters = parameters.append('pagina', pagina );
    parameters = parameters.append('tamanio', tamanio );
    parameters = parameters.append('tipo', tipo );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(map((m : any)=> {
      const data = m.data;
      data.map(element => {
        const arr = element.descripcion.split('|')
        element.checked = false;
        element.descripcion = arr[0];
        element.tipoSigla = arr[1];
      });
      return data;
    }), shareReplay(1));
  }

  cargarListaProcedimientos(valor : string , pagina : string, tamanio : string, tipo : string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaProcedimientoOdontologico;
    let parameters = new HttpParams();
    parameters = parameters.append('valor', valor);
    parameters = parameters.append('pagina', pagina );
    parameters = parameters.append('tamanio', tamanio );
    parameters = parameters.append('tipo', tipo );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(map((m : any)=> {
      if(m && m.operacion === 200) {
        const data = m.data;
        data.map(element => {
          element.checked = false;
        });
        return data;
      } else {
        return [];
      }
    }), shareReplay(1));
  }

  cargarSiglas(valor : string, tipo : string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaSiglas;
    let parameters = new HttpParams();
    parameters = parameters.append('valor', valor);
    // parameters = parameters.append('pagina', pagina );
    // parameters = parameters.append('tamanio', tamanio );
    parameters = parameters.append('tipo', tipo );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(map((m : any)=> {
      const data = m.data;
      data.map(element => {
        element.checked = false;
      });
      return data;
    }), shareReplay(1));
  }

  versionOdontograma(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/version';
    let parameters = new HttpParams();
    parameters = parameters.append('codigoSede', version.codigoSede);
    parameters = parameters.append('numeroHistoria', version.numeroHistoria );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(shareReplay(1));
  }

  getDataByVersionOdontogram(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/detalle';
    let parameters = new HttpParams();
    parameters = parameters.append('numeroItem', version.numeroItem);
    parameters = parameters.append('numeroVersion', version.numeroVersion);
    parameters = parameters.append('numeroHistoria', version.numeroHistoria );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(shareReplay(1));
  }

  /**
   *
   */
  getDataBoxesByVersionOdontogram(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma;
    let parameters = new HttpParams();
    parameters = parameters.append('codigoSede', version.codigoSede);
    parameters = parameters.append('numeroVersion', version.numeroVersion);
    parameters = parameters.append('numeroHistoria', version.numeroHistoria );

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(shareReplay(1));
  }

  getProcedureServicesOdontogram(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/procedimientos/' + version.codigoProcedimiento;
    let parameters = new HttpParams();
    parameters = parameters.append('numeroHistoria', version.numeroHistoria);

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(shareReplay(1));
  }

  deleteProcedureOdontogram(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/procedimientos/' + version.codigoProcedimiento;
    let parameters = new HttpParams();
    parameters = parameters.append('codigoDiagnostico', version.codigoDiagnostico);
    parameters = parameters.append('numeroMovimiento', version.numeroMovimiento);

    this.dataService.set(pathService);
    return this.dataService.execDelete(parameters).pipe(shareReplay(1));
  }

  saveOdontogram(version: IVersionOdontogramaRequest, request) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma'

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request).pipe(shareReplay(1));
  }

  createProcedure(version: IVersionOdontogramaRequest, request) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/procedimientos'

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request).pipe(shareReplay(1));
  }

  saveAdditionalData(version: IVersionOdontogramaRequest, request) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.consultaMedicaId + '/odontograma/' + version.tipoOdontograma + '/datosAdicionales'

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  setData(data: any) {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

  getBaseToPrintOdontograma(version: IVersionOdontogramaRequest) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedicaUdontograma + version.numeroConsulta + '/odontograma/' + version.tipoOdontograma + '/obtieneFormato';
    let parameters = new HttpParams();
    parameters = parameters.append('codigoSede', version.codigoSede);
    parameters = parameters.append('numeroHistoria', version.numeroHistoria );
    parameters = parameters.append('numeroVersion', version.numeroVersion);
    parameters = parameters.append('numeroConsulta', version.numeroConsulta);

    this.dataService.set(pathService);
    return this.dataService.execGet(parameters).pipe(shareReplay(1));
  }

}
