import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent extends BaseDashboardComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router
  ) {
    super(authService, router);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'TEACHER';
  }
} 