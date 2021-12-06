import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadHistoryComponent } from '@pages/upload-history/list/upload-history.component';

const routes: Routes = [
  {
    path: '',
    component: UploadHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UploadHistoryRoutingModule { }