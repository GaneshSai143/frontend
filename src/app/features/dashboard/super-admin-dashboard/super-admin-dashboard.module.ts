import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboardComponent } from './super-admin-dashboard.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminDashboardComponent
  }
];

@NgModule({
  declarations: [
    SuperAdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SuperAdminDashboardModule { } 