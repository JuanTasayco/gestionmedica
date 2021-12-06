import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PATH_URL_DATA } from '@shared/helpers';

import { MessageComponent } from '@pages/message/message.component';
import { ErrorComponent } from '@pages/error/error.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { CustomDatePipe } from '@shared/pipes/customDate.pipe';

const routes: Routes = [
  {
    path: PATH_URL_DATA.urlDefault,
    loadChildren: '@pages/home/home.module#HomeModule'
  },

  {
    path: PATH_URL_DATA.urlBandejaHistorias,
    loadChildren: '@pages/history-tray/list/history-tray.module#HistoryTrayModule'
  },
  {
    path: PATH_URL_DATA.urlHistorialDocumento,
    loadChildren: '@pages/upload-history/list/upload-history.module#UploadHistoryModule'
  },
  {
    path: PATH_URL_DATA.urlBandejaDocumento,
    loadChildren: '@pages/document-tray/list/list-document-tray.module#ListDocumentTrayModule'
  },
  {
    path: PATH_URL_DATA.urlDetalleDocumento,
    loadChildren: '@pages/shared/detail/document-detail.module#DocumentDetailModule'
  },
  {
    path: PATH_URL_DATA.urlCargarDocumento,
    loadChildren:  '@pages/shared/upload/upload-document.module#UploadDocumentModule'
  },
  {
    path: PATH_URL_DATA.urlMensaje,
    component: MessageComponent
  },

  {
    path: PATH_URL_DATA.ulrError,
    component: ErrorComponent
  },

  {
    path: PATH_URL_DATA.urlDefault2,
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
