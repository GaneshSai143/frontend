import { Component, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; // Added FormArray
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseDashboardComponent } from '../base-dashboard.component';
import { ThemeService } from '../../../core/services/theme.service';
import { SuperAdminDataService } from '../../../core/services/super-admin-data.service'; // Service import
import { School, CreateSchoolRequest, UpdateSchoolRequest } from '../../../core/models/school.model'; // Model imports
import { User } from '../../../core/models/user.model';
import { CreatePrincipalRequest } from '../../../core/models/principal.model';
import { StudentProfile as StudentListDTO, UpdateStudentClassRequest } from '../../../core/models/student.model';
import { TeacherProfile as TeacherListDTO } from '../../../core/models/teacher.model';
// SuperAdminDashboardStats is not used as its API endpoint doesn't exist
// import { SuperAdminDashboardStats } from '../../../core/models/dashboard.model'; // Assuming it would be here
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

  students: User[] = []; // Changed type to User[]
  private studentsSubscription!: Subscription;
  // For student filtering
  allSchoolsForFilter: School[] = []; // To populate school filter dropdown
  selectedSchoolFilter: string | null = null;
  // No separate modal for students in SuperAdmin view for now, assuming view/delete primarily. Edit might navigate elsewhere or be a simpler modal.

  // dashboardOverviewStats property removed as its API endpoint doesn't exist and type was causing issues.
  // Overview tab in HTML will show static values or 0s due to {{ someVar?.property || 0 }}

  // Stats for the "Reports/Statistics" tab, derived from loaded lists
  reportTabTotalSchools = 0;
  reportTabTotalPrincipals = 0;
  reportTabTotalTeachers = 0; // Will be loaded via getTeachers()
  reportTabTotalStudents = 0;
  reportTabTotalActiveUsers = 0; // This requires iterating all users, or a specific API endpoint

  allTeachers: User[] = []; // Changed from TeacherListDTO[]
  private teachersSubscription!: Subscription;
  teacherForm!: FormGroup; // Will manage User properties
  editingTeacher: User | null = null; // Changed from TeacherListDTO
  teacherModal: any; // Bootstrap Modal instance

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
    protected override themeService: ThemeService, // Pass to base, make protected if used directly
    private fb: FormBuilder,
    private superAdminDataService: SuperAdminDataService,
    private snackbarService: SnackbarService
  ) {
    super(authService, router, renderer, el, themeService); // Pass themeService to base
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Call base ngOnInit
    // Call to this.loadSuperAdminDashboardData(); removed as the method and its API endpoint do not exist.

    this.initSchoolForm();
    this.initPrincipalForm();

    this.loadSchools();
    this.loadPrincipals();
    this.loadStudents();
    this.loadTeachers(); // For stats

    // Initialize Modals
    const schoolModalElement = document.getElementById('schoolFormModal');
    if (schoolModalElement) {
      this.schoolModal = new bootstrap.Modal(schoolModalElement);
    }
    const principalModalElement = document.getElementById('principalFormModal');
    if (principalModalElement) {
      this.principalModal = new bootstrap.Modal(principalModalElement);
    }
    const teacherModalElement = document.getElementById('teacherFormModal'); // Init teacher modal
    if (teacherModalElement) {
      this.teacherModal = new bootstrap.Modal(teacherModalElement);
    }
    this.initTeacherForm(); // Init teacher form
    this.initializeTabs();
  }

  // loadSuperAdminDashboardData(): void {
  //   this.superAdminDataService.getSuperAdminDashboardStats().subscribe({
  //     next: (stats) => {
  //       this.dashboardOverviewStats = stats;
  //       // Update stats for the "Reports/Statistics" tab as well, if they are the same source
  //       this.reportTabTotalSchools = stats.totalSchools;
  //       this.reportTabTotalPrincipals = stats.totalPrincipals;
  //       this.reportTabTotalTeachers = stats.totalTeachers;
  //       this.reportTabTotalStudents = stats.totalStudents;
  //       this.reportTabTotalActiveUsers = stats.activeUsers || 0;

  //       // The "Manage Schools/Principals/Students" tabs will NOT be populated by this call.
  //       // Their data lists (this.schools, this.principals, this.students) will remain empty
  //       // unless separate API calls are implemented for them.
  //       // For now, ensure they are empty to reflect no data is loaded for those tables.
  //       this.schools = [];
  //       this.principals = [];
  //       this.students = [];
  //       this.allSchoolsForFilter = [{ id: '', name: 'All Schools', principalId: '', address: '', email: '', phone: '', establishedDate: '', studentCount: 0, teacherCount: 0 }];

  //       console.log('Super Admin Dashboard Stats Loaded:', this.dashboardOverviewStats);
  //     },
  //     error: (err) => {
  //       this.snackbarService.show('Failed to load dashboard data.', 'error');
  //       console.error(err);
  //     }
  //   });
  // }

  initializeTabs(): void {
    ['overview', 'manage-schools', 'manage-principals', 'manage-teachers', 'view-students', 'reports-stats'].forEach(tabId => {
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
    if (this.teachersSubscription) this.teachersSubscription.unsubscribe();
  }

  // --- School Management ---
  initSchoolForm(school?: School): void { // School type from core/models
    this.schoolForm = this.fb.group({
      id: [school?.id || null],
      name: [school?.name || '', Validators.required],
      location: [school?.location || '', Validators.required],
      principalId: [school?.principal?.id || null, Validators.required], // Corrected: school.principal.id
      email: [school?.email || '', [Validators.required, Validators.email]],
      phone: [school?.phone || ''],
      // establishedDate: [school?.establishedDate ? new Date(school.establishedDate).toISOString().split('T')[0] : ''] // If School model has establishedDate
    });
  }

  loadSchools(): void {
    this.schoolsSubscription = this.superAdminDataService.getSchools().subscribe(
      data => {
        this.schools = data;
        this.allSchoolsForFilter = [{ id: 0, name: 'All Schools', location: '' }, ...data]; // Placeholder for 'All'
        this.reportTabTotalSchools = data.length;
      },
      err => this.snackbarService.show('Failed to load schools.', 'error')
    );
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
      this.snackbarService.show('Please fill all required fields for the school.', 'error');
      return;
    }
    const formValues = this.schoolForm.value;
    const schoolRequestData: CreateSchoolRequest | UpdateSchoolRequest = {
        name: formValues.name,
        location: formValues.location,
        principalId: formValues.principalId // Ensure this is a number if API expects number
    };

    if (this.editingSchool && this.editingSchool.id) {
        this.superAdminDataService.updateSchool(this.editingSchool.id, schoolRequestData as UpdateSchoolRequest).subscribe({
            next: () => {
                this.snackbarService.show('School updated successfully!', 'success');
                this.loadSchools();
                this.closeSchoolModal();
            },
            error: (err) => this.snackbarService.show(`Error updating school: ${err.message || 'Unknown error'}`, 'error')
        });
    } else {
        this.superAdminDataService.createSchool(schoolRequestData as CreateSchoolRequest).subscribe({
            next: () => {
                this.snackbarService.show('School created successfully!', 'success');
                this.loadSchools();
                this.closeSchoolModal();
            },
            error: (err) => this.snackbarService.show(`Error creating school: ${err.message || 'Unknown error'}`, 'error')
        });
    }
  }
  confirmDeleteSchool(school: School): void {
    if (confirm(`Are you sure you want to delete ${school.name}?`)) {
        this.superAdminDataService.deleteSchool(school.id).subscribe({
            next: () => {
                this.snackbarService.show('School deleted successfully!', 'success');
                this.loadSchools();
            },
            error: (err) => this.snackbarService.show(`Error deleting school: ${err.message || 'Unknown error'}`, 'error')
        });
    }
  }


  // --- Principal (Admin User) Management ---
  initPrincipalForm(principal?: User): void { // User type from core/models
    this.principalForm = this.fb.group({
      id: [principal?.id || null],
      username: [principal?.username || '', Validators.required],
      firstName: [principal?.firstName || '', Validators.required],
      lastName: [principal?.lastName || '', Validators.required],
      email: [principal?.email || '', [Validators.required, Validators.email]],
      password: [''], // Optional: only for create, or if changing
      phoneNumber: [principal?.phoneNumber || ''],
      schoolId: [principal?.schoolId || null, Validators.required],
      enabled: [principal?.enabled === undefined ? true : principal.enabled, Validators.required]
    });
  }

  loadPrincipals(): void {
    this.principalsSubscription = this.superAdminDataService.getPrincipals().subscribe(
      data => {
        this.principals = data;
        this.reportTabTotalPrincipals = data.length;
      },
      err => this.snackbarService.show('Failed to load principals.', 'error')
    );
  }

  openPrincipalModal(principal: User | null = null): void {
    this.editingPrincipal = principal;
    this.initPrincipalForm(principal || undefined);
    if (principal) { // Don't require password for edit unless it's being changed
        this.principalForm.get('password')?.clearValidators();
        this.principalForm.get('password')?.updateValueAndValidity();
    } else { // Require password for new principal
        this.principalForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.principalForm.get('password')?.updateValueAndValidity();
    }
    this.principalModal?.show();
  }
  closePrincipalModal(): void {
    this.principalModal?.hide();
    this.editingPrincipal = null;
    this.principalForm.reset({enabled: true, schoolId: null});
  }
  submitPrincipalForm(): void {
    if (this.principalForm.invalid) {
      this.snackbarService.show('Please fill all required fields for the principal.', 'error');
      return;
    }
    const formValues = this.principalForm.value;

    if (this.editingPrincipal && this.editingPrincipal.id) {
        const principalUpdateData: Partial<User> = {
            username: formValues.username,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber,
            schoolId: formValues.schoolId,
            enabled: formValues.enabled,
            // Do not send password if not changed
        };
        if (formValues.password) { // Only include password if a new one is entered
            // principalUpdateData.password = formValues.password; // UserDTO might not have password directly
            this.snackbarService.show('Password update not directly supported via this user update. Use dedicated password change if available.', 'info');
            // Or, if UserDTO allows password for update, include it. For now, assuming it does not.
        }
        this.superAdminDataService.updateUser(this.editingPrincipal.id, principalUpdateData).subscribe({
            next: () => {
                this.snackbarService.show('Principal updated successfully!', 'success');
                this.loadPrincipals();
                this.closePrincipalModal();
            },
            error: (err) => this.snackbarService.show(`Error updating principal: ${err.message || 'Unknown error'}`, 'error')
        });
    } else { // Creating new principal
        const principalCreateData: CreatePrincipalRequest = {
            username: formValues.username,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            password: formValues.password,
            phoneNumber: formValues.phoneNumber,
            schoolId: formValues.schoolId,
            role: 'ADMIN' // Fixed role for this form
        };
        this.superAdminDataService.createPrincipal(principalCreateData).subscribe({
            next: () => {
                this.snackbarService.show('Principal created successfully!', 'success');
                this.loadPrincipals();
                this.closePrincipalModal();
            },
            error: (err) => this.snackbarService.show(`Error creating principal: ${err.message || 'Unknown error'}`, 'error')
        });
    }
  }
  confirmDeletePrincipal(principal: User): void {
    if (confirm(`Are you sure you want to delete principal ${principal.firstName} ${principal.lastName}?`)) {
        this.superAdminDataService.deleteUser(principal.id).subscribe({
            next: () => {
                this.snackbarService.show('Principal deleted successfully!', 'success');
                this.loadPrincipals();
            },
            error: (err) => this.snackbarService.show(`Error deleting principal: ${err.message || 'Unknown error'}`, 'error')
        });
    }
  }

  // --- Student Management ---
  loadStudents(): void {
    this.studentsSubscription = this.superAdminDataService.getStudents().subscribe(
        data => {
            this.students = data;
            this.reportTabTotalStudents = data.length;
        },
        err => this.snackbarService.show('Failed to load students.', 'error')
    );
  }

  filterStudentsBySchool(event: Event): void {
    const schoolId = (event.target as HTMLSelectElement).value;
    this.selectedSchoolFilter = schoolId === '' ? null : schoolId;

    // getStudents now returns User[], so allStudents is User[]
    this.superAdminDataService.getStudents().subscribe(allUsers => {
      if (this.selectedSchoolFilter) {
        this.students = allUsers.filter(s => s.schoolId?.toString() === this.selectedSchoolFilter);
      } else {
        this.students = allUsers;
      }
       this.reportTabTotalStudents = this.students.length; // Update count based on filter
    });
  }

  confirmDeleteStudent(student: User): void { // Changed to User
    if (confirm(`Are you sure you want to delete student ${student.firstName} ${student.lastName}?`)) {
        this.superAdminDataService.deleteUser(student.id).subscribe({
            next: () => {
                this.snackbarService.show('Student deleted successfully!', 'success');
                this.loadStudents();
            },
            error: (err) => this.snackbarService.show(`Error deleting student: ${err.message || 'Unknown error'}`, 'error')
        });
    }
  }

  toggleStudentStatus(student: User): void {
    if (!student || student.id === undefined) {
      this.snackbarService.show('Cannot update status: Invalid student data.', 'error');
      return;
    }
    const newStatus = !student.enabled;
    this.superAdminDataService.setUserStatus(student.id, newStatus).subscribe({
      next: (updatedUser) => {
        this.snackbarService.show(`Student ${updatedUser.firstName} ${updatedUser.lastName} status updated to ${newStatus ? 'Enabled' : 'Disabled'}.`, 'success');
        this.loadStudents(); // Refresh the list
      },
      error: (err) => this.snackbarService.show(`Error updating student status: ${err.message || 'Unknown error'}`, 'error')
    });
  }
  // End Student Management (was mislabeled Teacher Stats)

  // --- Teacher Stats / Management --- (Correcting comment)
  loadTeachers(): void {
      this.teachersSubscription = this.superAdminDataService.getTeachers().subscribe(
          data => {
              this.allTeachers = data;
              this.reportTabTotalTeachers = data.length;
          },
          err => this.snackbarService.show('Failed to load teachers for stats.', 'error')
      );
  }

  // updateOverviewStats is no longer needed as stats come directly from dashboardOverviewStats or list lengths
  // updateOverviewStats(): void { ... }

  // --- Teacher Management (Uses UserDTO) ---
  initTeacherForm(teacher?: User): void { // Parameter is User
    this.teacherForm = this.fb.group({
      id: [teacher?.id || null], // This is the User ID
      username: [teacher?.username || '', Validators.required],
      firstName: [teacher?.firstName || '', Validators.required],
      lastName: [teacher?.lastName || '', Validators.required],
      email: [teacher?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [teacher?.phoneNumber || ''],
      enabled: [teacher?.enabled === undefined ? true : teacher.enabled, Validators.required],
      password: [''], // For creating new user, or if password change is allowed
      schoolId: [teacher?.schoolId || null] // Optional: if SuperAdmin assigns school to teacher directly
      // Subjects are not part of UserDTO, so removed from this form.
      // Managing teacher subjects would require a separate UI/API call to TeacherProfile endpoints.
    });
  }

  openTeacherModal(teacher: User | null = null): void { // Parameter is User
    this.editingTeacher = teacher;
    this.initTeacherForm(teacher || undefined);
    if (teacher) {
        this.teacherForm.get('password')?.clearValidators();
        this.teacherForm.get('password')?.updateValueAndValidity();
    } else { // Require password for new teacher user
        this.teacherForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.teacherForm.get('password')?.updateValueAndValidity();
    }
    this.teacherModal?.show();
  }

  closeTeacherModal(): void {
    this.teacherModal?.hide();
    this.editingTeacher = null;
    this.teacherForm.reset({enabled: true, schoolId: null});
  }

  // get subjectFormArray(): FormArray { ... } // Removed
  // addSubjectToTeacherForm(): void { ... } // Removed
  // removeSubjectFromTeacherForm(index: number): void { ... } // Removed

  submitTeacherForm(): void {
    if (this.teacherForm.invalid) {
      this.snackbarService.show('Please fill all required fields for the teacher user.', 'error');
      return;
    }
    const formValues = this.teacherForm.value;

    if (this.editingTeacher && this.editingTeacher.id) { // Editing existing User (Teacher)
      const userUpdateData: Partial<User> = {
        username: formValues.username,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        enabled: formValues.enabled,
        schoolId: formValues.schoolId // If SuperAdmin can set/change school for a teacher user
        // Password update would typically be a separate process or require current password.
        // Not including formValues.password here unless explicitly intended for UserDTO update.
      };
      this.superAdminDataService.updateUser(this.editingTeacher.id, userUpdateData).subscribe({
        next: () => {
          this.snackbarService.show('Teacher user details updated successfully!', 'success');
          this.loadTeachers();
          this.closeTeacherModal();
        },
        error: (err) => this.snackbarService.show(`Error updating teacher user details: ${err.message || 'Unknown error'}`, 'error')
      });
    } else { // Creating a new User with role TEACHER
      const newTeacherUserData: Omit<User, 'id'> = { // Or a specific CreateTeacherUserRequestDTO if API expects it
        username: formValues.username,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password, // Assuming generic addUser can take password
        phoneNumber: formValues.phoneNumber,
        enabled: formValues.enabled,
        role: 'TEACHER', // Set role
        schoolId: formValues.schoolId
      };
      // Assuming SuperAdminDataService.addUser handles creation of a user with a role.
      // The existing `createTeacherByAdmin` or a generic `createUser` in service would be better.
      // For now, using generic `addUser` and hoping backend sets role if it's part of User DTO for create.
      // This part needs specific API endpoint for creating user with role by SuperAdmin.
      // Using POST /api/admin/teachers might be more appropriate if SuperAdmin can use it.
      // Let's assume we need a CreateUserWithRole DTO for addUser or use createTeacherByAdmin if available.
      // For now, this will likely fail if `addUser` doesn't support role assignment.
      this.superAdminDataService.addUser(newTeacherUserData as User).subscribe({ // Cast needed as Omit<User,'id'>
        next: () => {
          this.snackbarService.show('New teacher user created successfully!', 'success');
          this.loadTeachers();
          this.closeTeacherModal();
        },
        error: (err) => this.snackbarService.show(`Error creating new teacher user: ${err.message || 'Unknown error'}`, 'error')
      });
    }
  }

  confirmDeleteTeacher(teacher: User): void { // Parameter is User
    if (confirm(`Are you sure you want to delete teacher ${teacher.firstName} ${teacher.lastName}? This will delete their user account.`)) {
      this.superAdminDataService.deleteUser(teacher.id).subscribe({
        next: () => {
          this.snackbarService.show('Teacher user account deleted successfully!', 'success');
          this.loadTeachers();
        },
        error: (err) => this.snackbarService.show(`Error deleting teacher user account: ${err.message || 'Unknown error'}`, 'error')
      });
    }
  }

  toggleTeacherStatus(teacher: User): void { // Parameter is User
    if (!teacher || teacher.id === undefined) {
      this.snackbarService.show('Cannot update status: Invalid teacher data.', 'error');
      return;
    }
    const newStatus = !teacher.enabled;
    this.superAdminDataService.setUserStatus(teacher.id, newStatus).subscribe({
      next: (updatedUser) => {
        this.snackbarService.show(`Teacher ${updatedUser.firstName} ${updatedUser.lastName} status updated to ${newStatus ? 'Enabled' : 'Disabled'}.`, 'success');
        this.loadTeachers();
      },
      error: (err) => this.snackbarService.show(`Error updating teacher status: ${err.message || 'Unknown error'}`, 'error')
    });
  }
  // End Teacher Management

  protected override hasAccess(userRole: string): boolean {
    return userRole === 'SUPER_ADMIN';
  }

  onThemeColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.selectThemeColor(color); // Call method from BaseDashboardComponent
  }

  // Old selectTheme(themeName: string) method removed as it's replaced by color picker.

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