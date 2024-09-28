import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const canMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/e-driver/login']);
  }
};