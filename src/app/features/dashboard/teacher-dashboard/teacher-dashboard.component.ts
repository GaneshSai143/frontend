import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BaseDashboardComponent } from '../base-dashboard.component';
import { TeacherDataService, TeacherDashboardData } from '../../../core/services/teacher-data.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent extends BaseDashboardComponent {
  dashboardData: TeacherDashboardData | null = null;
  isLoading = false; // Initialize to false

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    private teacherDataService: TeacherDataService,
    private snackbarService: SnackbarService
  ) {
    super(authService, router, renderer, el);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // this.loadDashboardData(); // Call removed as API endpoint does not exist
  }

  // loadDashboardData(): void {
  //   this.isLoading = true;
  //   this.teacherDataService.getTeacherDashboardData().subscribe({
  //     next: (data) => {
  //       this.dashboardData = data;
  //       this.isLoading = false;
  //       // TODO: Update UI elements based on this.dashboardData
  //     },
  //     error: (err) => {
  //       this.snackbarService.show('Failed to load teacher dashboard data.', 'error');
  //       this.isLoading = false;
  //       console.error(err);
  //     }
  //   });
  // }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'TEACHER';
  }

  // Quick Actions - to be updated if APIs are available
  createAssignment(): void {
    this.snackbarService.show('Create Assignment API not yet implemented.', 'info');
    // this.router.navigate(['/assignments/new']);
  }

  gradeSubmissions(): void {
    this.snackbarService.show('Grade Submissions API not yet implemented.', 'info');
    // this.router.navigate(['/assignments/grade']);
  }

  scheduleClass(): void {
    this.snackbarService.show('Schedule Class API not yet implemented.', 'info');
    // this.router.navigate(['/calendar/new']);
  }

  messageStudents(): void {
    this.snackbarService.show('Message Students API not yet implemented.', 'info');
    // this.router.navigate(['/messages/new']);
  }
}