import { Component, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';
import { ThemeService } from '../../../core/services/theme.service';
import { SuperAdminDataService, School, User } from '../../../core/services/super-admin-data.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

declare var bootstrap: any; // For Bootstrap Modals

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent extends BaseDashboardComponent implements OnInit, OnDestroy {

  schools: School[] = [];
  private schoolsSubscription!: Subscription;

  schoolForm!: FormGroup;
  editingSchool: School | null = null;
  schoolModal: any; // Bootstrap Modal instance

  principals: User[] = [];
  private principalsSubscription!: Subscription;
  principalForm!: FormGroup;
  editingPrincipal: User | null = null;
  principalModal: any; // Bootstrap Modal instance

  students: User[] = [];
  private studentsSubscription!: Subscription;
  // For student filtering
  allSchoolsForFilter: School[] = []; // To populate school filter dropdown
  selectedSchoolFilter: string | null = null;
  // No separate modal for students in SuperAdmin view for now, assuming view/delete primarily. Edit might navigate elsewhere or be a simpler modal.

  // Stats for Overview - will be populated from API
  dashboardOverviewStats: SuperAdminDashboardStats | null = null;

  // These properties will be used for the "Reports/Statistics" tab,
  // and will be derived from the lists fetched for management tabs if those APIs are implemented.
  // For now, they will remain 0 or be populated by the overview stats if structure matches.
  reportTabTotalSchools = 0;
  reportTabTotalPrincipals = 0;
  reportTabTotalTeachers = 0;
  reportTabTotalStudents = 0;
  reportTabTotalActiveUsers = 0;


  recentActivities: any[] = [
    { icon: 'bi-building', type: 'primary', title: 'New School Added', description: 'Greenwood High was added to the system.', time: '2 hours ago' },
    { icon: 'bi-person-plus', type: 'success', title: 'New Principal Registered', description: 'Alice Johnson (principal.johnson) was registered.', time: '5 hours ago' },
    { icon: 'bi-person-check', type: 'info', title: 'User Activated', description: 'Student emily.white account was activated.', time: '1 day ago'},
    { icon: 'bi-palette', type: 'warning', title: 'Theme Changed', description: 'Default theme was applied by an admin.', time: '2 days ago'}
  ];

  activeTab: string = 'overview'; // Default to overview tab
  private tabInstances: { [key: string]: any } = {};


  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    private themeService: ThemeService,
    private fb: FormBuilder,
    private superAdminDataService: SuperAdminDataService,
    private snackbarService: SnackbarService
  ) {
    super(authService, router, renderer, el);
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Call base ngOnInit
    this.loadSuperAdminDashboardData();

    // Initialize forms for modals (they are not populated with data initially)
    this.initSchoolForm();
    this.initPrincipalForm();

    // Initialize Modals
    const schoolModalElement = document.getElementById('schoolFormModal');
    if (schoolModalElement) {
      this.schoolModal = new bootstrap.Modal(schoolModalElement);
    }
    const principalModalElement = document.getElementById('principalFormModal');
    if (principalModalElement) {
      this.principalModal = new bootstrap.Modal(principalModalElement);
    }
    this.initializeTabs();
  }

  loadSuperAdminDashboardData(): void {
    this.superAdminDataService.getSuperAdminDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardOverviewStats = stats;
        // Update stats for the "Reports/Statistics" tab as well, if they are the same source
        this.reportTabTotalSchools = stats.totalSchools;
        this.reportTabTotalPrincipals = stats.totalPrincipals;
        this.reportTabTotalTeachers = stats.totalTeachers;
        this.reportTabTotalStudents = stats.totalStudents;
        this.reportTabTotalActiveUsers = stats.activeUsers || 0;

        // The "Manage Schools/Principals/Students" tabs will NOT be populated by this call.
        // Their data lists (this.schools, this.principals, this.students) will remain empty
        // unless separate API calls are implemented for them.
        // For now, ensure they are empty to reflect no data is loaded for those tables.
        this.schools = [];
        this.principals = [];
        this.students = [];
        this.allSchoolsForFilter = [{ id: '', name: 'All Schools', principalId: '', address: '', email: '', phone: '', establishedDate: '', studentCount: 0, teacherCount: 0 }];


        console.log('Super Admin Dashboard Stats Loaded:', this.dashboardOverviewStats);
      },
      error: (err) => {
        this.snackbarService.show('Failed to load dashboard data.', 'error');
        console.error(err);
      }
    });
  }

  initializeTabs(): void {
    ['overview', 'manage-schools', 'manage-principals', 'view-students', 'reports-stats'].forEach(tabId => {
      const tabElement = document.getElementById(`${tabId}-tab`);
      if (tabElement) {
        this.tabInstances[tabId] = new bootstrap.Tab(tabElement);
      }
    });
    // Ensure the default activeTab is shown
    if (this.tabInstances[this.activeTab]) {
       // Timeout to ensure elements are fully rendered before trying to show tab
      setTimeout(() => this.tabInstances[this.activeTab]?.show(), 0);
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    if (this.tabInstances[tabId]) {
      this.tabInstances[tabId].show();
    }
    if (this.isMobileView) { // Close mobile sidebar on tab navigation
        this.closeMobileSidebar();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy(); // Call base ngOnDestroy
    // Unsubscribe from any direct subscriptions if they were re-added for list data
    if (this.schoolsSubscription) this.schoolsSubscription.unsubscribe();
    if (this.principalsSubscription) this.principalsSubscription.unsubscribe();
    if (this.studentsSubscription) this.studentsSubscription.unsubscribe();
  }

  // --- School Management (Placeholder - No API for list/CRUD yet) ---
  initSchoolForm(school?: School): void {
    this.schoolForm = this.fb.group({
      id: [school?.id || null],
      name: [school?.name || '', Validators.required],
      // ... other fields ...
      principalId: [''], address: [''], email: [''], phone: [''], establishedDate: ['']
    });
  }
  openSchoolModal(school: School | null = null): void { this.snackbarService.show('School management API not yet implemented.', 'info'); }
  closeSchoolModal(): void { this.schoolModal?.hide(); }
  submitSchoolForm(): void { this.snackbarService.show('School submission API not yet implemented.', 'info');}
  confirmDeleteSchool(school: School): void {this.snackbarService.show('School deletion API not yet implemented.', 'info');}
  // deleteSchool(schoolId: string): void { /* API call */ }


  // --- Principal (Admin User) Management (Placeholder - No API for list/CRUD yet) ---
  initPrincipalForm(principal?: User): void {
    this.principalForm = this.fb.group({
      id: [principal?.id || null],
      username: [principal?.username || '', Validators.required],
      // ... other fields ...
      firstName: [''], lastName: [''], email: [''], schoolId: [null], isActive: [true]
    });
  }
  openPrincipalModal(principal: User | null = null): void { this.snackbarService.show('Principal management API not yet implemented.', 'info'); }
  closePrincipalModal(): void { this.principalModal?.hide(); }
  submitPrincipalForm(): void { this.snackbarService.show('Principal submission API not yet implemented.', 'info'); }
  confirmDeletePrincipal(principal: User): void {this.snackbarService.show('Principal deletion API not yet implemented.', 'info');}
  // deletePrincipal(principalId: string): void { /* API call */ }


  // --- Student Management (Placeholder - No API for list/delete yet) ---
  filterStudentsBySchool(event: Event): void { this.snackbarService.show('Student list API not yet implemented.', 'info'); this.students = []; }
  confirmDeleteStudent(student: User): void {this.snackbarService.show('Student deletion API not yet implemented.', 'info');}
  // deleteStudent(studentId: string): void { /* API call */ }


  // updateOverviewStats is no longer needed as stats come directly from dashboardOverviewStats
  // updateOverviewStats(): void { ... }


  protected override hasAccess(userRole: string): boolean {
    return userRole === 'SUPER_ADMIN';
  }

  selectTheme(themeName: string): void {
    this.themeService.setTheme(themeName);
  }

  // Action methods from Overview Tab
  addNewSchool(): void {
    this.setActiveTab('manage-schools');
    // Ensure modal is initialized if not already
    if (!this.schoolModal) {
        const schoolModalElement = document.getElementById('schoolFormModal');
        if (schoolModalElement) {
            this.schoolModal = new bootstrap.Modal(schoolModalElement);
        }
    }
    this.openSchoolModal(null);
  }

  registerPrincipal(): void {
    // This could now open the principal modal directly
    this.openPrincipalModal(null);
    // this.router.navigate(['/admins/new']); // Or navigate to a dedicated page if preferred
  }

  generateReports(): void {
    this.router.navigate(['/reports']);
  }

  systemSettings(): void {
    this.router.navigate(['/settings']);
  }

  override logout(): void {
    this.authService.logout();
    // Optionally, clear the theme or set to default on logout from dashboard itself
    // this.themeService.clearTheme();
  }
}