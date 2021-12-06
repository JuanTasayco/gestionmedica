import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatIconModule, MatDialogModule } from '@angular/material';

import { KeysPipe, LogPipe, HtmlPipe } from '@shared/pipes';

import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AlertComponent } from '@shared/components/alert/alert.component';

import { InputPatternDirective } from '@shared/directives';

import { FileUploadService } from '@shared/helpers/fileUpload';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { CustomDatePipe } from './pipes/customDate.pipe';

@NgModule({
  declarations: [
    LogPipe,
    KeysPipe,
    HtmlPipe,
    CustomDatePipe,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    PaginationComponent,
    AlertComponent,
    ModalMessageComponent,
    InputPatternDirective
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    InputPatternDirective,
    CustomDatePipe,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    PaginationComponent,
    AlertComponent,
    ModalMessageComponent,
    HtmlPipe
  ],
  entryComponents : [
    AlertComponent,
    ModalMessageComponent
  ],
  providers: [
    FileUploadService
  ]
})

export class SharedModule { }
