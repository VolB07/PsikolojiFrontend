import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();
  console.log('Kullanıcı rolü:', role);

  if (!role || role !== 'admin') {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
