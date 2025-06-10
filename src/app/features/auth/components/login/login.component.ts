import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Login Form Side -->
        <div class="col-md-6 d-flex align-items-center justify-content-center">
          <div class="card shadow-lg" style="width: 400px;">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Login</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [ngClass]="{'is-invalid': loginForm.get('username')?.invalid && loginForm.get('username')?.touched}"
                  >
                  <div class="invalid-feedback" *ngIf="loginForm.get('username')?.errors?.['required']">
                    Username is required
                  </div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [ngClass]="{'is-invalid': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
                  >
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required']">
                    Password is required
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  [disabled]="loginForm.invalid"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Carousel Side -->
        <div class="col-md-6 bg-light">
          <div id="loginCarousel" class="carousel slide h-100" data-bs-ride="carousel">
            <div class="carousel-inner h-100">
              <div class="carousel-item active h-100">
                <img src="assets/images/school1.jpg" class="d-block w-100 h-100 object-fit-cover" alt="School Image 1">
              </div>
              <div class="carousel-item h-100">
                <img src="assets/images/school2.jpg" class="d-block w-100 h-100 object-fit-cover" alt="School Image 2">
              </div>
              <div class="carousel-item h-100">
                <img src="assets/images/school3.jpg" class="d-block w-100 h-100 object-fit-cover" alt="School Image 3">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .object-fit-cover {
      object-fit: cover;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialize carousel
    const carousel = document.getElementById('loginCarousel');
    if (carousel) {
      new bootstrap.Carousel(carousel, {
        interval: 5000
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // TODO: Implement login logic
      console.log('Form submitted:', this.loginForm.value);
      // Navigate to dashboard after successful login
      this.router.navigate(['/dashboard']);
    }
  }
} 