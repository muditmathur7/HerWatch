import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { AuthResponse, UserProfile, SignupRequest } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';

export interface SignupData {
  firstName: string;
  lastName: string;
  phone: string;
  age: number | null;
  gender: string;
  email: string;
  password: string;
  username: string;
  pin: string;
}

const SESSION_KEY = 'herwatch_logged_in';
const TOKEN_KEY = 'herwatch_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private apiUrl = `${environment.apiUrl}/auth`;

  private signupData: Partial<SignupData> = {};

  updateSignupData(data: Partial<SignupData>): void {
    this.signupData = { ...this.signupData, ...data };
  }

  getSignupData(): Partial<SignupData> {
    return this.signupData;
  }

  completeRegistration(): Observable<AuthResponse> {
    const payload = this.signupData as SignupRequest;

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((res) => {
        this.storage.setItem(TOKEN_KEY, res.access_token);
        this.userService.saveUser(res.user);
        this.storage.setItem(SESSION_KEY, true);
        this.signupData = {};
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.storage.setItem(TOKEN_KEY, res.access_token);
        this.userService.saveUser(res.user);
        this.storage.setItem(SESSION_KEY, true);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  logout(): void {
    this.storage.removeItem(TOKEN_KEY);
    this.storage.removeItem(SESSION_KEY);
    this.userService.clearUser();
  }

  getToken(): string | null {
    return this.storage.getItem<string>(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const session = this.storage.getItem<boolean>(SESSION_KEY);
    return !!token && session === true;
  }
}
