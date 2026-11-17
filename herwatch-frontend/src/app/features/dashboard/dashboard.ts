import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string;
  confirmingSOS = signal(false);
  countdown = signal(5);
  locationStatus = '';
  private timer: any;

  constructor(private userService: UserService) {
    const user = this.userService.getUser();
    this.username = user?.name || user?.firstName || user?.username || 'User';
  }

  ngOnInit(): void {
    this.userService.fetchProfile().subscribe({
      next: (user) => {
        this.username = user?.name || user?.firstName || user?.username || 'User';
      },
      error: () => {
        // Silently continue with cached username if offline
      }
    });
  }

  onSOSClick() {
    if (!this.confirmingSOS()) {
      this.confirmingSOS.set(true);
      this.countdown.set(5);

      this.timer = setInterval(() => {
        this.countdown.update(c => c - 1);
        if (this.countdown() <= 0) {
          this.cancelConfirm();
        }
      }, 1000);

      return;
    }

    this.triggerSOS();
  }

  private triggerSOS() {
    clearInterval(this.timer);
    this.confirmingSOS.set(false);
    // TODO: send real SOS alert to backend once available
    alert('SOS Alert Sent!');
  }

  private cancelConfirm() {
    clearInterval(this.timer);
    this.confirmingSOS.set(false);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  shareLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.locationStatus = 'Geolocation is not supported by your browser';
      return;
    }

    this.locationStatus = 'Fetching your location...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.locationStatus = `Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (ready to share once contacts are wired to backend)`;
      },
      () => {
        this.locationStatus = 'Unable to retrieve location. Please allow location access.';
      }
    );
  }
}
