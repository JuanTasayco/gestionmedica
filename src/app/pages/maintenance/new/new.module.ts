import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new.component';
import { MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatTooltipModule, MatIconModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewRoutingModule } from './new-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [NewComponent],
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

    NewRoutingModule,
    SharedModule
  ]
})
export class NewModule { }
