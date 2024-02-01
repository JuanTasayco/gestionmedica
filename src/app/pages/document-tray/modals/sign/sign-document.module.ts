import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatCheckboxModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { DocumentTrayModule } from '@pages/document-tray/shared/document-tray.module';
import { SignDocumentComponent } from '@pages/document-tray/modals/sign/sign-document.component';


@NgModule({
  declarations: [
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
        MatCheckboxModule
    ],
  entryComponents: [ ]
})

export class SignDocumentModule { }
