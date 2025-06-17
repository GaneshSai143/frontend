import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent extends BaseDashboardComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router
  ) {
    super(authService, router);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'SUPER_ADMIN';
  }
} 