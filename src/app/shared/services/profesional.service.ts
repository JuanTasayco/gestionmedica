import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import {PATH_SERVICE } from '@shared/helpers';
import { HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ProfesionalService {
  constructor(private dataService: DataService) { }

  getProfesionalesSalud(request: any) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlProfessionalsSearch;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  obtenerEspecialidades(codMedico: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/especialidades';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  registrarProfesional(request:any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  actualizarProfesional(codMedico: string, request:any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional + '/' + codMedico;
    this.dataService.set(pathService);
    return this.dataService.execPutJson(request);
  }

  guardarTodo(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta;
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  getSede(codMedico: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/sedes';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getSede2(codMedico: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional2+ '/' + codMedico + '/sedes';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getEspecialidades(codMedico: string, codSede: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/sede/' + codSede + '/especialidad';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getTipoDocumentos(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'tipoDocumento';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getLongitudTipoDoc(tipodoc:number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'longitudDocumento/' + tipodoc;
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getObtenerCodUsuario(tipoDocumento : string , numeroDocumento: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'codigoUsuario';
    let parameters = new HttpParams();
    parameters = parameters.append('tipoDocumento', tipoDocumento);
    parameters = parameters.append('numeroDocumento', numeroDocumento );

    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  obtenerDataMedico(codMedico: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico;
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  agregarHorario(codMedico: string, horarios: any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/horario';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(horarios);
  }

  actualizarHorario(codMedico: string, horarios : any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/horario';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(horarios);
  }

  deleteHorario(codMedico: string, codHorario: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/horario/' + codHorario;
    this.dataService.set(pathService);
    return this.dataService.execDeleteJson();
  }

  registrarSedeEspec(codMedico: string, dataEspecialidad : any ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/especialidades';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(dataEspecialidad);
  }

  buscarHorarioFiltro(codMedico : string , data : any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/horario/busqueda';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  registrarHorario(codMedico : string , data : any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlRegistrarProfesional+ '/' + codMedico + '/horario';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

//   cargarListaDiagnosticos(valor : string , pagina : string, tamanio : string, tipo : string) {
//     const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaDiagnostico;
//     let parameters = new HttpParams();
//     parameters = parameters.append('valor', valor ? valor : '');
//     parameters = parameters.append('pagina', pagina );
//     parameters = parameters.append('tamanio', tamanio );
//     parameters = parameters.append('tipo', tipo );

//     this.dataService.set(pathService);
//     return this.dataService.execGetJson(parameters);
//   }


}
