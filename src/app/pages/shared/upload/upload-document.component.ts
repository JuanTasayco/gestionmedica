import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@core/services';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ALERT_MESSAGES, COMMON_TYPES, formatBytes, HTTP_CREATED, HTTP_NO_CONTENT, MIN_CHARACTERS_SEARCH } from '@shared/helpers';
import { IComun } from '@shared/models/response/interfaces/comun.interface';
import { ComunService } from '@shared/services/comun.service';
import { DocumentoService } from '@shared/services/documento.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { ModalMessageService } from '@shared/services/modal-message.service';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'mapfre-upload-document-tray',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})

export class UploadDocumentComponent implements OnInit {
  formGroupUploadDocument: FormGroup;
  existsNroConsulta = false;
  existsOrdenTrabajo = false;
  arrLength: 0;
  items: FormArray;
  tipoModulo: string;
  tipoDocumentoData: IComun[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: ModalMessageService,
    public loaderService: LoaderService,
    private comunService: ComunService,
    private documentoService: DocumentoService,
    private eventTracker: EventTrackerService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tipoModulo = params.tipoModulo;
     });
    this.getCommon();
    this.setValuesFormBuilder();
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  return(){
    this.router.navigate(['/'+this.tipoModulo]);
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    this.loaderService.show();
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
    
    this.loaderService.hide();
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
    this.comunService.getComun(COMMON_TYPES.documentos)
      .subscribe((response) => {
        if(response.status == HTTP_NO_CONTENT){
          return this.modalService.alert(false, '',ALERT_MESSAGES[9].message + COMMON_TYPES.documentos);
        }   
        this.tipoDocumentoData = response.body.data;
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
      nroConsulta: ['', [ Validators.minLength(3)] ],
      ordenTrabajo: [''],
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
      .subscribe((response) => {
        if (response.status === 200) {
          this.existsNroConsulta = true;
        } else {
          this.modalService.alert(false, '', ALERT_MESSAGES[7].message);
          this.existsNroConsulta = false;
        }
      });
    }
    if(text == ''){
      this.existsNroConsulta = false;
    }
  }
  checkOrdenTrabajo() {
    const text = this.formGroupUploadDocument.get('ordenTrabajo').value;
    if (text.length > 2) {
      this.documentoService.getConsultaOA('O_' + text.toUpperCase())
      .subscribe((response) => {
        if (response.status === 200) {
          this.existsOrdenTrabajo = true;
        } else {
          this.modalService.alert(false, '', ALERT_MESSAGES[8].message);
          this.existsOrdenTrabajo = false;
        }
      });
    } 
    if(text == '' ){
      this.existsOrdenTrabajo = false;
    }
  }

  checkAllSigned() {
    let res = false;
    if (this.getFormArray().controls.every(val => val.value.firmado === true)) {
      res = true;
    }
    return res;
  }
  uploadDocuments() {
    
    if (!this.validForm()) {
      return  false;
    }

    const filter = {
      "numeroConsulta": this.formGroupUploadDocument.get('nroConsulta').value,
      "numeroAtencion": this.formGroupUploadDocument.get('ordenTrabajo').value,
    }
    
    let infoDocumento = {
        numeroConsulta: this.formGroupUploadDocument.get('nroConsulta').value,
        ordenAtencion: this.formGroupUploadDocument.get('ordenTrabajo').value,
        documentos: []
      };
    this.getFormArray().controls.forEach(element => {
        const detalle = {documentoBase64: element.value.base64,
                         nombreDocumento: element.value.archivo.name,
                        tipoDocumento: element.value.fileType,
                         firmado: element.value.firmado != null ? element.value.firmado : false };
        infoDocumento.documentos.push(detalle);
      });
    
    const validacion =  infoDocumento.documentos.find((f: any) => +f.tipoDocumento === 7 || +f.tipoDocumento === 29 || +f.tipoDocumento === 30)
     if(validacion && !infoDocumento.ordenAtencion) {
      this.modalService.alert(false, '', ALERT_MESSAGES[14].message);
      return;
     }

    this.eventTracker.postEventTracker("opc4", JSON.stringify(filter)).subscribe()
    this.documentoService.cargarDocumentos(infoDocumento).subscribe((response) => {
      if(response.status == HTTP_CREATED){
        this.modalService.success(true, this.tipoModulo, response.body.mensaje);
       }      
      });
  }
  validForm() {
    if (!this.formGroupUploadDocument.valid) {
      return false;
     } else {
       return true;
     }
  }
  disableButton(){
    let arrayLength = this.getArrayLength();
    if(!this.existsNroConsulta && !this.existsOrdenTrabajo){
      return true;
    }
    if(arrayLength == 0 && this.validForm()){
      return true;
    }
    if(arrayLength >= 1 && !this.validForm() ){
      return true;
    }
    return false;
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

