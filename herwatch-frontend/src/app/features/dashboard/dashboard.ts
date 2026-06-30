import { Component, OnDestroy, signal } from '@angular/core';
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
export class DashboardComponent implements OnDestroy {
  username: string;
  confirmingSOS = signal(false);
  countdown = signal(5);
  private timer: any;

  constructor(private userService: UserService) {
    this.username = this.userService.getUser()?.name ?? 'User';
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
}