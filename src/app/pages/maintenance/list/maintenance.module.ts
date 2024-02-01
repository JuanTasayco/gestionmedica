import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialogModule, MatIconModule, MatTooltipModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceRoutingModule } from './maintenance-routing.module';

@NgModule({
  declarations: [
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
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

    MaintenanceRoutingModule,
    SharedModule
  ]
})
export class MaintenanceModule { }
