import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ReportService, IncidentReport, IncidentCreate, HotspotZone } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  newReport: IncidentCreate = {
    incidentType: '',
    locationName: '',
    description: '',
    severity: 'Medium',
    latitude: undefined,
    longitude: undefined
  };

  reports: IncidentReport[] = [];
  hotspots: HotspotZone[] = [];
  isLoading = false;
  isSubmitting = false;
  locationStatus = '';
  errorMessage = '';
  successMessage = '';

  incidentTypes = [
    'Harassment',
    'Stalking',
    'Unlit / Dark Street',
    'Theft / Snatching',
    'Suspicious Activity',
    'Unsafe Transport',
    'Other Safety Concern'
  ];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load incident reports', err);
      }
    });

    this.reportService.getHotspots().subscribe({
      next: (spots) => {
        this.hotspots = spots;
      },
      error: (err) => {
        console.error('Failed to load safety hotspots', err);
      }
    });
  }

  detectLocation(): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.locationStatus = 'Geolocation is not supported by your browser.';
      return;
    }

    this.locationStatus = 'Detecting GPS location...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.newReport.latitude = pos.coords.latitude;
        this.newReport.longitude = pos.coords.longitude;
        this.locationStatus = `GPS Attached: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        if (!this.newReport.locationName) {
          this.newReport.locationName = `Near ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        }
      },
      () => {
        this.locationStatus = 'Unable to get GPS location. Please type manually.';
      }
    );
  }

  submitReport(): void {
    if (!this.newReport.incidentType || !this.newReport.locationName || !this.newReport.description) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.reportService.submitReport(this.newReport).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.reports.unshift(created);
        this.successMessage = 'Incident reported successfully. Thank you for making our community safer!';
        this.newReport = {
          incidentType: '',
          locationName: '',
          description: '',
          severity: 'Medium',
          latitude: undefined,
          longitude: undefined
        };
        this.locationStatus = '';
        setTimeout(() => (this.successMessage = ''), 4000);
        // Refresh hotspots
        this.reportService.getHotspots().subscribe((spots) => (this.hotspots = spots));
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.detail || 'Failed to submit incident report. Please try again.';
      }
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'severity-high';
      case 'low':
        return 'severity-low';
      default:
        return 'severity-medium';
    }
  }
}
