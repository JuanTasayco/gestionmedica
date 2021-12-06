import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { startWith, debounceTime, tap } from 'rxjs/operators';
import { BASE_DATE_FORMAT_API, downloadBase64, MIN_CHARACTERS_SEARCH, printPdfBase64 } from '@shared/helpers';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SignDocumentComponent } from '../modals/sign/sign-document.component';
import { ModalMessageService } from '@shared/services/modal-message.service';

@Component({
  selector: 'mapfre-list-document-tray',
  templateUrl: './list-document-tray.component.html',
  styleUrls: ['./list-document-tray.component.scss']
})

export class ListDocumentTrayComponent implements OnInit {
  formGroupSearchDocuments: FormGroup;

  disableButton: boolean;
  isFilterVisible: boolean;
  isVisible = false; // false
  estadoData: any;
  sedesData: any;
  medicosData: any;
  especialidadesData: any;
  dataSource: any;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comunService: ComunService,
    private modalService: ModalMessageService,
    private documentoService: DocumentoService,
    private dialog: MatDialog) {
    this.title = 'Bandeja de documentos';
  }

  ngOnInit() {
    this.setValuesFormBuilder();
    this.initComponents();
    this.formGroupSearchDocumentsSubmit(this.formGroupSearchDocuments);
    this.getComunes();
  }

  getComunes() {
    this.comunService.getComun('sedes')
      .subscribe((response: any) => {
        this.sedesData = response.data;
      });
    this.comunService.getComun('estados')
      .subscribe((response: any) => {
        this.estadoData = response.data;
        this.formGroupSearchDocuments.patchValue({
          estado: this.estadoData[0].codigo,
        });
      });
    this.comunService.getComun('especialidades')
      .subscribe((response: any) => {
        this.especialidadesData = response.data;
      });
    this.search(1);
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
      paciente: [''],
      sede: [''],
      medico: new FormControl(''),
      especialidad: [''],
      fecha_desde: [new Date()],
      fecha_hasta: [new Date()],

    });

    this.formGroupSearchDocuments.controls.medico.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length >= MIN_CHARACTERS_SEARCH) {
          this.getMedicos(value);
        }
      })
    ).subscribe();
  }

  onSelectedMedic(e: MatAutocompleteSelectedEvent) {
    this.medicosData = [];
  }

  onDisplayMedic(medic) {
    return medic ? medic.descripcion : '';
  }
  clean() {
    this.formGroupSearchDocuments.reset();
    this.setValuesFormBuilder();
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
  operationsDetail(data, tipo, codItem?, numItem?) {
    console.log(data);
    const request = { numeroConsulta: data.numeroConsulta, numeroItem: codItem  };
    this.documentoService.download(request)
      .subscribe((response: any) => {
        if(response.status == '204'){
         return this.modalService.alert(false, '', 'No se encontró documento');
        }
        if (tipo === 'D') {
          downloadBase64(response.data.object, 'Documento', 'pdf');
        }
        if (tipo === 'P') {
          printPdfBase64(response.data.object);
        }

      });
    if (tipo === 'V') {
        this.router.navigate(['bandeja-documentos/detalle-documentos/' + data.compania + '/' +
        data.numeroConsulta + '/' + codItem + '/' + numItem ]);
      }
  }



  search(numPagina) {
    const request = {
      sede: this.formGroupSearchDocuments.get('sede').value,
      estado: this.formGroupSearchDocuments.get('estado').value,
      medico: this.formGroupSearchDocuments.get('medico').value.codigo ? this.formGroupSearchDocuments.get('medico').value.codigo : '',
      especialidad: this.formGroupSearchDocuments.get('especialidad').value,
      fechaInicio: this.formGroupSearchDocuments.get('fecha_desde').value ?
      moment(this.formGroupSearchDocuments.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupSearchDocuments.get('fecha_hasta').value ?
      moment(this.formGroupSearchDocuments.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina
    };

    this.documentoService.getBandejaDocumentos(request)
      .subscribe((response: any) => {
        this.dataSource = response.data;
        if (this.dataSource.length !== 0) {
          this.arrDataSend = [];
          this.pagination = numPagina;
          this.hasRecords = true;
          this.totalItems = response.numeroRegistros;
          const totalPages = response.numeroRegistros / this.totalItemsPage;
          if (totalPages < 1) { this.totalPages = 1; }
          if (totalPages >= 1) { this.totalPages = totalPages; }
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
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.data;
      });
  }


  uploadDocuments() {
    this.router.navigate(['bandeja-documentos/' + 'cargar-documentos/']);
  }

  signDocuments() {
    const sendData = [];
    this.arrDataSend.forEach(el => {
      el.arrDetCheckbox.forEach(ed => {
        if (ed.checked) {
          sendData.push({numeroConsulta: el.numConsulta, codigoItem: ed.item.codigoItem});
        }
      });
    });
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { send: true, documents: sendData }, panelClass: 'upload'
    });
    dialogRef.afterClosed().subscribe(_ => { this.search(1)});
  }

}
