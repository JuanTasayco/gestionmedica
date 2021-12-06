import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatCheckboxModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { DocumentTrayModule } from '@pages/document-tray/shared/document-tray.module';

import { ListDocumentTrayComponent } from '@pages/document-tray/list/list-document-tray.component';
import { ListDocumentTrayRoutingModule } from '@pages/document-tray/list/list-document-tray-routing.module';
import { SignDocumentComponent } from '../modals/sign/sign-document.component';

@NgModule({
  declarations: [
    ListDocumentTrayComponent,
    SignDocumentComponent
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

        SharedModule,

        ListDocumentTrayRoutingModule,
        MatCheckboxModule
    ],
  entryComponents: [
    SignDocumentComponent
  ]
})

export class ListDocumentTrayModule { }
