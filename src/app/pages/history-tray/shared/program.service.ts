import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from '@core/services';

import { environment } from '@environments/environment';

import { PATH_SERVICE } from '@shared/helpers';

import { ISearchProgramRequest, ISaveProgramRequest, ISaveDiagnosticsRequest, ISaveCoverageRequest, 
  IUploadFileProgramRequest, IDeleteFileProgramRequest, IInactivateProgramRequest, IFilterClientRequest } from '@shared/models/request/interfaces';
import { ISearchProgramResponse, ISaveProgramResponse, ISaveCoveragesResponse, ISaveDiagnosticsResponse, 
  IDetailProgramResponse, IUpdateProgramResponse, IUploadFileProgramResponse, IDeleteFileProgramResponse,
  IActivateProgramResponse, IInactivateProgramResponse, IFilterClientResponse, IValidateNameProgramResponse} from '@shared/models/response/interfaces';

@Injectable({ providedIn: 'root' })

export class ProgramDataService {
  
  constructor(private dataService: DataService) { }

  // Filtar programas
  searchPrograms(request: ISearchProgramRequest) : Observable<ISearchProgramResponse> {
    const pathService = `${environment.urlService}${PATH_SERVICE[1]}`;
    this.dataService.set(pathService);

    return this.dataService.execGet(request).pipe();
  }

  // Descargar ficha de programa
  downloadProgramFile(codProgram: string, user: string, ip: string, module: string, action: string) : any {
    var pathService = `${environment.urlService}${PATH_SERVICE[7]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    pathService = pathService.replace('{usuario}', user);
    pathService = pathService.replace('{ip}', ip);
    pathService = pathService.replace('{modulo}', module);
    pathService = pathService.replace('{accion}', action);
    this.dataService.set(pathService);

    return this.dataService.execGetOctet().pipe();
  }

  // Guardar informacion de cabecera de un programa (nuevo)
  saveProgram(request: ISaveProgramRequest) : Observable<ISaveProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[2]}`;
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters).pipe();
  }

  // Guardar informacion de coberturas de un programa
  saveCoverages(codProgram: string, request: ISaveCoverageRequest) : Observable<ISaveCoveragesResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[4]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Guardar informacion de diagnostico de un programa
  saveDiagnostics(codProgram: string, request: ISaveDiagnosticsRequest) : Observable<ISaveDiagnosticsResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[5]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }
  
  // Obtener el detalle de un programa
  detailProgram(codProgram: string) : Observable<IDetailProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[3]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    this.dataService.set(pathService);

    return this.dataService.execGet().pipe();
  }

  // Actualizar cabecera de un programa
  updateProgram(codProgram: string, request: ISaveProgramRequest) : Observable<IUpdateProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[3]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Descargar archivo de un programa
  downloadFile(codProgram: string, codDocument: string, user: string, ip: string, 
    module: string, action: string) : any {
    var pathService = `${environment.urlService}${PATH_SERVICE[6]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    pathService = pathService.replace('{idDocumento}', codDocument);
    pathService = pathService.replace('{usuario}', user);
    pathService = pathService.replace('{ip}', ip);
    pathService = pathService.replace('{modulo}', module);
    pathService = pathService.replace('{accion}', action);
    this.dataService.set(pathService);
    
    return this.dataService.execGetOctet().pipe();
  }

  // Insertar archivos a un programa
  uploadFile(codProgram: string, request: IUploadFileProgramRequest) : Observable<IUploadFileProgramResponse>  {
    var pathService = `${environment.urlService}${PATH_SERVICE[11]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Eliminar archivos de un programa
  deleteFile(codProgram: string, request: IDeleteFileProgramRequest) : Observable<IDeleteFileProgramResponse>  {
    var pathService = `${environment.urlService}${PATH_SERVICE[11]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters).pipe();
  }

  // Activar programa
  activeProgram(codProgram: string) : Observable<IActivateProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[9]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    this.dataService.set(pathService);

    return this.dataService.execPutJson().pipe();
  }

  // Inactivar programa
  inactivateProgram(codProgram: string, request: IInactivateProgramRequest) : Observable<IInactivateProgramResponse>  {
    var pathService = `${environment.urlService}${PATH_SERVICE[10]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }
  
  // Clonar programa
  cloneProgram(codProgram: string) : Observable<ISaveProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[8]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    this.dataService.set(pathService);

    return this.dataService.execPutJson().pipe();
  }
  
  // Filtrar clientes (sección cobertura)
  filterClients(request: IFilterClientRequest) : Observable<IFilterClientResponse> {
    const pathService = `${environment.urlService}${PATH_SERVICE[12]}`;
    this.dataService.set(pathService);

    return this.dataService.execGet(request).pipe();
  }

  // Validar programa por nombre y id
  validateNameProgram(codProgram: string, nameProgram: string) : Observable<IValidateNameProgramResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[35]}`;
    pathService = pathService.replace('{idPrograma}', codProgram);
    pathService = pathService.replace('{nombrePrograma}', nameProgram);
    this.dataService.set(pathService);

    return this.dataService.execGet().pipe();
  }

}