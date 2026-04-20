import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginDetails {
  email: string;
  password: string;
}

export interface UserDto {
  userId: string;
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(details: LoginDetails): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/login`, details);
  }

  register(details: LoginDetails): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/register`, details);
  }

  logout(): Observable<string> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { responseType: 'text' });
  }
}
