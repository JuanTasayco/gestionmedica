import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { startWith, debounceTime, tap } from 'rxjs/operators';
import { ALERT_MESSAGES, BASE_DATE_FORMAT_API, COMMON_TYPES, CONTENT_TYPE, detailNewTab, downloadBase64, getEvoProfile, getOptions, getProfile, HTTP_METHOD_NOT_ALLOWED, HTTP_NO_CONTENT, MIN_CHARACTERS_SEARCH, printPdfBase64, ROLE_MEDIC, searchElementInArray, substractMonthFromDate } from '@shared/helpers';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SignDocumentComponent } from '../modals/sign/sign-document.component';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { UsuarioService } from '@shared/services/usuario.service';
import { MedicoService } from '@shared/services/medico.service';
import { IComun } from '@shared/models/response/interfaces/comun.interface';
import { IDocumentosResult } from '@shared/models/common/interfaces';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-list-document-tray',
  templateUrl: './list-document-tray.component.html',
  styleUrls: ['./list-document-tray.component.scss']
})

export class ListDocumentTrayComponent implements OnInit {
  formGroupSearchDocuments: FormGroup;

  disableButton: boolean;
  isFilterVisible: boolean;
  isVisible = false;
  estadoData: IComun[];
  sedesData: IComun[];
  medicosData: IComun[];
  especialidadesData: IComun[];
  dataSource: IDocumentosResult[];
  title: string;
  posIndex: number = null;
  arrDataSend = [];
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
  disableSearch = false;
  opciones: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comunService: ComunService,
    private modalService: ModalMessageService,
    private documentoService: DocumentoService,
    private medicoService: MedicoService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private eventTracker: EventTrackerService) {
    this.title = 'Bandeja de documentos';
  }

  ngOnInit() {
    this.setValuesFormBuilder();
    this.initComponents();
    this.formGroupSearchDocumentsSubmit(this.formGroupSearchDocuments);    
    this.checkRoles();
    this.getComunes();
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



  initComponents() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }
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
    if (this.posIndex === index) {
      this.posIndex = null;
    } else {
      this.posIndex = index;
    }
  }

  checkFirma(index, event, data) {
    // tslint:disable-next-line: only-arrow-functions
    this.arrDataSend[index].arrDetCheckbox.forEach(function(element, i) {
      element.item = data.documentos[i];
      if (event.checked) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
  }

  checkAllFirmados(index) {
    let res = false;
    if (this.arrDataSend[index].arrDetCheckbox.every(val => val.checked === true)) {
      res = true;
      this.arrDataSend[index].valCabecera = true;
    } else {
      this.arrDataSend[index].valCabecera = false;
    }
    return res;
  }
  checkDetCheckBox(index, idx, item) {
    this.arrDataSend[index].arrDetCheckbox[idx].item = item;
    if (this.arrDataSend[index].arrDetCheckbox[idx].checked) {
      this.arrDataSend[index].arrDetCheckbox[idx].checked = false;
    } else {
      this.arrDataSend[index].arrDetCheckbox[idx].checked = true;
    }
    this.checkAllFirmados(index);
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
  getEspecialidadByMedico(event){
    this.medicoService.getEspecialidadByMedico(this.codMedico,event.value).subscribe((response) => { 
      this.especialidadesData = response.body.data;
    });
  }

  onDisplayMedic(medic) {
    return medic ? medic.descripcion : '';
  }
  clean() {
    this.formGroupSearchDocuments.reset();
    this.sedesData = [];
    this.especialidadesData = [];
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
  cantPendientes() {
    let cantidad = 0;
    this.arrDataSend.forEach(element => {
      element.arrDetCheckbox.forEach(e => {
        if (e.checked) {
          cantidad = cantidad + 1;
        }
      });
    });
    return cantidad;
  }

  changePage(event) {
    this.search(event.page);
  }
  operationsDetail(documento, data, tipo, codItem?, numItem?) {
    const request: any = { numeroConsulta: data.numeroConsulta, codigoItem: codItem, compania : '', numeroItem: ''};
    if (tipo === 'V') {
      request.compania = data.compania;
      request.numeroItem = numItem;
      return detailNewTab(request);
    }
    request.ordenAtencion = documento.numeroOrden;
    this.documentoService.download(request)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
         return this.modalService.alert(false, '', ALERT_MESSAGES[5].message);
        }
        if (tipo === 'D') {
          downloadBase64(response.body.data.object, response.body.data.fileName, CONTENT_TYPE.pdf);
        }
        if (tipo === 'P') {
          printPdfBase64(response.body.data.object);
        }

      });
  }
  search(numPagina) {
    const request = {
      codigo: this.formGroupSearchDocuments.get('codigo').value,
      sede: this.formGroupSearchDocuments.get('sede').value,
      estado: this.formGroupSearchDocuments.get('estado').value ? this.formGroupSearchDocuments.get('estado').value : 'P' ,
      medico: this.codMedico ? this.codMedico : '',
      especialidad: this.formGroupSearchDocuments.get('especialidad').value,
      fechaInicio: this.formGroupSearchDocuments.get('fecha_desde').value ?
      moment(this.formGroupSearchDocuments.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupSearchDocuments.get('fecha_hasta').value ?
      moment(this.formGroupSearchDocuments.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina
    };
    if(this.disableSearch){
      return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.documentosMedico);
    }
    this.documentoService.getBandejaDocumentos(request)
      .subscribe((response) => {
        if(response.status == HTTP_METHOD_NOT_ALLOWED){
          return this.modalService.alert(false, '',ALERT_MESSAGES[13].message);
        }  
        this.dataSource = response.data;
        if (this.dataSource.length !== 0) {
          this.arrDataSend = [];
          this.pagination = numPagina;
          this.hasRecords = true;
          this.totalItems = response.numeroRegistros;
          const totalPages = response.numeroRegistros / this.totalItemsPage;
          if (totalPages < 1) { this.totalPages = 1; }
          if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
          this.posIndex = null;
          this.totalPendiente = this.dataSource.filter(x => x.estado === 'PENDIENTE').length;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.dataSource.length; i++) {
            const arrDetCheckbox = [];
            this.dataSource[i].documentos.forEach(element => {
              if (element.estado === 'PENDIENTE') {
                arrDetCheckbox.push({checked: false, item: element.item});
              }
            });
            this.arrDataSend.push({numConsulta: this.dataSource[i].numeroConsulta , valCabecera: false, arrDetCheckbox });
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
     this.eventTracker.postEventTracker("opc3", "").subscribe()
    this.router.navigate(['bandeja-documentos/' + 'cargar-documentos/']);
  }
  searchElement(element, array){
    return  searchElementInArray(element, array);
  }
  checkRoles(){ 
    this.isMedico = false;
    this.opciones = getOptions(); 
    if(getEvoProfile() == null){return;}
    getEvoProfile().rolesCode.forEach(element => {
        if(element.codigoRol == ROLE_MEDIC){
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
          this.getSedeByMedico();
          
       this.search(1);
      });
    }else{
      
    this.search(1);
    }
  }

  getSedeByMedico(){
    this.medicoService.getSedesByMedico(this.codMedico).subscribe((response) => { 
      this.sedesData = response.body.data;
    });
  }
  signDocuments() {
    const codes = ['7', '29', '30'];
    if(!this.isMedico){
      return this.modalService.alert(false, '',ALERT_MESSAGES[11].message);
    }
    const sendData = [];
    this.arrDataSend.forEach(el => {
      el.arrDetCheckbox.forEach(ed => {
        if (ed.checked) {
          codes.includes(ed.item.codigoItem.toString()) ?
          sendData.push({numeroConsulta: el.numConsulta, codigoItem: ed.item.codigoItem, numeroOrden: ed.item.numeroOrden}) :
          sendData.push({numeroConsulta: el.numConsulta, codigoItem: ed.item.codigoItem});
        }
      });
    });
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { codMedico: this.codMedico, send: true, documents: sendData }, panelClass: 'upload'
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result.reload){
        this.search(1);
      }
    });
  }

}
