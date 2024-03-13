import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import {COMMON_TYPES, PATH_SERVICE, createUrl } from '@shared/helpers';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ConsultaMedicaService {
  errorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private dataService: DataService) { }

  getBandejaConsultasMedicas(request: any) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlConsultaMedica;

    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  cargarListaDiagnosticos(valor : string , pagina : string, tamanio : string, tipo : string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaDiagnostico;
    const params = {
      valor, pagina, tamanio, tipo
    };
    const pathUrl = createUrl(pathService, params);
    this.dataService.set(pathService);
    return this.dataService.execGetByUrl(pathUrl);
  }

  listarServDiagSeleccionado(valor : string , pagina : string, tamanio : string, tipo : string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaServApoyo;
    const params = {
      valor, pagina, tamanio, tipo
    };
    const pathUrl = createUrl(pathService, params);
    this.dataService.set(pathService);
    return this.dataService.execGetByUrl(pathUrl);
  }

  listarProcedimientoSeleccionado(valor : string , numeroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaProcedimientos;
    const params = {
      valor, numeroConsulta
    };
    const pathUrl = createUrl(pathService, params);
    this.dataService.set(pathService);
    return this.dataService.execGetByUrl(pathUrl);
  }

  listarRecetaSeleccionado(valor : string ,tipo : string, tamanio : string, numeroConsulta:string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlListaRecetas;
    const params = {
      valor, tipo, tamanio, numeroConsulta
    };
    const pathUrl = createUrl(pathService, params);
    this.dataService.set(pathService);
    return this.dataService.execGetByUrl(pathUrl);
  }

  /* actualizarCabeceras */
  actualizarCabeceras(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta;
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  guardarDiagnosticos(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/diagnosticos';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  guardarApoyoDiagnostico(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/apoyoDiagnostico';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  actualizarApoyoDiagnostico(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/apoyoDiagnostico';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  guardarProcedimientos(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/procedimientos';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  actualizarProcedimientos(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/procedimientos';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  guardarReceta(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/receta';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  actualizarReceta(data: any, nroConsulta : string ) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + nroConsulta + '/receta';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  getCodUsuario(usuario: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'codigo/medico';
    let parameters = new HttpParams();
    parameters = parameters.append('usuario', usuario );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  getSedeByCodMedico(usuario: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'codigo/sede';
    let parameters = new HttpParams();
    parameters = parameters.append('usuario', usuario );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  getUPS(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos + 'ups';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getSedes(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos + 'sede';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  cargarDosis(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'unidadMedida/dosis';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  cargarFrecuencia(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'unidadMedida/frecuencia';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  cargarDuracion(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlComunCronicos+ 'unidadMedida/duracion';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getApoyoDiagnosticos(numeroConsulta:string):Observable<any>{
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta + '/apoyoDiagnostico';
    this.dataService.set(pathService);
    return this.dataService.execGet().pipe();
  }

  getProcedimientos(numeroConsulta:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta + '/procedimientos';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getRecetas(numeroConsulta:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/receta';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getReferencia(numeroConsulta:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/referencia';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getDetalleConsultaMedica(numeroConsulta:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta;
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  getDiagnosticosIdentificados(numeroConsulta:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/diagnosticos';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  eliminarDiagnostico(numeroConsulta:string, codeDiagnostico: string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/diagnostico/' + codeDiagnostico;
    this.dataService.set(pathService);
    return this.dataService.execDeleteJson();
  }

  eliminarApoyoDiagnostico(numeroConsulta:string, numeroOrden: number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/procedimiento/' + numeroOrden;
    this.dataService.set(pathService);
    return this.dataService.execDeleteJson();
  }

  eliminarRecetaMedica(numeroConsulta:string, correlativo: number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/receta/' + correlativo;
    this.dataService.set(pathService);
    return this.dataService.execDeleteJson();
  }

  calcularCantidad(data:any , numeroConsulta:number) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/receta/calculaCantidad';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  anularConsulta(numeroConsulta:number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta+ '/anula';
    this.dataService.set(pathService);
    return this.dataService.execPostJson();
  }

  actualizarReferencia(data:any, nroReferencia : number , numeroConsulta : number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/referencia/' + nroReferencia;
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  enviarReferencia(data:any, numeroConsulta : number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/referencia' ;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //botones superiores
  obtenerGuiaPractica(numeroConsulta : number, codigoDiagnostico : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/guiaPracticaClinica';
    let parameters = new HttpParams();
    parameters = parameters.append('codigoDiagnostico', codigoDiagnostico );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  listarGuiasPracticas( numeroConsulta : number, data : any ){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/guiaPracticaClinica' ;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //tab historial
  buscarHistorial(numeroConsulta :number, data:any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/historialAtencion/consulta' ;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  buscarHistorialOrden(numeroConsulta : number, data:any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/historialAtencion/orden' ;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //tab filiacion
  cargarFiliacionAntecedentes(numeroConsulta : number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta + '/afiliacion';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  guardarHistoria(data : any, numeroConsulta: String){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/afiliacion' ;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //tab declaracion
  obtenerDeclaracionSalud(numeroConsulta : number){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle+ numeroConsulta + '/declaracionSalud';
    this.dataService.set(pathService);
    return this.dataService.execGet();
  }

  //botones superiores

  previewConstancia(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/constancia';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  previewEpisodio(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/episodio';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  previewHistoria(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/hc_inicial';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  imprimirReceta(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/receta';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  imprimirProcedimientos(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/orden/procedimiento';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  imprimirApoyoDiag(numeroConsulta : string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/pdf/orden/apoyo_dx';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  //finalizar atencion

  finalizarAtencion(data:any){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + '/historiaClinica/firmar';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //filtros

  getFinanciador(financiador:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + 'filtro/financiadora';
    let parameters = new HttpParams();
    parameters = parameters.append('descripcionFinanciadora', financiador );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  getPaciente(financiador:string){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + 'filtro/paciente';
    let parameters = new HttpParams();
    parameters = parameters.append('nombreAfiliado', financiador );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }

  getEstados(){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + 'estados';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  //pdf

  generarArchivo(numeroConsulta : string, data:any){
    data.tipoDocumento = data.tipoDocumento.toUpperCase();
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/generaArchivo';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  validarArchivo( numeroConsulta : string, data:any ){
    data.tipoDocumento = data.tipoDocumento.toUpperCase();
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/validaArchivo';
    this.dataService.set(pathService);
    return this.dataService.execPostJsonAndStatus(data);
  }

  //finalizar atencion cronicos
  finalizarAtencion2( numeroConsulta : string, data:any ){
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarDetalle + numeroConsulta + '/finalizaAtencion';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  // Pedido
  generarPedido(numeroConsulta: string, data: any){
    data.tipoDocumento = data.tipoDocumento.toUpperCase();
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarPedido + numeroConsulta + '/generaPedido';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  //
  consultarDescansoMedico(numeroConsulta: string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarPedido + numeroConsulta + '/descansoMedico';
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  registrarDescansoMedico(numeroConsulta: any, data: any) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarPedido + numeroConsulta + '/descansoMedico';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  actualizarDescansoMedico(numeroConsulta: any, data: any) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.urlGuardarPedido + numeroConsulta + '/descansoMedico';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  //
  getMedico(codigo: string) {
    const pathService = environment.urlService_cronicos + PATH_SERVICE.medico + codigo;
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  postMedico(data: any) {
    const pathService = environment.urlService_cronicos + COMMON_TYPES.medico;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(data);
  }

  putMedico(codigo: any, data: any) {
    const pathService = environment.urlService_cronicos + COMMON_TYPES.medico + `/${codigo}`;
    this.dataService.set(pathService);
    return this.dataService.execPutJson(data);
  }

  //

  get errorValue(): any {
    return this.errorSubject.value;
  }

  get errorSubjectObs(): any {
    return this.errorSubject.asObservable();
  }

  set errorSubjectObsData(data: any) {
    this.errorSubject.next(data);
  }

  //

  getConsultorios(codigo: string) {
    const pathService = environment.urlService_cronicos + 'consultaMedica/' + codigo + '/consultorios' ;
    this.dataService.set(pathService);
    return this.dataService.execGetJsonAndStatus();
  }

  getBeneficios(codigoBeneficio:string){
    const pathService = environment.urlService_cronicos + 'consultaMedica/filtro/beneficio';
    let parameters = new HttpParams();
    parameters = parameters.append('codigoBeneficio', codigoBeneficio );
    this.dataService.set(pathService);
    return this.dataService.execGetJson(parameters);
  }
}
