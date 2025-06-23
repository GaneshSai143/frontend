import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'School Management System';

  constructor(
    private themeService: ThemeService,
    private authService: AuthService // To check initial login state
  ) {}

  ngOnInit(): void {
    // Apply theme on initial app load based on current auth state
    // This handles scenarios where the user is already logged in (e.g. page refresh)
    if (this.authService.isAuthenticated()) {
      this.themeService.applyThemeForCurrentUser();
    } else {
      // Optional: Apply a default theme or clear theme for login page
      // this.themeService.setTheme('DEFAULT'); // Or a specific login page theme
    }

    // Subscribe to login/logout events to change theme dynamically
    this.authService.authenticationChanged.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.themeService.applyThemeForCurrentUser();
      } else {
        this.themeService.clearTheme(); // Or set a default/login theme
        // this.themeService.setTheme('DEFAULT');
      }
    });
  }
}