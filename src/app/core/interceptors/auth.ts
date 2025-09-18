import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token';
import { AuthService } from '../services/auth';
import { catchError, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return next.handle(req).pipe(
      // You can add error handling logic here to catch 401 errors and refresh the token if needed
      catchError((error) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshToken().pipe(
            catchError((err) => {
              this.authService.logout();
              throw err;
            }),
            // After refreshing the token, retry the original request
            switchMap((response) => {
              this.isRefreshing = false;
              const newAccessToken = response.data.accessToken;
              if (newAccessToken) {
                this.tokenService.setAccessToken(newAccessToken);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });
                return next.handle(req);
              }
              this.authService.logout();
              throw error;
            })
          );
        }
        throw error;
      })
    );
  }
}
