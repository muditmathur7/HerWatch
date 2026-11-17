import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SosService, SOSTrackingDetail, LocationLog } from '../../core/services/sos.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-track',
  imports: [CommonModule],
  templateUrl: './track.html',
  styleUrl: './track.css'
})
export class TrackComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private route = inject(ActivatedRoute);
  private sosService = inject(SosService);

  sosId = 0;
  trackingDetail: SOSTrackingDetail | null = null;
  isLoading = true;
  errorMessage = '';

  latestLat = 28.6139;
  latestLng = 77.2090;
  elapsedTime = 'Just now';

  private map: any = null;
  private marker: any = null;
  private breadcrumbPolyline: any = null;
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private timerInterval: any = null;
  private L: any = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('sosId');
    if (idParam) {
      this.sosId = parseInt(idParam, 10);
      this.loadTrackingData();
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    const leafletModule = await import('leaflet');
    this.L = leafletModule.default || leafletModule;
  }

  loadTrackingData(): void {
    this.sosService.getTrackingDetail(this.sosId).subscribe({
      next: (detail) => {
        this.trackingDetail = detail;
        this.isLoading = false;

        if (detail.recentLocations && detail.recentLocations.length > 0) {
          const first = detail.recentLocations[0];
          this.latestLat = first.latitude;
          this.latestLng = first.longitude;
        } else if (detail.alert.initialLatitude && detail.alert.initialLongitude) {
          this.latestLat = detail.alert.initialLatitude;
          this.latestLng = detail.alert.initialLongitude;
        }

        if (this.isBrowser && this.L) {
          this.initMap();
        } else if (this.isBrowser) {
          // Wait briefly for Leaflet dynamic load if needed
          setTimeout(() => this.initMap(), 400);
        }

        this.connectWebSocket();
        this.startElapsedTimer();
        this.playEmergencyAlertSound();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Unable to load emergency tracking details. The alert may be resolved.';
      }
    });
  }

  private initMap(): void {
    if (!this.L || this.map) return;

    this.map = this.L.map('track-map', {
      center: [this.latestLat, this.latestLng],
      zoom: 16
    });

    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Victim marker icon
    const victimIcon = this.L.divIcon({
      className: 'victim-location-marker',
      html: `
        <div class="victim-pin-wrap">
          <div class="victim-pulse"></div>
          <div class="victim-dot"><i class="fas fa-exclamation"></i></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.marker = this.L.marker([this.latestLat, this.latestLng], { icon: victimIcon })
      .bindPopup(`<b>${this.trackingDetail?.alert.userName || 'Victim'}</b><br>LIVE Moving Location`)
      .addTo(this.map);

    // Draw past breadcrumb trail
    if (this.trackingDetail?.recentLocations) {
      const coords = this.trackingDetail.recentLocations.map((l: LocationLog) => [l.latitude, l.longitude]);
      this.breadcrumbPolyline = this.L.polyline(coords, {
        color: '#ff3b30',
        weight: 4,
        opacity: 0.8
      }).addTo(this.map);
    }
  }

  private connectWebSocket(): void {
    if (!this.isBrowser) return;

    try {
      const wsUrl = `${environment.wsUrl}/sos/${this.sosId}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'location_update') {
            this.updateLivePosition(data.latitude, data.longitude);
          } else if (data.event === 'sos_resolved') {
            if (this.trackingDetail) {
              this.trackingDetail.alert.status = 'RESOLVED';
            }
          }
        } catch (e) {
          console.warn('WS message parse error', e);
        }
      };
    } catch (e) {
      console.warn('WS connection failed', e);
    }
  }

  private updateLivePosition(lat: number, lng: number): void {
    this.latestLat = lat;
    this.latestLng = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
    if (this.map) {
      this.map.panTo([lat, lng]);
    }
    if (this.breadcrumbPolyline) {
      this.breadcrumbPolyline.addLatLng([lat, lng]);
    }
  }

  getGoogleMapsDirectionsUrl(): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${this.latestLat},${this.latestLng}`;
  }

  private playEmergencyAlertSound(): void {
    if (!this.isBrowser) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      // Alarm frequency alternating between 800Hz and 1000Hz
      osc.frequency.setValueAtTime(850, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, this.audioContext.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(850, this.audioContext.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + 1.2);
    } catch (e) {
      // Audio autoplay might require user interaction in some browsers
    }
  }

  private startElapsedTimer(): void {
    const started = new Date(this.trackingDetail?.alert.startedAt || new Date()).getTime();

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diffSecs = Math.floor((now - started) / 1000);
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;
      this.elapsedTime = `${mins}m ${secs}s ago`;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.ws) this.ws.close();
    if (this.map) this.map.remove();
    if (this.audioContext) this.audioContext.close().catch(() => {});
  }
}
