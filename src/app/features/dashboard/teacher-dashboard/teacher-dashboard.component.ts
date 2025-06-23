import { Component, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BaseDashboardComponent } from '../base-dashboard.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent extends BaseDashboardComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef
  ) {
    super(authService, router, renderer, el);
  }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'TEACHER';
  }

  createAssignment(): void {
    this.router.navigate(['/assignments/new']);
  }

  gradeSubmissions(): void {
    this.router.navigate(['/assignments/grade']);
  }

  scheduleClass(): void {
    this.router.navigate(['/calendar/new']);
  }

  messageStudents(): void {
    this.router.navigate(['/messages/new']);
  }
} 