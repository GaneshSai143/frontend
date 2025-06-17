import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
// import { TeacherDashboardComponent } from './teacher-dashboard.component';

const routes: Routes = [
  { path: '', component: TeacherDashboardComponent }
];

@NgModule({
  declarations: [TeacherDashboardComponent],
  imports: [RouterModule.forChild(routes)]
})
export class TeacherDashboardModule { } 