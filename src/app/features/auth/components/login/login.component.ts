import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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