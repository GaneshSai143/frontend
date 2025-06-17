import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent }
];

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [RouterModule.forChild(routes)]
})
export class AdminDashboardModule { } 