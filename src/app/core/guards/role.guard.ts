import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  return router.parseUrl('/app');
};

export const tutorGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isTutor()) {
    return true;
  }

  return router.parseUrl('/app');
};

export const studentGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isStudent()) {
    return true;
  }

  return router.parseUrl('/app');
};
