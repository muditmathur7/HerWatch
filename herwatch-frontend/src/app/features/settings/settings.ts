import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  notifications = true;
  showAbout = false;
  showChangePassword = false;

  currentPassword = '';
  newPassword = '';
  passwordError = '';
  passwordSuccess = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private storage: StorageService) {}

  get darkMode(): boolean {
    if (this.isBrowser) {
      return document.body.classList.contains('dark-mode');
    }
    return false;
  }

  toggleDarkMode(checked: boolean) {
    if (this.isBrowser) {
      document.body.classList.toggle('dark-mode', checked);
      this.storage.setItem('herwatch_dark_mode', checked);
    }
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword) {
      this.passwordError = 'Please fill both fields';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters long';
      return;
    }

    this.isSubmitting = true;
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.passwordSuccess = res.message || 'Password updated successfully!';
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.passwordError = err.error?.detail || 'Current password is incorrect';
      }
    });
  }
}
