import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent extends BaseDashboardComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router
  ) {
    super(authService, router);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'ADMIN';
  }
} 