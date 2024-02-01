import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalAppointmentsComponent } from './medical-appointments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule,
        MatIconModule, MatDialogModule, MatTooltipModule, MatDatepickerModule,
        MatNativeDateModule, MatAutocompleteModule, MatCheckboxModule, MatChipsModule, MatDividerModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { MedicalAppointmentsRoutingModule } from './medical-appointments-routing.module';

@NgModule({
  declarations: [
    MedicalAppointmentsComponent
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
    MatChipsModule,
    MatDividerModule,
    SharedModule,

    MedicalAppointmentsRoutingModule,
    MatCheckboxModule
  ]
})
export class MedicalAppointmentsModule { }
