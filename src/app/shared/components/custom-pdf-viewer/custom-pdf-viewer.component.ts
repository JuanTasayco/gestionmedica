import { Component, Input, OnInit } from "@angular/core";
import { PDFSource } from "ng2-pdf-viewer";

@Component({
  selector: 'mapfre-pdf-viewer-component',
  templateUrl: './custom-pdf-viewer.component.html'
})

export class PdfViewerComponent {

  @Input() src: string | Uint8Array | PDFSource;
  @Input() renderText: boolean;
  @Input() originalSize: boolean;
  @Input() showAll: boolean;
  @Input() fitToPage: boolean;
  @Input() autoresize: boolean;

}
