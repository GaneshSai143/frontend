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
      { image: 'https://cdni.iconscout.com/illustration/premium/thumb/school-girl-saying-good-bye-to-teacher-illustration-download-in-svg-png-gif-file-formats--building-waiving-hand-pack-people-illustrations-3697284.png?f=webp', alt: 'Empowering Students', description: 'Empowering Students' },
      { image: 'https://cdni.iconscout.com/illustration/premium/thumb/girl-reading-book-in-school-library-illustration-download-svg-png-gif-file-formats--student-activities-pack-education-illustrations-3561229.png?f=webp', alt: 'Real-time Performance Tracking', description: 'Real-time Performance Tracking' },
      { image: 'https://cdni.iconscout.com/illustration/premium/thumb/a-group-of-student-standing-together-and-discussing-after-school-illustration-download-in-svg-png-gif-file-formats--backpack-book-boy-characters-study-education-pack-illustrations-1819840.png?f=webp', alt: 'Seamless Communication', description: 'Seamless Communication' }
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
        // If role is unknown or not handled, navigate to a generic dashboard or unauthorized page
        // For now, redirecting to login as a fallback if no specific role match.
        this.authService.logout(); // Clear any partial auth state
        this.router.navigate(['/login']);
        break;
    }
  }
}