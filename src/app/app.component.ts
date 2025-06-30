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
    // ThemeService constructor now handles initial theme load by subscribing to currentUser$
    // So, explicit call here on init might be redundant if currentUser$ emits synchronously
    // or if initial state is handled well by the service's subscription.
    // ThemeService constructor subscribes to currentUser$ for initial load and login.
    if (!this.authService.isAuthenticated()) {
      this.themeService.applyDefaultTheme(); // Ensure default for initially logged-out state
    }

    // Subscribe to login/logout events to change theme dynamically
    this.authService.authenticationChanged.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Theme is applied via ThemeService's subscription to currentUser$
        // No explicit call needed here as currentUser$ will emit.
        // this.themeService.applyThemeForAuthenticatedUser(); // This would be redundant
      } else {
        // On logout, ThemeService's currentUser$ subscription will receive null
        // and apply default. Explicitly calling applyDefaultTheme ensures it.
        this.themeService.applyDefaultTheme();
      }
    });
  }
}