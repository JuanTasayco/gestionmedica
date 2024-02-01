import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OdontoRouteGuard } from '@core/guards/odonto.guard';
import { DetailConsultComponent } from './detail-consult.component';
import { OdontogramEvolComponent } from './odontogram/odontogram-evol/odontogram-evol.component';
import { OdontogramInitComponent } from './odontogram/odontogram-init/odontogram-init.component';

const routes: Routes = [
  {
    path: '',
    component: DetailConsultComponent,
    pathMatch: 'full',
  },
  {
    path: 'odontograma-inicial',
    component: OdontogramInitComponent,
    canActivate: [OdontoRouteGuard]
  },
  {
    path: 'odontograma-evolutivo',
    component: OdontogramEvolComponent,
    canActivate: [OdontoRouteGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DetailConsultRoutingModule { }