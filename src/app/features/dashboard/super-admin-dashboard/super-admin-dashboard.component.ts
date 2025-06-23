import { Component, Renderer2, ElementRef } from '@angular/core';
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
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef
  ) {
    super(authService, router, renderer, el);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'SUPER_ADMIN';
  }

  // Navigation methods
  navigateToSchools(): void {
    this.router.navigate(['/schools']);
  }

  navigateToAdmins(): void {
    this.router.navigate(['/admins']);
  }

  override navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  // Action methods
  addNewSchool(): void {
    this.router.navigate(['/schools/new']);
  }

  registerAdmin(): void {
    this.router.navigate(['/admins/new']);
  }

  generateReports(): void {
    this.router.navigate(['/reports']);
  }

  systemSettings(): void {
    this.router.navigate(['/settings']);
  }

  override logout(): void {
    this.authService.logout();
  }
} 