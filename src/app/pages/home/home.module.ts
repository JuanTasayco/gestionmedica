import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatIconModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { HomeComponent } from '@pages/home/home.component';
import { HomeRoutingModule } from '@pages/home/home-routing.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

    SharedModule,
    
    HomeRoutingModule
  ]
})
export class HomeModule { }
