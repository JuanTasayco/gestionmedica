import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDocumentTrayComponent } from '@pages/document-tray/list/list-document-tray.component';

const routes: Routes = [
  {
    path: '',
    component: ListDocumentTrayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ListDocumentTrayRoutingModule { }
