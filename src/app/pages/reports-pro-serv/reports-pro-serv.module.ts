import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsProServRoutingModule } from './reports-pro-serv-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule, MatTooltipModule, MatListModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsProServComponent } from './pages/list/reports-pro-serv.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NuevoInformeComponent } from './pages/nuevo-informe/nuevo-informe.component';
import { MatCardModule } from '@angular/material/card';
import { EditInformeComponent } from './pages/edit-informe/edit-informe.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { GenerateTemplateComponent } from './components/generate-template/generate-template.component';
import { SignDocumentComponent } from './components/sign/sign-document.component';
import { ListTemplateComponent } from './components/list-template/list-template.component';
import { ReportsProServService } from './service/reports-pro-serv.service';
import { DetailInformeComponent } from './pages/detail-informe/detail-informe.component';

@NgModule({
  declarations: [
    ReportsProServComponent,
    NuevoInformeComponent,
    EditInformeComponent,
    GenerateTemplateComponent,
    SignDocumentComponent,
    ListTemplateComponent,
    DetailInformeComponent
  ],
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
    MatTabsModule,
    MatCardModule,
    MatListModule,
    RichTextEditorModule,

    SharedModule,

    ReportsProServRoutingModule
  ],
  entryComponents: [
    GenerateTemplateComponent,
    SignDocumentComponent,
    ListTemplateComponent
  ],
  providers: [
    ReportsProServService
  ]
})
export class ReportsProServModule { }
