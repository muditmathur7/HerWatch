import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserService, UserProfile } from './user.service';

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

@Injectable({ providedIn: 'root' })
export class AuthService {

  private signupData: Partial<SignupData> = {};

  constructor(
    private storage: StorageService,
    private userService: UserService
  ) {}

  updateSignupData(data: Partial<SignupData>): void {
    this.signupData = { ...this.signupData, ...data };
  }

  getSignupData(): Partial<SignupData> {
    return this.signupData;
  }

  completeRegistration(): void {
    const data = this.signupData as SignupData;

    const profile: UserProfile = {
      name: `${data.firstName} ${data.lastName}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      age: data.age,
      gender: data.gender
    };

    // TODO: replace with real backend registration call
    this.userService.saveUser(profile);
    this.signupData = {};
    this.storage.setItem(SESSION_KEY, true);
  }

  login(email: string, password: string): boolean {
    // TODO: replace with real backend auth call (password isn't verified yet, no backend to check against)
    const user = this.userService.getUser();
    if (!user || user.email !== email) return false;

    this.storage.setItem(SESSION_KEY, true);
    return true;
  }

  logout(): void {
    this.storage.removeItem(SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return this.storage.getItem<boolean>(SESSION_KEY) === true;
  }
}