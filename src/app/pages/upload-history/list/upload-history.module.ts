import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatTooltipModule,
  MatIconModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { InsuredModule } from '@pages/upload-history/shared/insured.module';

import { UploadHistoryComponent } from '@pages/upload-history/list/upload-history.component';
import { UploadHistoryRoutingModule } from '@pages/upload-history/list/upload-history-routing.module';

@NgModule({
  declarations: [
    UploadHistoryComponent
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

    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,

    InsuredModule,
    UploadHistoryRoutingModule
  ]
})

export class UploadHistoryModule { }
