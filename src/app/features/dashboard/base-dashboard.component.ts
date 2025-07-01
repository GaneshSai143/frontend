import { Component, OnInit, HostListener, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { ThemeService } from '../../core/services/theme.service'; // Import ThemeService
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  template: '' // No template here, subclasses will have their own
})
export abstract class BaseDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  isMobileView = false;
  showMobileSidebar = false; // For controlling overlay sidebar on mobile

  // Property to bind to the color picker input
  currentThemeColor: string = ''; // Initialize with a default or from ThemeService

  private resizeListener!: () => void;
  private themeSubscription!: Subscription; // To update currentThemeColor if theme changes elsewhere

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected renderer: Renderer2,
    protected el: ElementRef,
    protected themeService: ThemeService // Inject ThemeService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkAccess();
    this.checkIfMobileView();

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.checkIfMobileView();
    });

    // Initialize currentThemeColor and subscribe to future changes
    const initialUser = this.authService.getCurrentUser();
    this.currentThemeColor = initialUser?.preferredTheme || '#2c3e50'; // Use known default

    this.themeSubscription = this.authService.currentUser$.subscribe(user => {
        this.currentThemeColor = user?.preferredTheme || '#2c3e50'; // Use known default
    });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  selectThemeColor(colorCode: string): void {
    this.themeService.setTheme(colorCode);
    // currentThemeColor will update via the currentUser$ subscription after theme is saved and user re-emitted
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  private checkAccess(): void {
    const userRole = this.authService.getUserRole();
    if (!userRole || !this.hasAccess(userRole)) {
      this.router.navigate(['/unauthorized']); // Or appropriate error page
    }
  }

  protected abstract hasAccess(userRole: string): boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.checkIfMobileView();
  }

  private checkIfMobileView(): void {
    const mobileBreakpoint = 768; // Matches SCSS
    this.isMobileView = window.innerWidth <= mobileBreakpoint;
    if (!this.isMobileView && this.showMobileSidebar) {
      // If resizing from mobile to desktop and mobile sidebar was open, close it
      this.showMobileSidebar = false;
      this.toggleBodyScroll(true); // Ensure body scroll is enabled
    } else if (this.isMobileView && !this.showMobileSidebar) {
        // If resizing to mobile and sidebar was collapsed, ensure it's not using desktop collapse style
        // this.isSidebarCollapsed = false; // Let mobile logic handle it
    }
  }

  toggleSidebar(): void {
    if (this.isMobileView) {
      this.showMobileSidebar = !this.showMobileSidebar;
      this.toggleBodyScroll(!this.showMobileSidebar);
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeMobileSidebar(): void { // Specifically for closing via overlay click or nav
    if (this.isMobileView && this.showMobileSidebar) {
      this.showMobileSidebar = false;
      this.toggleBodyScroll(true);
    }
  }

  private toggleBodyScroll(enable: boolean): void {
    if (enable) {
      this.renderer.removeClass(document.body, 'no-scroll');
    } else {
      this.renderer.addClass(document.body, 'no-scroll');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }
} 