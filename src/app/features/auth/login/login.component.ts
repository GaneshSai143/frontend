import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.navigateByRole();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.navigateByRole();
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred during login';
        this.loading = false;
      }
    });
  }

  private navigateByRole(): void {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'SUPER_ADMIN':
        this.router.navigate(['/super-admin-dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher-dashboard']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student-dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
} 