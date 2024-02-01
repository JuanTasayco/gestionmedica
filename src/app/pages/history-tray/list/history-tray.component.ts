import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import {MIN_CHARACTERS_SEARCH, BASE_DATE_FORMAT_API, downloadBase64, printPdfBase64, substractMonthFromDate, detailNewTab, getEvoProfile, getProfile, ROLE_MEDIC, CONTENT_TYPE, HTTP_NO_CONTENT, ALERT_MESSAGES, COMMON_TYPES, ROLE_ADMIN, searchElementInArray, getOptions, HTTP_METHOD_NOT_ALLOWED } from '@shared/helpers';
import { ComunService } from '@shared/services/comun.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';
import { UsuarioService } from '@shared/services/usuario.service';
import { MedicoService } from '@shared/services/medico.service';
import { IComun } from '@shared/models/response/interfaces/comun.interface';
import { IHistoriaClinicaResult } from '@shared/models/common/interfaces';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-program',
  templateUrl: './history-tray.component.html',
  styleUrls: ['./history-tray.component.scss']
})

export class HistoryTrayComponent implements OnInit {
  formGroupBuscarHistoria: FormGroup;

  isFilterVisible: boolean;
  disableButton: boolean;
  isSearched: boolean;

  pagination = 1;
  totalItems = 0;
  totalPages = 0;
  totalItemsPage = 10;

  sedesData: IComun[];
  estadoData: IComun[];
  especialidadesData: IComun[];
  medicosData: IComun[];
  diagnosticosData: IComun[];
  procedimientosData: IComun[];
  beneficiosData: IComun[];
  tipoDocumentoData: IComun[];
  hasRecords: boolean;
  dataSource: IHistoriaClinicaResult[];
  mostrarFiltros = false;
  isMedico: boolean;
  codMedico: number;
  disableSearch= false;
  opciones: any[];

  constructor(private fb: FormBuilder, private medicoService: MedicoService,
              private usuarioService: UsuarioService, private modalService: ModalMessageService,
              private comunService: ComunService, private documentoService: DocumentoService,
              private eventTracker: EventTrackerService) { }

  ngOnInit() {
    this.eventTracker.postEventTracker("opc9", "").subscribe()
    this.setValuesFormBuilder();
    this.initComponents();
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
    this.checkRoles();
  }
  getComunes() {
    this.comunService.getComun(COMMON_TYPES.estados)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.estados);
        }
        this.estadoData = response.body.data;
      });
      this.comunService.getComun(COMMON_TYPES.documentos)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.documentos);
        }
        this.tipoDocumentoData = response.body.data;
      });
      this.comunService.getComun(COMMON_TYPES.beneficios)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.beneficios);
        }
        this.beneficiosData = response.body.data;
      });
  }

  checkRoles(){
    this.isMedico = false;
    this.opciones = getOptions();
    if(getEvoProfile() == null){return;}
    getEvoProfile().rolesCode.forEach(element => {
        if(element.codigoRol == ROLE_MEDIC && element.codigoRol != ROLE_ADMIN){
          this.isMedico = true;
          this.formGroupBuscarHistoria.patchValue({
            medico: getProfile().name
          });
        }
    });
    if(this.isMedico){
      this.usuarioService.getMedicoByUser(getProfile().username).subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          this.disableSearch = true;
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.medico);
        }
          this.codMedico = response.body.data.codMedico;
          this.medicoService.getSedesByMedico(this.codMedico).subscribe((response) => {
            this.sedesData = response.body.data;
            const sedeTodos = this.sedesData.find((f: any) => f.codigo == 0);
            this.formGroupBuscarHistoria.get('sede').setValue(sedeTodos.codigo);
          });
          this.medicoService.getEspecialidadByMedico(this.codMedico, 0).subscribe((response) => {
            this.especialidadesData = response.body.data;
            // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
            this.formGroupBuscarHistoria.get('especialidad').setValue('999');
          });

          // this.search(1);
      });
    }else{
      this.codMedico = 0;
      this.medicoService.getSedesByMedico(0).subscribe((response) => {
        this.sedesData = response.body.data;
        const sedeTodos = this.sedesData.find((f: any) => f.codigo == 0);
      this.formGroupBuscarHistoria.get('sede').setValue(sedeTodos.codigo);
      });
      this.medicoService.getEspecialidadByMedico(this.codMedico, 0).subscribe((response) => {
        this.especialidadesData = response.body.data;
        // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
        this.formGroupBuscarHistoria.get('especialidad').setValue('999');
      });
      // this.search(1);
    }
  }
  getSedeByMedico(){
    this.medicoService.getSedesByMedico(this.codMedico).subscribe((response) => {
      this.sedesData = response.body.data;
    });
  }
  onDisplayMedic(medic) {
    return medic ? medic.descripcion : '';
  }
  onDisplayDiagnostic(diagnostic) {
    return diagnostic ? diagnostic.descripcion : '';
  }
  onDisplayProcedure(procedure) {
    return procedure ? procedure.descripcion : '';
  }
  onSelectedMedic(event) {
    this.codMedico = event.option.value.codigo;
    this.medicosData = [];
    this.getSedeByMedico();
  }
  getEspecialidadByMedico(event){
    const especialidad = event.value;
    this.medicoService.getEspecialidadByMedico(this.codMedico, especialidad).subscribe((response) => {
      this.especialidadesData = response.body.data;
      // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
      this.formGroupBuscarHistoria.get('especialidad').setValue('999');
    });
  }
  // Valores iniciales de datos de formulario de búsqueda
  setValuesFormBuilder() {
    this.formGroupBuscarHistoria = this.fb.group({
      sede: [''],
      tipoDocumento: [''],
      beneficio: [''],
      diagnostico: new FormControl(''),
      procedimiento: new FormControl(''),
      medico:  new FormControl(''),
      especialidad: [''],
      fecha_desde: [substractMonthFromDate(new Date(),1)],
      fecha_hasta: [new Date()],
      codigo: [''],
      numeroConsulta: [''],
    });

    this.formGroupBuscarHistoria.controls.medico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH && !this.isMedico) {
          this.getMedicos(value);
        }
      })
    ).subscribe();

    this.formGroupBuscarHistoria.controls.diagnostico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getDiagnosticos(value);
        }
      })
    ).subscribe();

    this.formGroupBuscarHistoria.controls.procedimiento.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getProcedimientos(value);
        }
      })
    ).subscribe();

  }
  getMedicos(text) {
    this.comunService.getComun(COMMON_TYPES.medicos, '', text.toUpperCase(), '1', '10')
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.medicos);
        }
        this.medicosData = response.body.data;
      });
  }
  changePage(event) {
    this.search(event.page);
  }
  getProcedimientos(text) {
    this.comunService.getComun(COMMON_TYPES.procedimientos, '', text.toUpperCase(), '1', '10')
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.procedimientos);
        }
        this.procedimientosData = response.body.data;
      });
  }
  getDiagnosticos(text) {
    this.comunService.getComun(COMMON_TYPES.diagnosticos, '', text.toUpperCase(), '1', '10')
    .subscribe((response) => {
      if(response.status == HTTP_NO_CONTENT){
        return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.diagnosticos);
      }
      this.diagnosticosData = response.body.data;
    });
  }
  onSelectedSearch(tipo: string) {
    switch (tipo) {
      case 'D': this.diagnosticosData = []; break;
      case 'P': this.procedimientosData = []; break;
    }
  }
  operationsDetail(historia, tipo) {
    if (tipo == 'V') {
      this.eventTracker.postEventTracker("opc11", JSON.stringify(historia)).subscribe()
      return detailNewTab(historia);
    }
    this.documentoService.download(historia)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '', ALERT_MESSAGES[5].message);
         }
        if (tipo == 'D') {
          this.eventTracker.postEventTracker("opc15", JSON.stringify(historia)).subscribe()
          downloadBase64(response.body.data.object, response.body.data.fileName, CONTENT_TYPE.pdf);
        }
        if (tipo == 'P') {
          this.eventTracker.postEventTracker("opc14", JSON.stringify(historia)).subscribe()
          printPdfBase64(response.body.data.object);
        }
      });
  }

  verFiltros() {
    if (this.mostrarFiltros) {
      this.mostrarFiltros = false;
      } else {
      this.mostrarFiltros = true;
    }
  }
  searchElement(element, array){
    return  searchElementInArray(element, array);
  }
  search(numPagina) {
    const request = {
      codigo: this.formGroupBuscarHistoria.get('codigo').value,
      numeroConsulta: this.formGroupBuscarHistoria.get('numeroConsulta').value,
      sede: +this.formGroupBuscarHistoria.get('sede').value,
      beneficio: this.formGroupBuscarHistoria.get('beneficio').value,
      medico: this.formGroupBuscarHistoria.get('medico').value.codigo ? this.formGroupBuscarHistoria.get('medico').value.codigo : this.codMedico,
      especialidad: +this.formGroupBuscarHistoria.get('especialidad').value || 999,
      diagnostico: this.formGroupBuscarHistoria.get('diagnostico').value.codigo ? this.formGroupBuscarHistoria.get('diagnostico').value.codigo : '',
      procedimientoServicio: this.formGroupBuscarHistoria.get('procedimiento').value.codigo ? this.formGroupBuscarHistoria.get('procedimiento').value.codigo : '',
      tipoDocumento: this.formGroupBuscarHistoria.get('tipoDocumento').value,
      fechaInicio: this.formGroupBuscarHistoria.get('fecha_desde').value ?
                   moment(this.formGroupBuscarHistoria.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupBuscarHistoria.get('fecha_hasta').value ?
                   moment(this.formGroupBuscarHistoria.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina,
      tamanio: this.totalItemsPage
    };
    if(this.disableSearch){
      return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.documentosMedico);
    }

    const dataFilter = {
      "codigo :" : request.codigo,
      "numeroConsulta :" : request.numeroConsulta,
      "sede :" : request.sede,
      "beneficio :" : request.beneficio,
      "medico :" : request.medico,
      "especialidad :" : request.especialidad,
      "diagnostico :" : request.diagnostico,
      "procedimientoServicio :" : request.procedimientoServicio,
      "tipoDocumento :" : request.tipoDocumento,
      "fechaInicio :" : request.fechaInicio,
      "fechaFinal :" : request.fechaFinal
  }

    this.eventTracker.postEventTracker("opc10", JSON.stringify(dataFilter)).subscribe()


    this.documentoService.getBandejaHistoriaClinica(request)
    .subscribe((response) => {
      if(response.status == HTTP_METHOD_NOT_ALLOWED){
        return this.modalService.alert(false, '',ALERT_MESSAGES[13].message);
      }
      this.dataSource = response.data;
      if (this.dataSource.length != 0) {
        this.pagination = numPagina;
        this.hasRecords = true;
        this.totalItems = response.numeroRegistros;
        const totalPages = response.numeroRegistros / this.totalItemsPage;
        if (totalPages < 1) { this.totalPages = 1; }
        if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
      } else {
        this.hasRecords = false;
      }
    });

  }
  // Limpiar datos de formulario de búsqueda
  clean() {
    this.formGroupBuscarHistoria.reset();
    this.sedesData = [];
    this.especialidadesData = [];
    this.setValuesFormBuilder();
    if(!this.isMedico){
      this.codMedico = 0;
    }else{
      this.formGroupBuscarHistoria.patchValue({
        medico: getProfile().name
      });
      this.getSedeByMedico();
    }
  }

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


}
