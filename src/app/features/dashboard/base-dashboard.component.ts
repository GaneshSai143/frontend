import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  template: ''
})
export abstract class BaseDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isSidebarCollapsed = false;

  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkAccess();
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  private checkAccess(): void {
    const userRole = this.authService.getUserRole();
    if (!userRole || !this.hasAccess(userRole)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  protected abstract hasAccess(userRole: string): boolean;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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