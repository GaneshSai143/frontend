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
  submitted = false;
  carouselSlides: any[] = [];

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

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    // Redirect if already logged inc
    console.log(this.authService.isAuthenticated()+'Ganesh'+'login');
    if (this.authService.isAuthenticated()) {
      this.navigateByRole();
    }
    this.carouselSlides = [
      { image: 'assets/images/carousel-1.png', alt: 'Empowering Students', description: 'Empowering Students' },
      { image: 'assets/images/carousel-2.png', alt: 'Real-time Performance Tracking', description: 'Real-time Performance Tracking' },
      { image: 'assets/images/carousel-3.png', alt: 'Seamless Communication', description: 'Seamless Communication' }
    ];
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    
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
        this.router.navigate(['/dashboard/super-admin']);
        break;
      case 'ADMIN':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'TEACHER':
        this.router.navigate(['/dashboard/teacher']);
        break;
        case 'STUDENT':
        this.router.navigate(['/dashboard/student']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
} 