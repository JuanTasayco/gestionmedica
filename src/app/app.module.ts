import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorInterceptor, JwtTokenInterceptor } from '@core/interceptors';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';

import { ErrorComponent } from './pages/error/error.component';

import { MessageComponent } from './pages/message/message.component';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    MessageComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
