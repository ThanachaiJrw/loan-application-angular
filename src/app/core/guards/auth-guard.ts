import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (this.auth.isAuthenticated()) {
      return of(true);
    }

    // ถ้ามี refresh token พยายาม refresh ก่อน
    if (this.auth.hasRefreshToken()) {
      return this.auth.refreshToken().pipe(
        switchMap((res) => {
          // สมมติถ้า refresh สำเร็จ token ถูกเซฟโดย AuthService
          return of(
            this.auth.isAuthenticated() ? true : this.router.parseUrl('/login')
          );
        }),
        catchError(() => of(this.router.parseUrl('/login')))
      );
    }

    return of(this.router.parseUrl('/login'));
  }
}
