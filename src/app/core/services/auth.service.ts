import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface JwtPayload {
  user_id: number;
  username: string;
  is_staff: boolean;
  is_tutor: boolean;
  is_student: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly refreshKey = 'refresh_token';
  private readonly userKey = 'current_user';
  private readonly roleKey = 'user_roles';

  readonly isLoggedIn = signal(false);
  readonly currentUser = signal<string | null>(localStorage.getItem(this.userKey));
  readonly isAdmin = signal(false);
  readonly isTutor = signal(false);
  readonly isStudent = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.isLoggedIn.set(!!this.getToken());
    this.loadRoles();
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private loadRoles() {
    const payload = this.decodeToken();
    if (payload) {
      this.isAdmin.set(payload.is_staff);
      this.isTutor.set(payload.is_tutor);
      this.isStudent.set(payload.is_student);
      const roles = JSON.stringify({
        is_staff: payload.is_staff,
        is_tutor: payload.is_tutor,
        is_student: payload.is_student,
      });
      localStorage.setItem(this.roleKey, roles);
    } else {
      const cached = localStorage.getItem(this.roleKey);
      if (cached) {
        try {
          const r = JSON.parse(cached);
          this.isAdmin.set(r.is_staff);
          this.isTutor.set(r.is_tutor);
          this.isStudent.set(r.is_student);
        } catch { /* ignore */ }
      }
    }
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
          localStorage.setItem(this.userKey, username);
          this.isLoggedIn.set(true);
          this.currentUser.set(username);
          this.loadRoles();
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.isTutor.set(false);
    this.isStudent.set(false);
    this.router.navigate(['/']);
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
      .post<TokenResponse>(`${environment.apiUrl}/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.access);
          if (res.refresh) {
            localStorage.setItem(this.refreshKey, res.refresh);
          }
          this.loadRoles();
        }),
      );
  }

  updateRolesFromUser(user: { is_staff?: boolean; is_tutor?: boolean; is_student?: boolean }) {
    this.isAdmin.set(!!user.is_staff);
    this.isTutor.set(!!user.is_tutor);
    this.isStudent.set(!!user.is_student);
    const roles = JSON.stringify({
      is_staff: !!user.is_staff,
      is_tutor: !!user.is_tutor,
      is_student: !!user.is_student,
    });
    localStorage.setItem(this.roleKey, roles);
  }
}
