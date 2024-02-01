import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalsComponent } from './professionals.component';
import { MatDatepickerModule, MatAutocompleteModule, MatInputModule,
  MatSelectModule, MatCheckboxModule, MatButtonModule, MatTooltipModule,
  MatIconModule, MatDialogModule, MatNativeDateModule, MatListModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfessionalsRoutingModule } from './professionals-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [ProfessionalsComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    ProfessionalsRoutingModule,
    SharedModule
  ],
  schemas : [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfessionalsModule { }
