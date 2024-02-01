import { Injectable } from '@angular/core';
import { DataService } from '@core/services';
import { environment } from '@environments/environment';
import { PATH_IP_SERVICE } from '@shared/helpers';
import { 
  IGetListMedicalReportRequest, 
  ICancelMedicalReportRequest , 
  IGetListMasterRequest, 
  IGetListProcedureServiceRequest, 
  IGetListProfessionalsRequest,
  IGetListTemplateRequest,
  IRegisterMedicalReportRequest,
  IRegisterTemplateRequest,
  IUpdateMedicalReportRequest } from '@shared/models/request/interfaces';
import { IRegisterSignRequest } from '@shared/models/request/interfaces/register-sign.interface';

import { 
  ICancelMedicalReportResponse, 
  IGetBodyTemplateResponse, 
  IGetDetailMedicalReportResponse, 
  IGetListMasterResponse, IGetListMedicalReportResponse, 
  IGetListProcedureServiceResponse, 
  IGetListSedeMasterResponse, IGetListTemplateResponse, 
  IRegisterMedicalReportResponse, 
  IRegisterTemplateResponse, 
  IUpdateMedicalReportResponse } from '@shared/models/response/interfaces';
import { IRegisterSignResponse } from '@shared/models/response/interfaces/register-sign.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsProServService {
  url:string = environment.urlService+'informeProcedimientoServicio/'
  constructor(
    private dataService: DataService
  ) { }

getListMedicalReport(parameters:IGetListMedicalReportRequest):Observable<IGetListMedicalReportResponse>{
  this.dataService.set(this.url + 'informeMedico/busquedaInformesMedicos');

  return this.dataService.execPostJson(parameters).pipe();
}

getDetailMedicalReport(codInformeMedico:number):Observable<IGetDetailMedicalReportResponse>{
  let pathService = this.url + 'informeMedico/'+codInformeMedico;
  this.dataService.set(pathService);
  return this.dataService.execGetJson().pipe();
}

registerMedicalReport(parameters:IRegisterMedicalReportRequest) {
  let pathService = this.url + 'informeMedico';
  this.dataService.set(pathService);
  return this.dataService.execPostJsonAndStatus(parameters).pipe();
}

updateMedicalReport(parameters:IUpdateMedicalReportRequest, codInformeMedico:number):Observable<IUpdateMedicalReportResponse>{
  let pathService = this.url + 'informeMedico/'+ codInformeMedico;
  this.dataService.set(pathService);
  return this.dataService.execPutJson(parameters).pipe();
}

cancelMedicalReport(parameters:ICancelMedicalReportRequest, codInformeMedico:number):Observable<ICancelMedicalReportResponse>{
  let pathService = this.url + 'informeMedico/'+ codInformeMedico;;
  this.dataService.set(pathService);
  return this.dataService.execPutJson(parameters).pipe();
}

getPDFMedicalReport(codInformeMedico:number):any{
  let pathService = this.url + 'informeMedico/'+codInformeMedico+'/reporte?tipo=informeMedico&formato=pdf';
  this.dataService.set(pathService);
  return this.dataService.execGetJson().pipe();
}

getListProcedureService(parameters:IGetListProcedureServiceRequest):Observable<IGetListProcedureServiceResponse>{
  let pathService = this.url + 'procedimientosServicio/busquedaParaInformesMedicos';
  this.dataService.set(pathService);
  return this.dataService.execPostJson(parameters).pipe();
}

getListTemplate(parameters:IGetListTemplateRequest):Observable<IGetListTemplateResponse>{
  let pathService = this.url + 'plantillasInformeMedico';
  this.dataService.set(pathService);
  return this.dataService.execGetJson(parameters).pipe();
}

registerTemplate(parameters:IRegisterTemplateRequest) {
  let pathService = this.url + 'plantillaInformeMedico';
  this.dataService.set(pathService);
  return this.dataService.execPostJsonAndStatus(parameters).pipe();
}

getBodyTemplate(codTemplate:number):Observable<IGetBodyTemplateResponse>{
  let pathService = this.url + 'plantillaInformeMedico/'+codTemplate;
  this.dataService.set(pathService);
  return this.dataService.execGetJson().pipe();
}

getListMaster(parameters:IGetListMasterRequest, tipoNombre:string):Observable<IGetListMasterResponse>{
  let pathService = this.url + 'comun/'+tipoNombre;
  this.dataService.set(pathService);
  return this.dataService.execPostJson(parameters).pipe();
}

getListSedeMaster():Observable<IGetListSedeMasterResponse>{
  let pathService = this.url + 'comun/sede';
  this.dataService.set(pathService);
  return this.dataService.execGetJson().pipe();
}

getListProfessionals(parameters:IGetListProfessionalsRequest):Observable<any>{
  let pathService = this.url + 'comun/profesionales';
  this.dataService.set(pathService);
  return this.dataService.execPostJson(parameters).pipe();
}

firmarInforme(parameters:IRegisterSignRequest):Observable<IRegisterSignResponse>{
  let pathService = this.url + 'informeMedico/firmar';
  this.dataService.set(pathService);
  return this.dataService.execPostJson(parameters).pipe();
}

getIp(){
  this.dataService.set(PATH_IP_SERVICE);
  return this.dataService.execGet().pipe();
}


}
