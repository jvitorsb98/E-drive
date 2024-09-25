import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Permite o acesso à rota
  } else {
    router.navigate(['/e-driver/login']); // Redireciona para a página de login
    return false; // Bloqueia o acesso à rota
  }
};