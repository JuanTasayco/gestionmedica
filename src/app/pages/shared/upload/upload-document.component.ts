import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { formatBytes, MIN_CHARACTERS_SEARCH } from '@shared/helpers';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'mapfre-upload-document-tray',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})

export class UploadDocumentComponent implements OnInit {
  tipoDocumentoData: any;
  formGroupUploadDocument: FormGroup;
  existsNroConsulta: boolean;
  existsOrdenTrabajo: boolean;
  arrLength: 0;
  items: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private modalService: ModalMessageService,
    private comunService: ComunService,
    private documentoService: DocumentoService) {
  }

  ngOnInit(): void {
    this.getCommon();
    this.setValuesFormBuilder();
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        this.addItem(item, encoded);
      };
    }
  }
 getArrayLength() {
  const arrayControl = this.getFormArray();
  return arrayControl.length;
 }

  addItem(value , base64): void {
    const row = { file: value, checked: false, base64  };
    this.items = this.getFormArray();
    this.items.push(this.createItem(row));
  }
  getFormArray() {
    return this.formGroupUploadDocument.get('items') as FormArray;
  }
  formatBytes(bytes) {
    return formatBytes(bytes, 0);
  }
  deleteFile(index: number) {
    this.items.removeAt(index);
    this.checkAllSigned();
  }
  getCommon() {
    this.comunService.getComun('documentos')
      .subscribe((response: any) => {
        this.tipoDocumentoData = response.data;
      });
  }

  checkFirma(event) {
    const n = this.getArrayLength();
    for (let i = 0; i < n; ++i) {
      if (event.checked) {
        this.items.at(i).value.firmado = true;
      } else {
        this.items.at(i).value.firmado = false;
      }
    }
  }
  setValuesFormBuilder() {
    this.formGroupUploadDocument = this.fb.group({
      nroConsulta: ['', [Validators.required, Validators.minLength(3)] ],
      ordenTrabajo: ['', Validators.required],
      items: this.fb.array([ ])
    });
  }
  createItem(value?): FormGroup {
    return this.fb.group({
      archivo: value.file,
      base64: value.base64,
      firmado: value.firmado,
      fileType: [value.fileType, Validators.required]
    });
  }
  checkNroConsulta() {
    const text = this.formGroupUploadDocument.get('nroConsulta').value;
    if (text.length > 2) {
      this.documentoService.getConsultaOA('C_' + text.toUpperCase())
      .subscribe((response: any) => {
        if (response.status === '200') {
          this.existsNroConsulta = true;
        } else {
          this.modalService.alert(false, '', 'No se encontró número de consulta');
          this.existsNroConsulta = false;
        }
      });
    }
  }
  checkOrdenTrabajo() {
    const text = this.formGroupUploadDocument.get('ordenTrabajo').value;
    if (text.length > 2) {
      this.documentoService.getConsultaOA('O_' + text.toUpperCase())
      .subscribe((response: any) => {
        if (response.status === '200') {
          this.existsOrdenTrabajo = true;
        } else {
          this.modalService.alert(false, '', 'No se encontró orden de trabajo');
          this.existsOrdenTrabajo = false;
        }
      });
    }
  }

  checkAllSigned() {
    let res = false;
    if (this.getFormArray().controls.every(val => val.value.firmado === true)) {
      res = true;
    }
    return res;
  }
  loadDocuments() {
    if (!this.validForm()) {
      return  false;
    }
    const infoDocumento = {
        numeroConsulta: this.formGroupUploadDocument.get('nroConsulta').value,
        numeroAtencion: this.formGroupUploadDocument.get('ordenTrabajo').value,
        documentos: []
      };
    this.getFormArray().controls.forEach(element => {
        const detalle = {documentoBase64: element.value.base64,
                         nombreDocumento: element.value.archivo.name,
                        tipoDocumento: element.value.fileType,
                         firmado: element.value.firmado};
        infoDocumento.documentos.push(detalle);
      });
    this.documentoService.cargarDocumentos(infoDocumento).subscribe((response) => {
      this.modalService.alert(true, 'bandeja-documentos/', response.message);
      });
  }
  validForm() {
    if (!this.formGroupUploadDocument.valid) {
      return false;
     } else {
       return true;
     }
  }
  setFileType(index, value) {
    this.items.at(index).value.fileType = value;
  }
  checkDetCheckBox(index) {
    if (this.items.at(index).value.firmado) {
      this.items.at(index).value.firmado = false;
    } else {
      this.items.at(index).value.firmado = true;
    }
    this.checkAllSigned();
  }
}

