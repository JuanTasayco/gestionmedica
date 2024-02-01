import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatIconModule, MatDialogModule, MatButtonModule } from '@angular/material';

import { KeysPipe, LogPipe, HtmlPipe, ValueEmptyPipe } from '@shared/pipes';

import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { RubricaComponent } from '@shared/components/rubrica/rubrica.component';

import { InputPatternDirective } from '@shared/directives';

import { FileUploadService } from '@shared/helpers/fileUpload';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { CustomDatePipe } from './pipes/customDate.pipe';
import { SuccessComponent } from './components/success/sucess.component';
import { DeleteAlertComponent } from './components/delete-alert/delete-alert.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { InputRestrictionDirective } from './directives/limit-characteres';

@NgModule({
  declarations: [
    LogPipe,
    KeysPipe,
    HtmlPipe,
    CustomDatePipe,
    ValueEmptyPipe,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    RubricaComponent,
    PaginationComponent,
    AlertComponent,
    SuccessComponent,
    ModalMessageComponent,
    InputPatternDirective,
    DeleteAlertComponent,
    ConfirmComponent,
    InputRestrictionDirective
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PdfViewerModule
  ],
  exports: [
    InputPatternDirective,
    CustomDatePipe,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    RubricaComponent,
    PaginationComponent,
    AlertComponent,
    ModalMessageComponent,
    HtmlPipe,
    ValueEmptyPipe,
    ConfirmComponent
  ],
  entryComponents : [
    AlertComponent,    
    ModalMessageComponent,
    DeleteAlertComponent,
    RubricaComponent,
    ConfirmComponent
  ],
  providers: [
    FileUploadService
  ]
})

export class SharedModule { }
