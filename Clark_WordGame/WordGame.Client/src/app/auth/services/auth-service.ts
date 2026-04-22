import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { EmailLoginDetails, LoginResponse, UserDto } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'accessToken';
  
  private _http = inject(HttpClient);
  private _router = inject(Router);

  public isLoggedIn: WritableSignal<boolean> = signal(this.hasValidToken());

  public set accessToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedIn.set(this.hasValidToken());
  }

  public get accessToken(): string {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  public register(details: EmailLoginDetails): Observable<UserDto> {
    return this._http.post<UserDto>(`/api/auth/register`, details);
  }


  public login(credentials: EmailLoginDetails): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`/api/auth/login`, credentials).pipe(
      tap((response) => {
        if (response.accessToken) {
          this.accessToken = response.accessToken;
        }
      }),
    );
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
  }

  public hasValidToken(): boolean {
    const token = this.accessToken;

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);

      if (!decodedToken.exp) {
        return false;
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      return decodedToken.exp > currentTimeInSeconds;
    } catch {
      return false;
    }
  }

  public logout(): void {
    this.clearToken();
    void this._router.navigate(['/auth/login']);
  }
}