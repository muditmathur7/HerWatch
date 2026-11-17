import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  setItem(key: string, value: unknown): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('StorageService: error saving to localStorage', e);
      }
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch (e) {
        console.error('StorageService: error reading from localStorage', e);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('StorageService: error removing from localStorage', e);
      }
    }
  }

  clear(): void {
    if (this.isBrowser) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('StorageService: error clearing localStorage', e);
      }
    }
  }
}
