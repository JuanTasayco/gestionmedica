import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentoService } from '@shared/services/documento.service';
import { DomSanitizer } from '@angular/platform-browser';
import { downloadBase64, printPdfBase64 } from '@shared/helpers/utils';

@Component({
  selector: 'mapfre-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})

export class DocumentDetailComponent implements OnInit {
  formGroupSearchDocuments: FormGroup;

  disableButton: boolean;
  isFilterVisible: boolean;
  isVisible = false; // false
  dataDetalle: any;
  tipoModulo: string;
  src: any;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private documentoService: DocumentoService) {
  }

  ngOnInit() {
   this.route.params.subscribe(params => {
     this.tipoModulo = params.tipoModulo;
     this.getDetalle(params.compania, params.numeroConsulta, params.codigoItem, params.numeroItem);
    });
  }
  return() {
    this.router.navigate([this.tipoModulo]);
  }
  downloadFile(base64, operation) {
    if(operation === 'P') {
      printPdfBase64(base64);
    }
    if (operation === 'D') {
      downloadBase64(base64, 'Documento', 'pdf');
    }
  }

  domSanitize(src) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + src);
}
  getDetalle(compania: string, numeroConsulta: string, codigoItem: string, numeroItem: string) {
    const idDetalle = compania + '_' + numeroConsulta + '_' + codigoItem + '_' + numeroItem;
    this.documentoService.getDetalleDocumento(idDetalle)
      .subscribe((response: any) => {
        this.dataDetalle = response.data;
      });
  }
}
