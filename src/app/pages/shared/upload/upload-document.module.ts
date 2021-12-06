import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatTooltipModule,
  MatIconModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';
import { UploadDocumentComponent } from './upload-document.component';
import { UploadDocumentRoutingModule } from './upload-document-routing.module';


@NgModule({
  declarations: [
    UploadDocumentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    UploadDocumentRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})

export class UploadDocumentModule { }
