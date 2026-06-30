import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {
  newReport = { type: '', location: '', description: '' };
  reports: { type: string; location: string; description: string }[] = [];

  submitReport() {
    this.reports.push({ ...this.newReport });
    this.newReport = { type: '', location: '', description: '' };
    // TODO: persist to backend
  }
}