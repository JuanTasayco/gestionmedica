import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalAppointmentsComponent } from './medical-appointments.component';


const routes: Routes = [
  {
    path: '',
    component: MedicalAppointmentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MedicalAppointmentsRoutingModule { }