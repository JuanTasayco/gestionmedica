import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  MatExpansionModule, MatCardModule, MatTabsModule, MatNativeDateModule, 
  MatDatepickerModule, MatChipsModule, MatAutocompleteModule, MatTableModule, MatCheckboxModule, MatRadioModule, MatTooltipModule, MatDialogModule, MatSlideToggleModule } from '@angular/material';
import { SharedModule } from '@shared/shared.module';
import { DetailConsultRoutingModule } from './detail-consult-routing.module';
import { DetailConsultComponent } from './detail-consult.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { TabDeclaracionSaludComponent } from './tabs/declaracion salud/declaracion-salud.component';
import { TabDetalleClinicaComponent } from './tabs/detalle-clinica/detalle-clinica.component';
import { TabFiliacionComponent } from './tabs/filiacion/filiacion.component';
import { TabHistorialComponent } from './tabs/historial/historial.component';
import { ReferenciaComponent } from './tabs/detalle-clinica/referencia/referencia.component';
import { ReferenciaStep1Component } from './tabs/detalle-clinica/referencia/step1/step1.component';
import { ReferenciaStep2Component } from './tabs/detalle-clinica/referencia/step2/step2.component';
import { ReferenciaStep3Component } from './tabs/detalle-clinica/referencia/step3/step3.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CardLoaderComponent } from './card-loader/card-loader.component';
import { OdontogramEvolComponent } from './odontogram/odontogram-evol/odontogram-evol.component';
import { OdontogramInitComponent } from './odontogram/odontogram-init/odontogram-init.component';
import { OdontogramModalComponent } from './odontogram/odontogram-modal/odontogram-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { OdontogramModalHallazgoComponent } from './odontogram/odontogram-modal-hallazgo/odontogram-modal-hallazgo.component';
import { SearchDocumentComponent } from '@shared/components/search-document/search-document.component';
import { SuccessComponent } from '@shared/components/success/sucess.component';
import { SignDocumentComponent } from '@shared/components/sign-document/sign-document.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { PdfViewerComponent } from '@shared/components/custom-pdf-viewer/custom-pdf-viewer.component';
import { MedicalRestComponent } from '@shared/components/medical-rest/medical-rest.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CharacteresFormatDirective } from './characteres-format.directive';
import { IntegerInputDirective } from './zero.directive';
import { InputRestrictionDirective } from './limit-characteres.directive';
import { MinDirective } from './min.directive';
import { RequerimientosComponent } from '@shared/components/requerimientos/requerimientos.component';
import { ModalDetalleProveedorComponent } from '@shared/components/modal-detalle-proveedor/modal-detalle-proveedor.component';


@NgModule({
  declarations: [
    CardLoaderComponent,
    OdontogramModalComponent,
    OdontogramModalHallazgoComponent,
    OdontogramInitComponent,
    OdontogramEvolComponent,
    DetailConsultComponent,
    TabDeclaracionSaludComponent,
    TabDetalleClinicaComponent,
    TabFiliacionComponent,
    TabHistorialComponent,
    SearchDocumentComponent,
    SignDocumentComponent,
    PdfViewerComponent,
    MedicalRestComponent,
    ReferenciaComponent,
    ReferenciaStep1Component,
    ReferenciaStep2Component,
    ReferenciaStep3Component,
    RequerimientosComponent,
    ModalDetalleProveedorComponent,
    CharacteresFormatDirective,
    IntegerInputDirective,
    InputRestrictionDirective,
    MinDirective
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule, 
    PdfViewerModule, 
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatChipsModule, 
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatSlideToggleModule,
    SharedModule,
    CalendarModule,
    DetailConsultRoutingModule,
    TextFieldModule
  ],
  entryComponents : [
    RequerimientosComponent,
    ModalDetalleProveedorComponent,
    SearchDocumentComponent,
    SignDocumentComponent,
    SuccessComponent,
    AlertComponent,
    PdfViewerComponent,
    MedicalRestComponent,
    OdontogramModalComponent,
    OdontogramModalHallazgoComponent
  ]
})
export class DetailConsultModule { }
