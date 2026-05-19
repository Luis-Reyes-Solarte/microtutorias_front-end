import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (token) {
    const isRegister = req.method === 'POST' && req.url.endsWith('/users/');
    if (!isRegister) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap((res) => {
            // Clone the request with the new token
            const clonedRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` },
            });
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            // If refresh fails, log out the user
            authService.logout();
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
