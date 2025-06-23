import { Component, Renderer2, ElementRef } from '@angular/core';
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
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef
  ) {
    super(authService, router, renderer, el);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'ADMIN';
  }

  // Placeholder methods for Quick Actions
  addNewTeacher(): void {
    console.log('Navigate to Add New Teacher');
    // this.router.navigate(['/teachers/new']); // Example navigation
  }

  manageStudents(): void {
    console.log('Navigate to Manage Students');
    // this.router.navigate(['/students']); // Example navigation
  }

  scheduleClasses(): void {
    console.log('Navigate to Schedule Classes');
    // this.router.navigate(['/classes/schedule']); // Example navigation
  }

  generateReports(): void {
    console.log('Navigate to Generate Reports');
    // this.router.navigate(['/reports']); // Example navigation
  }
}