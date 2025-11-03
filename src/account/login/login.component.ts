import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth/auth.service';
import { LucideAngularModule, LogIn, Building2, User, Lock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  // Lucide icons
  readonly LogIn = LogIn;
  readonly Building2 = Building2;
  readonly User = User;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/booking']);
    }

    this.loginForm = this.fb.group({
      tenant: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { tenant, username, password, rememberMe } = this.loginForm.value;

    this.authService.login(tenant, username, password, rememberMe).subscribe({
      next: (response) => {
        if (response != null) {
          this.router.navigate(['/booking']);
          this.isLoading = false;
        } else {
          this.errorMessage = 'Login failed. Please review your credentials and try again.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.error?.message) {
          this.errorMessage = error.error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please check your tenant, username, and password.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      tenant: 'Tenant',
      username: 'Username',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }
}
