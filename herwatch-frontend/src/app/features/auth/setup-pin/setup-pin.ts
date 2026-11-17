import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-setup-pin',
  imports: [CommonModule, FormsModule],
  templateUrl: './setup-pin.html',
  styleUrl: './setup-pin.css'
})
export class SetupPinComponent {
  pin = '';
  confirmPin = '';
  error = '';
  isLoading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit() {
    if (this.pin !== this.confirmPin) {
      this.error = 'PINs do not match';
      return;
    }
    if (this.pin.length !== 4 || isNaN(Number(this.pin))) {
      this.error = 'PIN must be exactly 4 digits';
      return;
    }
    this.error = '';
    this.isLoading = true;
    this.auth.updateSignupData({ pin: this.pin });

    this.auth.completeRegistration().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/terms']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }
}
