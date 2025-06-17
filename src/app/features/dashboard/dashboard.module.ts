import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { SuperAdminDashboardComponent } from './super-admin/super-admin-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    AdminDashboardComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'super-admin',
        component: SuperAdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_SUPER_ADMIN'] }
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'teacher',
        component: TeacherDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_TEACHER'] }
      },
      {
        path: 'student',
        component: StudentDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_STUDENT'] }
      }
    ])
  ]
})
export class DashboardModule { } 