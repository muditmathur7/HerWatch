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
  private auth = inject(AuthService);
  private router = inject(Router);
  public stealth = inject(StealthService);

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
