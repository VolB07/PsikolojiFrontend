import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const role = this.authService.getRole(); // Kullanıcı rolünü al
    console.log('Kullanıcı rolü:', role);  // Role bilgisini kontrol et
    
    if (!role || role !== 'admin') {
      this.router.navigate(['/login']); // Admin olmayan kullanıcıyı login sayfasına yönlendir
      return false;
    }
    
    return true; // Adminse erişime izin ver
  }
  
  
  
}
