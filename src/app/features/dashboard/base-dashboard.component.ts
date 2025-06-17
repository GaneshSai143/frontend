import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/services/auth.service';

@Component({
  template: ''
})
export abstract class BaseDashboardComponent implements OnInit {
  protected currentUser: User | null = null;

  protected constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.checkAccess();
    this.currentUser = this.authService.getCurrentUser();
  }

  protected checkAccess(): void {
    const userRole = this.authService.getUserRole();
    if (!userRole || !this.hasAccess(userRole)) {
      this.router.navigate(['/login']);
    }
  }

  protected abstract hasAccess(userRole: string): boolean;

  logout(): void {
    this.authService.logout();
  }
} 