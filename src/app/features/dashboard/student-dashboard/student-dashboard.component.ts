import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';
import { StudentDataService, StudentDashboardData } from '../../../core/services/student-data.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent extends BaseDashboardComponent {
  dashboardData: StudentDashboardData | null = null;
  isLoading = false; // Initialize to false

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    private studentDataService: StudentDataService,
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
  //   this.studentDataService.getStudentDashboardData().subscribe({
  //     next: (data) => {
  //       this.dashboardData = data;
  //       this.isLoading = false;
  //       // TODO: Update UI elements based on this.dashboardData
  //     },
  //     error: (err) => {
  //       this.snackbarService.show('Failed to load student dashboard data.', 'error');
  //       this.isLoading = false;
  //       console.error(err);
  //     }
  //   });
  // }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'STUDENT';
  }

  // Placeholder methods for Quick Actions - to be updated if APIs are available
  viewCourses(): void {
    this.snackbarService.show('View Courses API not yet implemented.', 'info');
    // console.log('Navigate to View Courses');
    // this.router.navigate(['./courses']); // Example relative navigation
  }

  submitAssignment(): void {
    this.snackbarService.show('Submit Assignment API not yet implemented.', 'info');
    // console.log('Navigate to Submit Assignment');
    // this.router.navigate(['./assignments/submit']); // Example
  }

  checkGrades(): void {
    this.snackbarService.show('Check Grades API not yet implemented.', 'info');
    // console.log('Navigate to Check Grades');
    // this.router.navigate(['./grades']); // Example
  }

  viewSchedule(): void {
    this.snackbarService.show('View Schedule API not yet implemented.', 'info');
    // console.log('Navigate to View Schedule');
    // this.router.navigate(['./schedule']); // Example
  }
}