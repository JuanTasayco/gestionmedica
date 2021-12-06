import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@core/services';

import { environment } from '@environments/environment';

import { PATH_SERVICE } from '@shared/helpers';

import { ISearchInsuredRequest, IUpdateImcRequest, IAffiliateInsuredRequest, IExcludeInsuredRequest, 
  IMassiveAffiliateInsuredRequest, IMassiveExcludeInsuredRequest, IListProgramByAffiliateRequest, IUpdateSuggestedRequest } from '@shared/models/request/interfaces';
import { ISearchInsuredResponse, IUpdateImcResponse, IAffiliateInsuredResponse, IExcludeInsuredResponse, 
  IDetailInsuredResponse, IMassiveAffiliateInsuredResponse, IMassiveExcludeInsuredResponse, IDetailProgramResponse, IListProgramByAffiliateResponse} from '@shared/models/response/interfaces';

@Injectable({ providedIn: 'root' })

export class InsuredDataService {
  
  constructor(private dataService: DataService) { }

  // Filtar asegurados
  searchInsured(request: ISearchInsuredRequest) : Observable<ISearchInsuredResponse> {
    const pathService = `${environment.urlService}${PATH_SERVICE[13]}`;
    this.dataService.set(pathService);

    return this.dataService.execGet(request).pipe();
  }

  // Descargar excel de asegurados
  downloadInsuredsReport(request: ISearchInsuredRequest, user: string, ip: string, 
    module: string, action: string) : any {
    var pathService = `${environment.urlService}${PATH_SERVICE[14]}?`;
    if(request.CodCia) pathService += `CodCia=${request.CodCia}&`;
    if(request.CodPrd) pathService += `CodPrd=${request.CodPrd}&`;
    if(request.CodProg) pathService += `CodProg=${request.CodProg}&`;
    if(request.Candidatos) pathService += `Candidatos=${request.Candidatos}&`;
    if(request.TipDoc) pathService += `TipDoc=${request.TipDoc}&`;
    if(request.NumDoc) pathService += `NumDoc=${request.NumDoc}&`;
    if(request.NomPaciente) pathService += `NomPaciente=${request.NomPaciente}&`;
    if(request.Sexo) pathService += `Sexo=${request.Sexo}&`;
    if(request.EdadMin) pathService += `EdadMin=${request.EdadMin}&`;
    if(request.EdadMax) pathService += `EdadMax=${request.EdadMax}&`;
    pathService = pathService.slice(0, -1);
    pathService = pathService.replace('{usuario}', user);
    pathService = pathService.replace('{ip}', ip);
    pathService = pathService.replace('{modulo}', module);
    pathService = pathService.replace('{accion}', action);
    
    this.dataService.set(pathService);

    return this.dataService.execGetOctet().pipe();
  }
  
  // Ver detalle de asegurado
  detailInsured(codInsured: string, codCompany: string, docType: string, docNumber: string) : Observable<IDetailInsuredResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[15]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    this.dataService.set(pathService);

    return this.dataService.execGet().pipe();
  }

  // Descargar ficha de asegurado
  downloadInsuredFile(codInsured: string, codCompany: string, docType: string, docNumber: string, 
    user: string, ip: string, module: string, action: string) : any {
    var pathService = `${environment.urlService}${PATH_SERVICE[16]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    pathService = pathService.replace('{usuario}', user);
    pathService = pathService.replace('{ip}', ip);
    pathService = pathService.replace('{modulo}', module);
    pathService = pathService.replace('{accion}', action);
    
    this.dataService.set(pathService);

    return this.dataService.execGetOctet().pipe();
  }

  // Actualizar IMC de asegurado
  updateIMC(codInsured: string, codCompany: string, docType: string, docNumber: string, request: IUpdateImcRequest) : Observable<IUpdateImcResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[17]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Afiliar asegurado a programa
  affiliateInsured(codInsured: string, codCompany: string, docType: string, docNumber: string, request: IAffiliateInsuredRequest) : Observable<IAffiliateInsuredResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[18]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Excluir asegurado de programa
  excludeInsured(codInsured: string, codCompany: string, docType: string, docNumber: string, request: IExcludeInsuredRequest) : Observable<IExcludeInsuredResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[19]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Actualizar programas sugeridos
  updateSuggested(request: IUpdateSuggestedRequest) {
    var pathService = `${environment.urlService}${PATH_SERVICE[36]}`;
    this.dataService.set(pathService);

    return this.dataService.execPostJson(request).pipe();
  }

  // Afiliar masivamente
  massiveAffiliate(request: IMassiveAffiliateInsuredRequest) : Observable<IMassiveAffiliateInsuredResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[21]}`;
    let parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // Excluir masivamente
  massiveExclude(request: IMassiveExcludeInsuredRequest) : Observable<IMassiveExcludeInsuredResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[22]}`;
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

  // Obtener programas para inscribir afiliado
  getPrograms(codInsured: string, codCompany: string, docType: string, docNumber: string, request: IListProgramByAffiliateRequest) : Observable<IListProgramByAffiliateResponse> {
    var pathService = `${environment.urlService}${PATH_SERVICE[20]}`;
    pathService = pathService.replace('{idCia}', codCompany);
    pathService = pathService.replace('{idAsegurado}', codInsured);
    pathService = pathService.replace('{tipoDocumento}', docType);
    pathService = pathService.replace('{numeroDocumento}', docNumber);
    this.dataService.set(pathService);

    return this.dataService.execGet(request).pipe();
  }

}