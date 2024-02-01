import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ACCESS_CODE, PATH_URL_DATA, PATH_URL_DATA_AUX } from '@shared/helpers';

import { MessageComponent } from '@pages/message/message.component';
import { ErrorComponent } from '@pages/error/error.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { CustomDatePipe } from '@shared/pipes/customDate.pipe';
import { DynamicRouteGuard } from '@core/guards/dynamic.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: '@pages/home/home.module#HomeModule'
  },
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
    path: PATH_URL_DATA.urlInformesProcServ,
    loadChildren:  '@pages/reports-pro-serv/reports-pro-serv.module#ReportsProServModule'
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
    path: PATH_URL_DATA.urlMedicalAppointments,
    loadChildren: '@pages/medical-appointments/medical-appointments.module#MedicalAppointmentsModule'
  },
  {
    path: PATH_URL_DATA.urlMedicalAppointmentsDetail,
    loadChildren: '@pages/detail-consult/detail-consult.module#DetailConsultModule'
  },
  {
    path: PATH_URL_DATA.urlMaintenance,
    loadChildren: '@pages/maintenance/list/maintenance.module#MaintenanceModule',
    canActivate: [DynamicRouteGuard],
    data: {
      code: [ACCESS_CODE.accesMaintenance, ACCESS_CODE.accesProfSalud]
    }
  },
  {
    path: PATH_URL_DATA_AUX[2],
    loadChildren: '@pages/maintenance/professionals/professionals.module#ProfessionalsModule'
  },
  {
    path: PATH_URL_DATA_AUX[5],
    loadChildren: '@pages/maintenance/professionals/professionals.module#ProfessionalsModule'
  },
  {
    path: PATH_URL_DATA_AUX[0],
    loadChildren: '@pages/maintenance/detail/detail.module#DetailModule'
  },
  {
    path:  PATH_URL_DATA_AUX[3],
    loadChildren: '@pages/maintenance/new/new.module#NewModule'
  },
  {
    path: PATH_URL_DATA_AUX[4],
    loadChildren: '@pages/maintenance/new/new.module#NewModule'
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
