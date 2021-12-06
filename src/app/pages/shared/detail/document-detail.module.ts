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

        SharedModule,

        DocumentDetailRoutingModule,
        MatCheckboxModule
    ],
  entryComponents: [
  ]
})

export class DocumentDetailModule { }
