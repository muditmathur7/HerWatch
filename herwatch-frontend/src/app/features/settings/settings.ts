import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent {
  notifications = true;
  showAbout = false;

  get darkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  toggleDarkMode(checked: boolean) {
    document.body.classList.toggle('dark-mode', checked);
  }
}