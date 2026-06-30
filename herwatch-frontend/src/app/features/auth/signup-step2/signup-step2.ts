import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup-step2',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup-step2.html',
  styleUrl: './signup-step2.css'
})
export class SignupStep2Component {
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  onNext() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.error = '';
    this.auth.updateSignupData({ email: this.email, password: this.password });
    this.router.navigate(['/create-username']);
  }
}