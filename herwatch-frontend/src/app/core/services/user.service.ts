import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string;
  password: string; // TODO: never store plaintext once a real backend exists — hash server-side
}

const USER_KEY = 'herwatch_user';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private storage: StorageService) {}

  saveUser(profile: UserProfile): void {
    this.storage.setItem(USER_KEY, profile);
  }

  getUser(): UserProfile | null {
    return this.storage.getItem<UserProfile>(USER_KEY);
  }

  clearUser(): void {
    this.storage.removeItem(USER_KEY);
  }
}