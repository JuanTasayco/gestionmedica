import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { MatDatepickerModule, MatTabsModule, MatNativeDateModule, MatExpansionModule,
        MatAutocompleteModule, MatInputModule, MatSelectModule, MatCardModule,
        MatCheckboxModule, MatButtonModule, MatTooltipModule, MatIconModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailRoutingModule } from './detail-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { SuccessComponent } from '@shared/components/success/sucess.component';
import { FormaDateActivityPipe } from './format-date-activity';


@NgModule({
  declarations: [DetailComponent, FormaDateActivityPipe],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    DetailRoutingModule,
    SharedModule,
    CalendarModule
  ],
  entryComponents : [
    SuccessComponent,
    AlertComponent
  ]
})
export class DetailModule { }
