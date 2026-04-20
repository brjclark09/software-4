import { Injectable, signal, computed } from '@angular/core';
import { UserDto } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _user = signal<UserDto | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  setUser(user: UserDto): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }
}
