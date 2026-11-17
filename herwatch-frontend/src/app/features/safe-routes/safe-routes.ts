import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { RouteService, SafeRouteResponse, RouteOption } from '../../core/services/route.service';
import { ReportService, HotspotZone } from '../../core/services/report.service';

@Component({
  selector: 'app-safe-routes',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './safe-routes.html',
  styleUrl: './safe-routes.css'
})
export class SafeRoutesComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  destinationSearch = 'Central Metro Station';
  userLat = 28.6139;
  userLng = 77.2090;
  destLat = 28.6300;
  destLng = 77.2200;

  isLoadingRoute = false;
  routeData: SafeRouteResponse | null = null;
  selectedRouteType: 'SAFEST' | 'FASTEST' = 'SAFEST';
  isJourneyActive = false;

  private map: any = null;
  private routeLayers: any[] = [];
  private hotspotLayers: any[] = [];
  private markerLayers: any[] = [];
  private L: any = null;

  constructor(
    private routeService: RouteService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    if (this.isBrowser && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.userLat = pos.coords.latitude;
        this.userLng = pos.coords.longitude;
        // Set sample destination slightly north-east of user location
        this.destLat = this.userLat + 0.018;
        this.destLng = this.userLng + 0.015;
        if (this.map) {
          this.map.setView([this.userLat, this.userLng], 14);
          this.drawUserMarker();
        }
      });
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    // Dynamically import Leaflet in browser only to preserve SSR compatibility
    const leafletModule = await import('leaflet');
    this.L = leafletModule.default || leafletModule;

    this.initMap();
    this.loadHotspotsAndPlanRoute();
  }

  private initMap(): void {
    if (!this.L) return;

    this.map = this.L.map('safe-map', {
      center: [this.userLat, this.userLng],
      zoom: 14,
      zoomControl: true
    });

    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.drawUserMarker();
  }

  private drawUserMarker(): void {
    if (!this.L || !this.map) return;

    const userIcon = this.L.divIcon({
      className: 'user-pulse-marker',
      html: '<div class="pulse-dot"></div><div class="pulse-ring"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.L.marker([this.userLat, this.userLng], { icon: userIcon })
      .bindPopup('<b>You are here</b><br>Live GPS Location')
      .addTo(this.map);
  }

  loadHotspotsAndPlanRoute(): void {
    this.reportService.getHotspots().subscribe({
      next: (hotspots) => {
        this.renderHotspotsOnMap(hotspots);
      },
      error: () => {}
    });

    this.calculateRoute();
  }

  private renderHotspotsOnMap(hotspots: HotspotZone[]): void {
    if (!this.L || !this.map) return;

    this.hotspotLayers.forEach((layer) => this.map.removeLayer(layer));
    this.hotspotLayers = [];

    hotspots.forEach((h) => {
      const circleColor = h.riskLevel === 'High' ? '#ff3b30' : h.riskLevel === 'Medium' ? '#ff9500' : '#ffd60a';
      const circle = this.L.circle([h.latitude, h.longitude], {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.35,
        radius: 350
      }).bindPopup(`
        <div style="font-family:sans-serif; min-width:180px;">
          <h4 style="color:#d63031; margin:0 0 4px;">⚠️ ${h.riskLevel} Risk Hotspot</h4>
          <p style="margin:0 0 4px; font-size:13px;"><b>${h.locationName}</b></p>
          <small style="color:#555;">${h.incidentCount} incidents reported here</small>
        </div>
      `).addTo(this.map);

      this.hotspotLayers.push(circle);
    });
  }

  calculateRoute(): void {
    this.isLoadingRoute = true;

    this.routeService.calculateSafeRoute({
      originLat: this.userLat,
      originLng: this.userLng,
      destinationLat: this.destLat,
      destinationLng: this.destLng,
      destinationName: this.destinationSearch || 'Destination'
    }).subscribe({
      next: (res) => {
        this.isLoadingRoute = false;
        this.routeData = res;
        this.renderRoutesOnMap();
      },
      error: (err) => {
        this.isLoadingRoute = false;
        console.error('Failed to calculate safe route', err);
      }
    });
  }

  private renderRoutesOnMap(): void {
    if (!this.L || !this.map || !this.routeData) return;

    // Clear previous lines
    this.routeLayers.forEach((layer) => this.map.removeLayer(layer));
    this.routeLayers = [];
    this.markerLayers.forEach((m) => this.map.removeLayer(m));
    this.markerLayers = [];

    // 1. Draw Direct / Risky route (dashed orange/gray)
    const directPolyline = this.L.polyline(this.routeData.fastestRoute.coordinates, {
      color: '#ff9500',
      dashArray: '8, 8',
      weight: 4,
      opacity: 0.7
    }).addTo(this.map);
    this.routeLayers.push(directPolyline);

    // 2. Draw Recommended Safe Corridor (Bold bright green)
    const safePolyline = this.L.polyline(this.routeData.safestRoute.coordinates, {
      color: '#10b981',
      weight: 6,
      opacity: 0.95
    }).addTo(this.map);
    this.routeLayers.push(safePolyline);

    // 3. Destination marker
    const destMarker = this.L.marker([this.destLat, this.destLng]).bindPopup(`
      <b>${this.destinationSearch || 'Destination'}</b><br>Safe arrival target
    `).addTo(this.map);
    this.markerLayers.push(destMarker);

    // 4. Safe Havens (Police stations / Help desks)
    this.routeData.safeHavens.forEach((sh) => {
      const havenIcon = this.L.divIcon({
        className: 'haven-icon',
        html: '<div style="background:#10b981; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.3);"><i class="fas fa-shield-alt" style="font-size:12px;"></i></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const haven = this.L.marker([sh.latitude, sh.longitude], { icon: havenIcon })
        .bindPopup(`<b>${sh.name}</b><br><span style="color:#059669; font-weight:600;">Verified Safe Haven</span>`)
        .addTo(this.map);
      this.markerLayers.push(haven);
    });

    // Fit map bounds to show route
    this.map.fitBounds(safePolyline.getBounds(), { padding: [50, 50] });
  }

  selectRoute(type: 'SAFEST' | 'FASTEST'): void {
    this.selectedRouteType = type;
  }

  getActiveRoute(): RouteOption | null {
    if (!this.routeData) return null;
    return this.selectedRouteType === 'SAFEST' ? this.routeData.safestRoute : this.routeData.fastestRoute;
  }

  toggleJourney(): void {
    this.isJourneyActive = !this.isJourneyActive;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
