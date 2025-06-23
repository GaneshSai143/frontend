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
    // However, keeping a call tied to `isAuthenticated` can be a safeguard.
    if (this.authService.isAuthenticated()) {
      this.themeService.applyThemeForAuthenticatedUser();
    } else {
      this.themeService.applyTheme('DEFAULT'); // Ensure default for logged-out state
    }

    // Subscribe to login/logout events to change theme dynamically
    this.authService.authenticationChanged.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.themeService.applyThemeForAuthenticatedUser();
      } else {
        // On logout, ThemeService's currentUser$ subscription will receive null
        // and apply 'DEFAULT'. We can also be explicit here.
        this.themeService.applyTheme('DEFAULT');
      }
    });
  }
}