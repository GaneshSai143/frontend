import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';
import { AdminDataService, AdminDashboardData } from '../../../core/services/admin-data.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent extends BaseDashboardComponent {
  dashboardData: AdminDashboardData | null = null;
  isLoading = false; // Initialize to false as no data will be loaded

  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    private adminDataService: AdminDataService,
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
  //   this.adminDataService.getAdminDashboardData().subscribe({
  //     next: (data) => {
  //       this.dashboardData = data;
  //       this.isLoading = false;
  //       // TODO: Update stat cards and other sections based on this.dashboardData
  //       // For now, the Overview tab's stat cards are static in HTML.
  //       // We can update them if this.dashboardData contains those specific metrics.
  //       // Example: this.totalTeachers = data.totalTeachersCount || 0;
  //     },
  //     error: (err) => {
  //       this.snackbarService.show('Failed to load admin dashboard data.', 'error');
  //       this.isLoading = false;
  //       console.error(err);
  //     }
  //   });
  // }

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'ADMIN';
  }

  onThemeColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.selectThemeColor(color); // Call method from BaseDashboardComponent
  }

  // Placeholder methods for Quick Actions - to be updated if APIs are available
  addNewTeacher(): void {
    this.snackbarService.show('Add New Teacher API not yet implemented.', 'info');
    // console.log('Navigate to Add New Teacher');
    // this.router.navigate(['/teachers/new']); // Example navigation
  }

  manageStudents(): void {
    this.snackbarService.show('Manage Students API not yet implemented.', 'info');
    // console.log('Navigate to Manage Students');
    // this.router.navigate(['/students']); // Example navigation
  }

  scheduleClasses(): void {
    this.snackbarService.show('Schedule Classes API not yet implemented.', 'info');
    // console.log('Navigate to Schedule Classes');
    // this.router.navigate(['/classes/schedule']); // Example navigation
  }

  generateReports(): void {
     this.snackbarService.show('Generate Reports functionality not yet implemented.', 'info');
    // console.log('Navigate to Generate Reports');
    // this.router.navigate(['/reports']); // Example navigation
  }
}