import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PATH_URL_DATA } from '@shared/helpers';
import { DetailInformeComponent } from './pages/detail-informe/detail-informe.component';
import { EditInformeComponent } from './pages/edit-informe/edit-informe.component';
import { ReportsProServComponent } from './pages/list/reports-pro-serv.component';
import { NuevoInformeComponent } from './pages/nuevo-informe/nuevo-informe.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsProServComponent
  },
  {
    path: PATH_URL_DATA.urlNuevoInforme,
    component: NuevoInformeComponent
  },
  {
    path: PATH_URL_DATA.urlNuevoInforme+'/:id',
    component: EditInformeComponent
  },
  {
    path: PATH_URL_DATA.urlDetalleInforme+'/:id',
    component: DetailInformeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsProServRoutingModule { }
