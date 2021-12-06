import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatTooltipModule, MatDatepickerModule, 
  MatNativeDateModule, MatAutocompleteModule, MatIconModule, MatDialogModule, MatCheckboxModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule, 
    MatDatepickerModule,
    MatNativeDateModule, 
    MatAutocompleteModule, 
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,

    SharedModule,
  ],
  entryComponents: []
})

export class InsuredModule { }
