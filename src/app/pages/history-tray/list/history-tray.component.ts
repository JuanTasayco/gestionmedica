import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSelectChange, MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';

import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE, PATH_URL_DATA, FileUploadService, DOWNLOAD_CONFIG, MODULES, MIN_CHARACTERS_SEARCH, BASE_DATE_FORMAT_API, downloadBase64, printPdfBase64 } from '@shared/helpers';

import { IMaestro, IPrograma } from '@shared/models/common/interfaces';
import { IListMaestroRequest } from '@shared/models/request/interfaces';
import { IGetModulesResponse, IListMaestroResponse, ISearchProgramResponse } from '@shared/models/response/interfaces';
import { ISearchProgramRequest } from '@shared/models/request/interfaces/search-programs.interface';

import { MaestroService } from '@shared/services/maestro.service';
import { AuthenticationService } from '@shared/services/authentication.service';

import { ProgramDataService } from '@pages/history-tray/shared/program.service';
import { ComunService } from '@shared/services/comun.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';

@Component({
  selector: 'mapfre-program',
  templateUrl: './history-tray.component.html',
  styleUrls: ['./history-tray.component.scss']
})

export class HistoryTrayComponent implements OnInit {
  formGroupBuscarPrograma: FormGroup;

  isFilterVisible: boolean;
  disableButton: boolean;
  isSearched: boolean;

  companies: IMaestro[] = [];
  products: IMaestro[] = [];
  states: IMaestro[] = [];

  programs: IPrograma[] = [];
  pagination = 1;
  totalItems = 0;
  totalPages = 0;
  totalItemsPage = 10;

  companySelected: string;

  username: string;
  currentIp: string;
  sedesData: any;
  estadoData: any;
  especialidadesData: any;
  medicosData: any;
  diagnosticosData: any;
  procedimientosData: any;
  beneficiosData: any;
  hasRecords: boolean;
  dataSource: any;
  tipoDocumentoData: any;
  mostrarFiltros = false;

  constructor(private fb: FormBuilder, private maestroService: MaestroService,
              private programService: ProgramDataService, private dialog: MatDialog,
              private comunService: ComunService, private documentoService: DocumentoService,
              private fileUploadService: FileUploadService, private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.setValuesFormBuilder();
    // this.validateRole();
    this.initComponents();
    this.getCurrentIp();

    let profile = JSON.parse(localStorage.getItem('evoProfile'));
    this.username = profile ? profile.loginUserName : 'WEBMASTER';
  }

  // Inicializar componente de filtro (estilos)
  initComponents() {
    let isDesktop = window.innerWidth > 991;
    let heightDevice = window.innerHeight;
    let element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }

    this.getComunes();
  }
  getComunes() {
    this.comunService.getComun('sedes')
      .subscribe((response: any) => {
        this.sedesData = response.data;
      });
    this.comunService.getComun('documentos')
      .subscribe((response: any) => {
        this.tipoDocumentoData = response.data;
      });
    this.comunService.getComun('estados')
      .subscribe((response: any) => {
        this.estadoData = response.data;
      });
    this.comunService.getComun('especialidades')
      .subscribe((response: any) => {
        this.especialidadesData = response.data;
      });
    this.comunService.getComun('beneficios')
      .subscribe((response: any) => {
        this.beneficiosData = response.data;
      });

    this.search(1);
  }

  // Valores iniciales de datos de formulario de búsqueda
  setValuesFormBuilder() {
    this.formGroupBuscarPrograma = this.fb.group({
      sede: [''],
      tipoDocumento: [''],
      beneficio: [''],
      diagnostico: [''],
      procedimiento: [''],
      medico: [''],
      especialidad: [''],
      producto: [''],
      fecha_desde: [new Date()],
      fecha_hasta: [new Date()],
      codigo: [''],
      etiquetas: [''],
      numeroConsulta: [''],
      delivery: [false],
      estado: ['A']
    });

    this.formGroupBuscarPrograma.controls.medico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getMedicos(value);
        }
      })
    ).subscribe();

    this.formGroupBuscarPrograma.controls.diagnostico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getDiagnosticos(value);
        }
      })
    ).subscribe();

    this.formGroupBuscarPrograma.controls.procedimiento.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getProcedimientos(value);
        }
      })
    ).subscribe();

  }
  getMedicos(text: any) {
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.data;
      });
  }
  getProcedimientos(text: any) {
    this.comunService.getComun('procedimientos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.procedimientosData = response.data;
      });
  }
  getDiagnosticos(text: any) {
    this.comunService.getComun('diagnosticos', '', text.toUpperCase(), '1', '10')
    .subscribe((response: any) => {
      this.diagnosticosData = response.data;
    });
  }
  onSelectedSearch(tipo: string, e: MatAutocompleteSelectedEvent) {
    switch (tipo) {
      case 'M': this.medicosData = []; break;
      case 'D': this.diagnosticosData = []; break;
      case 'P': this.procedimientosData = []; break;
    }
  }
  operationsDetail(id, tipo, historia?) {
    const request = { id };
    this.documentoService.download(request)
      .subscribe((response: any) => {
        if (tipo == 'D') {
          downloadBase64(response.data.documentoBase64, 'Documento', 'pdf');
        }
        if (tipo == 'P') {
          printPdfBase64(response.data.documentoBase64);
        }
        if (tipo == 'V') {
          this.router.navigate(['bandeja-historias/detalle-documentos/' + historia.compania + '/'  + historia.numeroConsulta + '/' + historia.codigoItem + '/' + historia.numeroItem] );
        }
      });
  }

  onDisplaySearch(value) {
    return value ? value.descripcion : '';
  }
  // Obtener IP local
  getCurrentIp() {
    this.maestroService.getIpLocal()
      .subscribe((response: any) => {
        if (response != null) { this.currentIp = response.ip; }
      });
  }
  verFiltros() {
    console.log(this.mostrarFiltros);
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
      } else {
      this.mostrarFiltros = true;
    }
  }
  search(numPagina) {
    const request = {
      codigo: this.formGroupBuscarPrograma.get('codigo').value,
      numeroConsulta: this.formGroupBuscarPrograma.get('numeroConsulta').value,
      sede: this.formGroupBuscarPrograma.get('sede').value,
      beneficio: this.formGroupBuscarPrograma.get('beneficio').value,
      medico: this.formGroupBuscarPrograma.get('medico').value.codigo ? this.formGroupBuscarPrograma.get('medico').value.codigo : '',
      especialidad: this.formGroupBuscarPrograma.get('especialidad').value,
      diagnostico: this.formGroupBuscarPrograma.get('diagnostico').value.codigo ? this.formGroupBuscarPrograma.get('diagnostico').value.codigo : '',
      procedimientoServicio: this.formGroupBuscarPrograma.get('procedimiento').value.codigo ? this.formGroupBuscarPrograma.get('procedimiento').value.codigo : '',
      tipoDocumento: this.formGroupBuscarPrograma.get('tipoDocumento').value,
      fechaInicio: this.formGroupBuscarPrograma.get('fecha_desde').value ?
                   moment(this.formGroupBuscarPrograma.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupBuscarPrograma.get('fecha_hasta').value ?
                   moment(this.formGroupBuscarPrograma.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina,
      tamanio: this.totalItemsPage
    };

    this.documentoService.getBandejaHistoriaClinica(request)
    .subscribe((response: any) => {
      this.dataSource = response.data;
      if (this.dataSource.length != 0) {
        this.pagination = numPagina;
        this.hasRecords = true;
        this.totalItems = response.numeroRegistros;
        const totalPages = response.numeroRegistros / this.totalItemsPage;
        if (totalPages < 1) { this.totalPages = 1; }
        if (totalPages >= 1) { this.totalPages = totalPages; }
      } else {
        this.hasRecords = false;
      }
    });

  }
  // Limpiar datos de formulario de búsqueda
  clean() {
    this.formGroupBuscarPrograma.reset();
    this.isSearched = false;

    this.products = [];

    this.formGroupBuscarPrograma.get('sede').setValue('');
    this.formGroupBuscarPrograma.get('producto').setValue('');
    this.formGroupBuscarPrograma.get('estado').setValue('A');
  }

  // Enviar datos de formulario de búsqueda al servicio
  formGroupBuscarProgramaSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }

    this.toggleFilter();

    this.pagination = 1;
    let request = this.searchProgramRequest(fg);
    this.searchProgram(request);
  }

  // Obtener información de programas en base a filtros de búsqueda
  searchProgram(request: ISearchProgramRequest) {
    this.disableButton = true;

    this.programService.searchPrograms(request)
      .subscribe((response: ISearchProgramResponse) => {
        this.disableButton = false;
        if (response.codRpta === 200) {
          this.totalItems = Number(response.totalReg);
          this.totalPages = Number(response.totalPag);
          const { data } = response;
          this.programs = data;

          if (Number(response.totalReg) != 0) {
            this.isSearched = true;
          } else {
            this.isSearched = false;
            this.openModalError();
          }
        }
      });
  }

  // Cambio de página con mismos filtros
  changePage(event: any) {
    if (this.formGroupBuscarPrograma.invalid) { return true; }

    this.pagination = event.page;
    let request = this.searchProgramRequest(this.formGroupBuscarPrograma);
    this.searchProgram(request);
  }

  // Descarga ficha de programa
  downloadFile(codProgram: string, name: string) {
    this.programService.downloadProgramFile(codProgram, this.username,
      this.currentIp, DOWNLOAD_CONFIG.programa.modulo, DOWNLOAD_CONFIG.programa.accion.busqueda)
      .subscribe((response: any) => {
        if (response != null && response.body != null && response.body.size > 0) {
          this.fileUploadService.downloadFile('PDF', response.body, name);
        } else {
          this.openModalErrorFile();
        }
      });
  }

  // Validar que tenga acceso al modulo PROGRAMAS
  validateRole() {
    this.authService.getModules().subscribe((response: IGetModulesResponse) => {
      if (response.codRpta == 200) {
        const { data } = response;
        if (data.length != 0) {
          let hasProgram = data.filter(obj => obj.nomCorto == MODULES.programas);
          if (hasProgram.length == 0) { this.openModalAccessError(); }
        } else {
          this.openModalAccessError();
        }
      } else {
        this.openModalAccessError();
      }
    });
  }

  // Mostrar/Ocultar filtro en vista responsive
  toggleFilter() {
    let isDesktop = window.innerWidth > 991;
    if (isDesktop) {
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      this.isFilterVisible = !this.isFilterVisible;
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      }
    }
  }

  // Objeto Request para filtro de empresas
  getCompaniesRequest(): IListMaestroRequest {
    return {
      opt: '1'
    };
  }

  // Objeto Request para filtro de productos (por empresa)
  getProductsRequest(codCompany: string): IListMaestroRequest {
    return {
      opt: '2',
      param3: codCompany
    };
  }

  // Objeto Request para filtro de estados
  getStatesRequest(): IListMaestroRequest {
    return {
      opt: '999',
      param3: '1'
    };
  }

  // Objeto Request para filtro de programas
  searchProgramRequest(fg: FormGroup): ISearchProgramRequest {
    let request: ISearchProgramRequest = {};
    if (fg.value.sede) { request.compania = fg.value.sede; }
    if (fg.value.producto) { request.codigoProducto = fg.value.producto; }
    if (fg.value.programa) { request.nombrePrograma = fg.value.programa; }
    if (fg.value.etiquetas) { request.etiqueta = fg.value.etiquetas; }
    if (fg.value.delivery) { request.medicamento = fg.value.delivery; }
    if (fg.value.estado) { request.estado = fg.value.estado; }
    request.p_size = String(this.totalItemsPage);
    request.p_page = String(this.pagination);
    return request;
  }


  // Mostrar modal de alerta
  openModalError() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.search)[0];

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  // Mostrar modal de alerta para archivo
  openModalErrorFile() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type === ALERT_TYPE.custom)[0];
    alert.title = 'Alerta';
    alert.message = 'No se pudo descargar el archivo correspondiente.';

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  // Mostrar modal de alerta en caso no tenga acceso a modulos
  openModalAccessError() {
    const alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];

    alert.title = 'Alerta';
    alert.message = ALERT_MESSAGES[4].message + ' (Módulo PROGRAMAS)';

    const dialogRef = this.dialog.open(AlertComponent, {
      width: '400px', data: { alert }
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.href = environment.oimHome;
    });
  }

  // Inicializar componente de filtro (estilos) cuando la ventana cambia de tamaño
  @HostListener('window:resize')
  onResize() {
    let isDesktop = window.innerWidth > 991;
    let heightDevice = window.innerHeight;
    let element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      this.isFilterVisible = false;
      element.style.top = 'auto';
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      element.style.top = heightDevice - 70 + 'px';
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      }
    }
  }

  openView(id) {
    this.router.navigate([PATH_URL_DATA[id]], { replaceUrl: false });
  }

  viewDetail(program) {
    let id = program.codigoPrograma;
    this.router.navigate([PATH_URL_DATA[4], id], { replaceUrl: false });
  }

}
