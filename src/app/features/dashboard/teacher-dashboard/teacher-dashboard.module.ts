import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
// import { TeacherDashboardComponent } from './teacher-dashboard.component';

const routes: Routes = [
  { path: '', component: TeacherDashboardComponent }
];

@NgModule({
  declarations: [TeacherDashboardComponent],
  imports: [
    CommonModule, // Add CommonModule here
    RouterModule.forChild(routes)
  ]
})
export class TeacherDashboardModule { }