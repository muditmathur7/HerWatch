import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './core/services/storage.service';
import { StealthService } from './core/services/stealth.service';
import { CalculatorDisguiseComponent } from './shared/components/calculator-disguise/calculator-disguise';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, CalculatorDisguiseComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  public stealth = inject(StealthService);

  constructor(private storage: StorageService) {}

  ngOnInit() {
    if (this.isBrowser) {
      const darkMode = this.storage.getItem<boolean>('herwatch_dark_mode');
      if (darkMode) {
        document.body.classList.add('dark-mode');
      }
    }
  }
}
