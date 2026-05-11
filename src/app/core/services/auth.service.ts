import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly refreshKey = 'refresh_token';
  private readonly userKey = 'current_user';

  readonly isLoggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.isLoggedIn.set(!!this.getToken());
  }

  login(username: string, password: string) {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/token/`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.access);
          localStorage.setItem(this.refreshKey, res.refresh);
          this.isLoggedIn.set(true);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshKey);
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    return this.http
      .post<{ access: string }>(`${environment.apiUrl}/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.access);
        }),
      );
  }
}
