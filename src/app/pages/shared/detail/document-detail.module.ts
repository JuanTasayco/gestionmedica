import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatCheckboxModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { DocumentTrayModule } from '@pages/document-tray/shared/document-tray.module';
import { DocumentDetailComponent } from './document-detail.component';
import { DocumentDetailRoutingModule } from './document-detail-routing.module';
import { SignDocumentComponent } from '@pages/document-tray/modals/sign/sign-document.component';
import { SignDocumentModule } from '@pages/document-tray/modals/sign/sign-document.module';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [
    DocumentDetailComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,

        DocumentTrayModule,
        SignDocumentModule,
        SharedModule,

        DocumentDetailRoutingModule,
        MatCheckboxModule,
        NgxExtendedPdfViewerModule,
    ],
  entryComponents: [    
    SignDocumentComponent
  ]
})

export class DocumentDetailModule { }
