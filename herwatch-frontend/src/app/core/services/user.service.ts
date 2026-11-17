import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { UserProfile } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';

export type { UserProfile };

const USER_KEY = 'herwatch_user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private apiUrl = `${environment.apiUrl}/auth`;

  saveUser(profile: UserProfile): void {
    // If name is not explicitly provided, build from firstName + lastName
    if (!profile.name && profile.firstName) {
      profile.name = `${profile.firstName} ${profile.lastName || ''}`.trim();
    }
    this.storage.setItem(USER_KEY, profile);
  }

  getUser(): UserProfile | null {
    return this.storage.getItem<UserProfile>(USER_KEY);
  }

  fetchProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.saveUser(user);
      })
    );
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, profile).pipe(
      tap((updated) => {
        this.saveUser(updated);
      })
    );
  }

  clearUser(): void {
    this.storage.removeItem(USER_KEY);
  }
}
