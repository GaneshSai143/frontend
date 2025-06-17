import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  // },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'super-admin',
        loadChildren: () => import('./features/dashboard/super-admin-dashboard/super-admin-dashboard.module').then(m => m.SuperAdminDashboardModule),
        canActivate: [RoleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/dashboard/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'teacher',
        loadChildren: () => import('./features/dashboard/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule),
        canActivate: [RoleGuard],
        data: { roles: ['TEACHER'] }
      }
    ]
  },
  {
    path: 'schools',
    loadChildren: () => import('./features/schools/schools.module').then(m => m.SchoolsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SUPER_ADMIN'] }
  },
  {
    path: 'admins',
    loadChildren: () => import('./features/admins/admins.module').then(m => m.AdminsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SUPER_ADMIN'] }
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 