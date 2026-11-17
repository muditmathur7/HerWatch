import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { UserService } from '../../core/services/user.service';
import { SosService, SOSAlert } from '../../core/services/sos.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  username = 'User';
  confirmingSOS = signal(false);
  countdown = signal(5);
  activeSOS = signal<SOSAlert | null>(null);

  locationStatus = '';
  watchId: number | null = null;
  private timer: any;

  // Disarm modal state
  showDisarmModal = false;
  disarmPin = '';
  disarmError = '';
  isDisarming = false;

  quickHelplines = [
    { name: 'Police', number: '112', icon: 'fas fa-shield-alt' },
    { name: 'Women Helpline', number: '1091', icon: 'fas fa-female' },
    { name: 'Ambulance', number: '102', icon: 'fas fa-ambulance' }
  ];

  constructor(
    private userService: UserService,
    private sosService: SosService
  ) {
    const user = this.userService.getUser();
    this.username = user?.name || user?.firstName || user?.username || 'User';
  }

  ngOnInit(): void {
    // 1. Fetch fresh user profile
    this.userService.fetchProfile().subscribe({
      next: (user) => {
        this.username = user?.name || user?.firstName || user?.username || 'User';
      },
      error: () => {}
    });

    // 2. Check if an emergency SOS is currently active
    this.sosService.getActiveSOS().subscribe({
      next: (alert) => {
        if (alert && alert.status === 'ACTIVE') {
          this.activeSOS.set(alert);
          this.startLocationWatcher(alert.id);
        }
      },
      error: (err) => console.error('Failed to check active SOS', err)
    });
  }

  onSOSClick(): void {
    if (!this.confirmingSOS()) {
      this.confirmingSOS.set(true);
      this.countdown.set(5);

      this.timer = setInterval(() => {
        this.countdown.update((c) => c - 1);
        if (this.countdown() <= 0) {
          this.cancelConfirm();
        }
      }, 1000);

      return;
    }

    this.triggerSOS();
  }

  private triggerSOS(): void {
    clearInterval(this.timer);
    this.confirmingSOS.set(false);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.sendSOS(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Send SOS even without GPS
          this.sendSOS(undefined, undefined);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      this.sendSOS(undefined, undefined);
    }
  }

  private sendSOS(latitude?: number, longitude?: number): void {
    this.sosService.triggerSOS({ latitude, longitude }).subscribe({
      next: (alert) => {
        this.activeSOS.set(alert);
        this.startLocationWatcher(alert.id);
      },
      error: (err) => {
        alert('Failed to send SOS: ' + (err.error?.detail || 'Network error'));
      }
    });
  }

  private startLocationWatcher(sosId: number): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    this.stopLocationWatcher();

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.sosService.pingLocation(sosId, {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed || undefined
        }).subscribe();
      },
      (err) => console.warn('Location watcher error', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  }

  private stopLocationWatcher(): void {
    if (this.watchId !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  openDisarmModal(): void {
    this.showDisarmModal = true;
    this.disarmPin = '';
    this.disarmError = '';
  }

  closeDisarmModal(): void {
    this.showDisarmModal = false;
  }

  confirmDisarm(): void {
    const active = this.activeSOS();
    if (!active) return;

    this.isDisarming = true;
    this.disarmError = '';

    this.sosService.resolveSOS(active.id, this.disarmPin).subscribe({
      next: () => {
        this.isDisarming = false;
        this.showDisarmModal = false;
        this.stopLocationWatcher();
        this.activeSOS.set(null);
      },
      error: (err) => {
        this.isDisarming = false;
        this.disarmError = err.error?.detail || 'Incorrect PIN. Unable to disarm.';
      }
    });
  }

  private cancelConfirm(): void {
    clearInterval(this.timer);
    this.confirmingSOS.set(false);
  }

  shareLocation(): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.locationStatus = 'Geolocation is not supported by your browser.';
      return;
    }

    this.locationStatus = 'Fetching GPS coordinates...';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        this.locationStatus = `Live Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        if (navigator.share) {
          navigator.share({
            title: 'HERWATCH - My Live Emergency Location',
            text: `I am sharing my current location for safety: ${mapsUrl}`,
            url: mapsUrl
          }).catch(() => {});
        } else {
          // Copy to clipboard
          navigator.clipboard?.writeText(mapsUrl);
          this.locationStatus += ' (Map link copied to clipboard!)';
        }
      },
      () => {
        this.locationStatus = 'Unable to retrieve location. Please grant permission.';
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.stopLocationWatcher();
  }
}
