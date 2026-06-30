import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  notifications = true;
  showAbout = false;
  showChangePassword = false;

  currentPassword = '';
  newPassword = '';
  passwordError = '';
  passwordSuccess = '';

  constructor(private auth: AuthService, private storage: StorageService) {}

  get darkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  toggleDarkMode(checked: boolean) {
    document.body.classList.toggle('dark-mode', checked);
    this.storage.setItem('herwatch_dark_mode', checked);
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword) {
      this.passwordError = 'Please fill both fields';
      return;
    }

    const success = this.auth.changePassword(this.currentPassword, this.newPassword);
    if (success) {
      this.passwordSuccess = 'Password updated successfully';
      this.currentPassword = '';
      this.newPassword = '';
    } else {
      this.passwordError = 'Current password is incorrect';
    }
  }
}