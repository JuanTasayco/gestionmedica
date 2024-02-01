import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { startWith, debounceTime, tap } from 'rxjs/operators';
import { ALERT_MESSAGES, BASE_DATE_FORMAT_API, COMMON_TYPES, detailNewTab, getEvoProfile, getOptions, getProfile, HTTP_METHOD_NOT_ALLOWED, HTTP_NO_CONTENT, MIN_CHARACTERS_SEARCH, ROLE_ADMIN, ROLE_MEDIC, searchElementInArray, substractMonthFromDate } from '@shared/helpers';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SignDocumentComponent } from '@pages/document-tray/modals/sign/sign-document.component';
import { MedicoService } from '@shared/services/medico.service';
import { UsuarioService } from '@shared/services/usuario.service';
import { IComun } from '@shared/models/response/interfaces/comun.interface';
import { IDocumentosResult } from '@shared/models/common/interfaces';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-list-document-tray',
  templateUrl: './upload-history.component.html',
  styleUrls: ['./upload-history.component.scss']
})

export class UploadHistoryComponent implements OnInit {
  formGroupSearchDocuments: FormGroup;

  disableButton: boolean;
  isFilterVisible: boolean;
  isVisible = false; // false
  estadoData: IComun[];
  sedesData: IComun[];
  medicosData: IComun[];
  especialidadesData: IComun[];
  dataSource: IDocumentosResult[];
  title: string;
  posIndex: number = null;
  arrCheckbox = [];
  selectionCheckList = new SelectionModel<Element>(true, []);
  pagination = 1;
  totalItems = 0;
  totalPages = 0;
  totalItemsPage = 10;
  hasRecords: boolean;
  toggleAccordeon = true;
  cantRegistros: number;
  totalPendiente: number;
  isMedico: boolean;
  codMedico: number;
  disableSearch= false;
  opciones: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private medicoService: MedicoService,
    private usuarioService: UsuarioService,
    private comunService: ComunService,
    private modalService: ModalMessageService,
    private documentoService: DocumentoService,
    private dialog: MatDialog,
    private eventTracker: EventTrackerService) {
    this.title = 'Historial de carga de documentos';
  }

  ngOnInit() {
    this.eventTracker.postEventTracker("opc1", "").subscribe()
    this.setValuesFormBuilder();
    this.initComponents();
  }
  searchElement(element, array){
    return  searchElementInArray(element, array);
  }
  getComunes() {
    this.comunService.getComun(COMMON_TYPES.estados)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.estados);
        }
        this.estadoData = response.body.data;
        this.formGroupSearchDocuments.patchValue({
          estado: this.estadoData[1].codigo,
        });
      });

  }
  checkRoles(){
    this.isMedico = false;
    this.opciones = getOptions();
    if(getEvoProfile() == null){return;}
    getEvoProfile().rolesCode.forEach(element => {
        if(element.codigoRol == ROLE_MEDIC && element.codigoRol != ROLE_ADMIN){
          this.isMedico = true;
          this.formGroupSearchDocuments.patchValue({
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
          this.formGroupSearchDocuments.get('sede').setValue(sedeTodos.codigo);
        });
        this.medicoService.getEspecialidadByMedico(this.codMedico, 0).subscribe((response) => {
          this.especialidadesData = response.body.data;
            // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
            this.formGroupSearchDocuments.get('especialidad').setValue('999')
        });

      //  this.search(1);
      });
    }else{

      this.codMedico = 0;
      this.medicoService.getSedesByMedico(0).subscribe((response) => {
        this.sedesData = response.body.data;
        const sedeTodos = this.sedesData.find((f: any) => f.codigo == 0);
      this.formGroupSearchDocuments.get('sede').setValue(sedeTodos.codigo);
      });
      this.medicoService.getEspecialidadByMedico(this.codMedico, 0).subscribe((response) => {
        this.especialidadesData = response.body.data;
        // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
        this.formGroupSearchDocuments.get('especialidad').setValue('999')
      });
    }
  }
  getSedeByMedico(){
    this.medicoService.getSedesByMedico(this.codMedico).subscribe((response) => {
      this.sedesData = response.body.data;
    });
  }
  getEspecialidadByMedico(event){
    const especialidad = event.value;
    this.medicoService.getEspecialidadByMedico(this.codMedico, especialidad).subscribe((response) => {
      this.especialidadesData = response.body.data;
      // this.especialidadesData.unshift({codigo: "999", descripcion: "TODOS"})
      this.formGroupSearchDocuments.get('especialidad').setValue('999');
    });
  }
  initComponents() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }
    this.getComunes();
    this.checkRoles();
  }

  toggleFilter() {
    const isDesktop = window.innerWidth > 991;
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

  showDocuments(index) {
    if (this.posIndex == index) {
      this.posIndex = null;
    } else {
      this.posIndex = index;
    }
  }
  checkPendientes(index) {
    if (this.arrCheckbox[index].valCabecera) {
      this.arrCheckbox[index].valCabecera = false;
    } else {
      this.arrCheckbox[index].valCabecera = true;
    }
  }

  checkDetCheckBox(indexC, indexD) {
    if (this.arrCheckbox[indexC].arrDetCheckbox[indexD]) {
      this.arrCheckbox[indexC].arrDetCheckbox[indexD] = false;
    } else {
      this.arrCheckbox[indexC].arrDetCheckbox[indexD] = true;
    }
    const checkAllDetails = this.arrCheckbox[indexC].arrDetCheckbox.every(Boolean);

    if (checkAllDetails) {
      this.arrCheckbox[indexC].valCabecera = true;
    } else {
      this.arrCheckbox[indexC].valCabecera = false;
    }
  }


  @HostListener('window:resize')
  onResize() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
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

  formGroupSearchDocumentsSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
    this.toggleFilter();
  }

  setValuesFormBuilder() {
    this.formGroupSearchDocuments = this.fb.group({
      estado: [''],
      codigo: [''],
      sede: [''],
      medico: new FormControl(''),
      especialidad: [''],
      fecha_desde: [substractMonthFromDate(new Date(),1)],
      fecha_hasta: [new Date()],

    });

    this.formGroupSearchDocuments.controls.medico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH && !this.isMedico) {
          this.getMedicos(value);
        }
      })
    ).subscribe();
  }

  onSelectedMedic(event) {
    this.codMedico = event.option.value.codigo;
    this.medicosData = [];
    this.getSedeByMedico();
  }

  onDisplayMedic(medic) {
    return medic ? medic.descripcion : '';
  }
  clean() {
    this.sedesData = [];
    this.especialidadesData = [];
    this.formGroupSearchDocuments.reset();
    this.setValuesFormBuilder();
    if(!this.isMedico){
      this.codMedico = 0;
    }else{
      this.formGroupSearchDocuments.patchValue({
        medico: getProfile().name
      });
      this.getSedeByMedico();
    }
    this.formGroupSearchDocuments.patchValue({
      estado: this.estadoData[1].codigo,
    });
    this.formGroupSearchDocumentsSubmit(this.formGroupSearchDocuments);
  }
  changePage(event) {
    this.search(event.page);
  }
  operationDetail(atencion, codigoItem, numeroItem) {
    const detail = {compania : atencion.compania, numeroConsulta: atencion.numeroConsulta, codigoItem: codigoItem, numeroItem: numeroItem}

    const row = atencion.documentos.find(p => p.codigoItem == codigoItem);

    const filtros = {
      paciente: atencion.paciente,
      historiaClinica: atencion.historiaClinica,
      sede: atencion.sede,
      ocurencia: atencion.ocurencia,
      tipoDocumento: row.tipoDocumento,
      fechaDocumento: row.fechaDocumento,
      fechaFirma: row.fechaFirma
    }
    this.eventTracker.postEventTracker("opc5", JSON.stringify(filtros)).subscribe()

    return detailNewTab(detail);
  }


  search(numPagina) {
    const request = {
      sede: +this.formGroupSearchDocuments.get('sede').value,
      codigo: this.formGroupSearchDocuments.get('codigo').value,
      estado: this.formGroupSearchDocuments.get('estado').value ? this.formGroupSearchDocuments.get('estado').value : 'P',
      medico: this.formGroupSearchDocuments.get('medico').value.codigo ? this.formGroupSearchDocuments.get('medico').value.codigo : this.codMedico ? this.codMedico : '',
      especialidad: +this.formGroupSearchDocuments.get('especialidad').value,
      fechaInicio: this.formGroupSearchDocuments.get('fecha_desde').value ? moment(this.formGroupSearchDocuments.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupSearchDocuments.get('fecha_hasta').value ? moment(this.formGroupSearchDocuments.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina
    };

    const dataFilter = {
      "sede:" : request.sede,
      "codigo:" : request.codigo,
      "estado:" : request.estado,
      "medico:" : request.medico,
      "especialidad:" : request.especialidad,
      "fechaInicio:" : request.fechaInicio,
      "fechaFinal:" : request.fechaFinal
    }

    this.eventTracker.postEventTracker("opc2",JSON.stringify(dataFilter)).subscribe()

    if(this.disableSearch){
      return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.documentosMedico);
    }
    this.documentoService.getBandejaDocumentos(request)
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
          this.totalPendiente = this.dataSource.filter(x => x.estado == 'PENDIENTE').length;
          this.posIndex = null;
          for (let i = 0; i < this.dataSource.length; i++) {
            const arrDetCheckbox = [];
            this.dataSource[i].documentos.forEach(element => {
              if (element.estado == 'PENDIENTE') {
                arrDetCheckbox.push(false);
              }
            });
            this.arrCheckbox.push({ valCabecera: false, arrDetCheckbox });
          }
        } else {
          this.hasRecords = false;
        }
      });
  }

  // Obtener información de los médicos
  getMedicos(text: string) {
    this.comunService.getComun(COMMON_TYPES.medicos, '', text.toUpperCase(), '1', '10')
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.medicos);
        }
        this.medicosData = response.body.data;
      });
  }


  uploadDocuments() {
    this.router.navigate(['historial-documentos/' + 'cargar-documentos/']);
  }

  signDocuments() {
    if(!this.isMedico){
      return this.modalService.alert(false, '',ALERT_MESSAGES[11].message);
    }
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { codMedico: this.codMedico, send: true }, panelClass: 'upload'
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}
