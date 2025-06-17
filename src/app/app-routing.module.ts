import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'super-admin-dashboard',
    loadChildren: () => import('./features/dashboard/super-admin-dashboard/super-admin-dashboard.module').then(m => m.SuperAdminDashboardModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SUPER_ADMIN'] }
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./features/dashboard/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'teacher-dashboard',
    loadChildren: () => import('./features/dashboard/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TEACHER'] }
  },
  {
    path: 'student-dashboard',
    loadChildren: () => import('./features/dashboard/student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STUDENT'] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 