import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatTooltipModule,
  MatIconModule, MatDialogModule, MatAutocompleteModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { ProgramModule } from '@pages/history-tray/shared/program.module';

import { HistoryTrayComponent } from './history-tray.component';
import { HistoryTrayRoutingModule } from './history-tray-routing.module';

@NgModule({
  declarations: [
    HistoryTrayComponent
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
    MatNativeDateModule,
    SharedModule,

    ProgramModule,

    HistoryTrayRoutingModule
  ]
})

export class HistoryTrayModule { }
