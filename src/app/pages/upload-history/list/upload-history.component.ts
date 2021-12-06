import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { startWith, debounceTime, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';

import { AppDateAdapter, BASE_DATE_FORMAT, BASE_DATE_FORMAT_API, MIN_CHARACTERS_SEARCH, PATH_URL_DATA } from '@shared/helpers';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ComunService } from '@shared/services/comun.service';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { DocumentoService } from '@shared/services/documento.service';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SignDocumentComponent } from '@pages/document-tray/modals/sign/sign-document.component';

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
  estadoData: any;
  sedesData: any;
  medicosData: any;
  especialidadesData: any;
  dataSource: any;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comunService: ComunService,
    private documentoService: DocumentoService,
    private dialog: MatDialog) {
    this.title = 'Historial de carga de documentos';
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
  changePage(event) {
    this.search(event.page);
  }
  operationDetail(atencion, codigoItem, numeroItem) {
    this.router.navigate(['historial-documentos/detalle-documentos/' + atencion.compania + '/' + atencion.numeroConsulta + '/' + codigoItem + '/' + numeroItem]);
  }


  search(numPagina) {
    const request = {
      sede: this.formGroupSearchDocuments.get('sede').value,
      estado: this.formGroupSearchDocuments.get('estado').value,
      medico: this.formGroupSearchDocuments.get('medico').value.codigo ? this.formGroupSearchDocuments.get('medico').value.codigo : '',
      especialidad: this.formGroupSearchDocuments.get('especialidad').value,
      fechaInicio: this.formGroupSearchDocuments.get('fecha_desde').value ? moment(this.formGroupSearchDocuments.get('fecha_desde').value).format(BASE_DATE_FORMAT_API) : '',
      fechaFinal: this.formGroupSearchDocuments.get('fecha_hasta').value ? moment(this.formGroupSearchDocuments.get('fecha_hasta').value).format(BASE_DATE_FORMAT_API) : '',
      pagina: numPagina
    };

    this.documentoService.getBandejaDocumentos(request)
      .subscribe((response: any) => {
        this.dataSource = response.data;
        if (this.dataSource.length != 0) {
          this.pagination = numPagina;
          this.hasRecords = true;
          this.totalItems = response.numeroRegistros;
          const totalPages = response.numeroRegistros / this.totalItemsPage;
          if (totalPages < 1) { this.totalPages = 1; }
          if (totalPages >= 1) { this.totalPages = totalPages; }
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
    this.comunService.getComun('medicos', '', text.toUpperCase(), '1', '10')
      .subscribe((response: any) => {
        this.medicosData = response.data;
      });
  }


  uploadDocuments() {
    this.router.navigate(['historial-documentos/' + 'cargar-documentos/']);
  }

  signDocuments() {
    const dialogRef = this.dialog.open(SignDocumentComponent, {
      width: '400px', data: { send: true }, panelClass: 'upload'
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}
