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

  // Stats
  totalSchools = 0;
  totalPrincipals = 0;
  totalTeachers = 0;
  totalStudents = 0;
  totalActiveUsers = 0;

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
    this.initSchoolForm();
    this.loadSchools(); // This also populates allSchoolsForFilter via subscription
    this.initPrincipalForm();
    this.loadPrincipals();
    this.loadStudents(); // Initial load for all students

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
    if (this.schoolsSubscription) {
      this.schoolsSubscription.unsubscribe();
    }
    if (this.principalsSubscription) {
      this.principalsSubscription.unsubscribe();
    }
    if (this.studentsSubscription) {
      this.studentsSubscription.unsubscribe();
    }
  }

  // --- School Management ---
  initSchoolForm(school?: School): void {
    this.schoolForm = this.fb.group({
      id: [school?.id || null],
      name: [school?.name || '', Validators.required],
      principalId: [school?.principalId || '', Validators.required], // TODO: Populate with actual principals
      address: [school?.address || '', Validators.required],
      email: [school?.email || '', [Validators.required, Validators.email]],
      phone: [school?.phone || '', Validators.required],
      establishedDate: [school?.establishedDate ? new Date(school.establishedDate).toISOString().split('T')[0] : '', Validators.required]
    });
  }

  loadSchools(): void {
    this.schoolsSubscription = this.superAdminDataService.getSchools().subscribe(schools => {
      this.schools = schools;
      this.allSchoolsForFilter = [{ id: '', name: 'All Schools', principalId: '', address: '', email: '', phone: '', establishedDate: '', studentCount: 0, teacherCount: 0 }, ...schools]; // Add "All" option
      this.totalSchools = schools.length;
      this.updateOverviewStats(); // Update stats that depend on schools
    });
  }

  openSchoolModal(school: School | null = null): void {
    this.editingSchool = school;
    this.initSchoolForm(school || undefined);
    this.schoolModal?.show();
  }

  closeSchoolModal(): void {
    this.schoolModal?.hide();
    this.editingSchool = null;
    this.schoolForm.reset();
  }

  submitSchoolForm(): void {
    if (this.schoolForm.invalid) {
      this.snackbarService.show('Please fill all required fields correctly.', 'error');
      return;
    }

    const formValues = this.schoolForm.value;
    if (this.editingSchool && this.editingSchool.id) { // Editing existing school
      const updatedSchool: School = {
        ...this.editingSchool,
        ...formValues,
        // studentCount and teacherCount are not editable in this form, keep existing
      };
      this.superAdminDataService.updateSchool(updatedSchool).subscribe({
        next: () => {
          this.snackbarService.show('School updated successfully!', 'success');
          this.closeSchoolModal();
          // No need to call loadSchools() as BehaviorSubject in service will update the list
        },
        error: (err) => this.snackbarService.show(`Error updating school: ${err.message}`, 'error')
      });
    } else { // Adding new school
      // Omit id, studentCount, teacherCount as they are set by service or default
      const { id, studentCount, teacherCount, ...newSchoolData } = formValues;
      this.superAdminDataService.addSchool(newSchoolData).subscribe({
        next: () => {
          this.snackbarService.show('School added successfully!', 'success');
          this.closeSchoolModal();
        },
        error: (err) => this.snackbarService.show(`Error adding school: ${err.message}`, 'error')
      });
    }
  }

  confirmDeleteSchool(school: School): void {
    if (confirm(`Are you sure you want to delete ${school.name}? This action cannot be undone.`)) {
      this.deleteSchool(school.id);
    }
  }

  deleteSchool(schoolId: string): void {
    this.superAdminDataService.deleteSchool(schoolId).subscribe({
      next: () => {
        this.snackbarService.show('School deleted successfully!', 'success');
      },
      error: (err) => this.snackbarService.show(`Error deleting school: ${err.message}`, 'error')
    });
  }

  // --- Principal (Admin User) Management ---
  initPrincipalForm(principal?: User): void {
    this.principalForm = this.fb.group({
      id: [principal?.id || null],
      username: [principal?.username || '', Validators.required],
      firstName: [principal?.firstName || '', Validators.required],
      lastName: [principal?.lastName || '', Validators.required],
      email: [principal?.email || '', [Validators.required, Validators.email]],
      schoolId: [principal?.schoolId || null, Validators.required], // TODO: Populate with schools
      isActive: [principal?.isActive === undefined ? true : principal.isActive, Validators.required]
      // Role is fixed as 'ADMIN' for principals when adding/editing through this form
    });
  }

  loadPrincipals(): void {
    this.principalsSubscription = this.superAdminDataService.getPrincipals().subscribe(principals => {
      this.principals = principals;
      this.totalPrincipals = principals.length;
      this.updateOverviewStats();
    });
  }

  openPrincipalModal(principal: User | null = null): void {
    this.editingPrincipal = principal;
    this.initPrincipalForm(principal || undefined);
    this.principalModal?.show();
  }

  closePrincipalModal(): void {
    this.principalModal?.hide();
    this.editingPrincipal = null;
    this.principalForm.reset({ isActive: true, schoolId: null });
  }

  submitPrincipalForm(): void {
    if (this.principalForm.invalid) {
      this.snackbarService.show('Please fill all required fields correctly for the principal.', 'error');
      return;
    }
    const formValues = this.principalForm.value;

    if (this.editingPrincipal && this.editingPrincipal.id) { // Editing
      const updatedPrincipal: User = {
        ...this.editingPrincipal,
        ...formValues,
        role: 'ADMIN' // Ensure role is maintained
      };
      this.superAdminDataService.updateUser(updatedPrincipal).subscribe({
        next: () => {
          this.snackbarService.show('Principal updated successfully!', 'success');
          this.closePrincipalModal();
        },
        error: (err) => this.snackbarService.show(`Error updating principal: ${err.message}`, 'error')
      });
    } else { // Adding new
      const { id, ...newPrincipalData } = formValues;
      const newPrincipal: Omit<User, 'id'> = {
        ...newPrincipalData,
        role: 'ADMIN'
      };
      this.superAdminDataService.addUser(newPrincipal).subscribe({
        next: () => {
          this.snackbarService.show('Principal added successfully!', 'success');
          this.closePrincipalModal();
        },
        error: (err) => this.snackbarService.show(`Error adding principal: ${err.message}`, 'error')
      });
    }
  }

  confirmDeletePrincipal(principal: User): void {
    if (confirm(`Are you sure you want to delete principal ${principal.firstName} ${principal.lastName}? This action cannot be undone.`)) {
      this.deletePrincipal(principal.id);
    }
  }

  deletePrincipal(principalId: string): void {
    this.superAdminDataService.deleteUser(principalId).subscribe({
      next: () => {
        this.snackbarService.show('Principal deleted successfully!', 'success');
      },
      error: (err) => this.snackbarService.show(`Error deleting principal: ${err.message}`, 'error')
    });
  }
  // End Principal Management

  // --- Student Management (View/Filter/Delete for Super Admin) ---
  loadStudents(): void {
    // This subscription will update students for the view, and also teachers for stats
    this.studentsSubscription = this.superAdminDataService.users$.subscribe(allUsers => {
        this.students = allUsers.filter(u => u.role === 'STUDENT');
        this.totalStudents = this.students.length;

        this.totalTeachers = allUsers.filter(u => u.role === 'TEACHER').length;
        this.totalActiveUsers = allUsers.filter(u => u.isActive).length;
        this.updateOverviewStats();
    });
  }

  filterStudentsBySchool(event: Event): void {
    const schoolId = (event.target as HTMLSelectElement).value;
    this.selectedSchoolFilter = schoolId === '' ? null : schoolId;

    this.studentsSubscription = this.superAdminDataService.getStudents().subscribe(allStudents => {
      if (this.selectedSchoolFilter) {
        this.students = allStudents.filter(s => s.schoolId === this.selectedSchoolFilter);
      } else {
        this.students = allStudents; // Show all if no filter or "All Schools" is selected
      }
    });
  }

  confirmDeleteStudent(student: User): void {
    if (confirm(`Are you sure you want to delete student ${student.firstName} ${student.lastName}? This action cannot be undone.`)) {
      this.deleteStudent(student.id);
    }
  }

  deleteStudent(studentId: string): void {
    this.superAdminDataService.deleteUser(studentId).subscribe({
      next: () => {
        this.snackbarService.show('Student deleted successfully!', 'success');
        // The BehaviorSubject in the service will auto-update the list.
        // If filtering is active, re-apply filter to ensure correct view.
        if (this.selectedSchoolFilter) {
            this.students = this.students.filter(s => s.id !== studentId);
        }
      },
      error: (err) => this.snackbarService.show(`Error deleting student: ${err.message}`, 'error')
    });
  }
  // End Student Management

  updateOverviewStats(): void {
    // This method will be called after schools, principals, or users data is loaded/updated.
    // The properties totalSchools, totalPrincipals, totalStudents, totalTeachers, totalActiveUsers
    // are already updated directly in their respective load/subscription methods.
    // This method can be used for more complex aggregations if needed for the Reports/Stats tab.
    console.log('Stats updated:', {
      schools: this.totalSchools,
      principals: this.totalPrincipals,
      teachers: this.totalTeachers,
      students: this.totalStudents,
      activeUsers: this.totalActiveUsers
    });
  }

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