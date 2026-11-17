import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StealthService } from '../../../core/services/stealth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  public auth = inject(AuthService);
  private router = inject(Router);
  public stealth = inject(StealthService);

  isMoreOpen = false;

  toggleMoreSheet(): void {
    this.isMoreOpen = !this.isMoreOpen;
  }

  closeMoreSheet(): void {
    this.isMoreOpen = false;
  }

  activateStealthFromSheet(): void {
    this.closeMoreSheet();
    this.stealth.activateStealth();
  }

  toggleSirenFromSheet(): void {
    this.stealth.toggleSiren();
  }

  onCenterSosClick(): void {
    this.closeMoreSheet();
    this.router.navigate(['/dashboard']);
  }

  onLogout(): void {
    this.closeMoreSheet();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
