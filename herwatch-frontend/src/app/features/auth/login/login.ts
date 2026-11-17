import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
    this.error = '';
    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || 'Invalid email or password. Please try again.';
      }
    });
  }
}
