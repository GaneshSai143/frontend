import { Component, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent extends BaseDashboardComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef
  ) {
    super(authService, router, renderer, el);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'STUDENT';
  }

  // Placeholder methods for Quick Actions
  viewCourses(): void {
    console.log('Navigate to View Courses');
    // this.router.navigate(['./courses']); // Example relative navigation
  }

  submitAssignment(): void {
    console.log('Navigate to Submit Assignment');
    // this.router.navigate(['./assignments/submit']); // Example
  }

  checkGrades(): void {
    console.log('Navigate to Check Grades');
    // this.router.navigate(['./grades']); // Example
  }

  viewSchedule(): void {
    console.log('Navigate to View Schedule');
    // this.router.navigate(['./schedule']); // Example
  }
}