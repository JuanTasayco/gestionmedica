import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryTrayComponent } from './history-tray.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryTrayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HistoryTrayRoutingModule { }