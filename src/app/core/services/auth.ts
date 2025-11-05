import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from './api';
import { TokenService } from './token';
import { catchError, firstValueFrom, Observable, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MenuService } from './menu';

export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Authentication related methods will go here
  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private menuService: MenuService,
    private router: Router
  ) {}

  login(dataLogin: LoginRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('auth/login', dataLogin).pipe(
      tap((response) => {
        if (response.statusCode === 200) {
          const data: LoginResponse = response.data;
          if (data.refreshToken)
            this.tokenService.setRefreshToken(data.refreshToken);
          if (data.accessToken)
            this.tokenService.setAccessToken(data.accessToken);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.api
      .post<ApiResponse>('auth/refresh-token', { refreshToken })
      .pipe(
        tap((response) => {
          if (response.statusCode === 200) {
            const data: LoginResponse = response.data;
            if (data.refreshToken)
              this.tokenService.setRefreshToken(data.refreshToken);
            if (data.accessToken)
              this.tokenService.setAccessToken(data.accessToken);
          }
        })
      );
  }

  async logout(): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.post('auth/logout', {}));
      console.log('Logout successful:', response);
    } catch (error) {
      console.error('Logout error:', error);
    }
    await this.clearData();
    await this.router.navigate(['/login']);
  }

  clearData(): void {
    this.tokenService.clearTokens();
    this.menuService.clearMenuCache();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  hasRefreshToken(): boolean {
    return !!this.tokenService.getRefreshToken();
  }

  restoreSession(): Observable<void> {
    const stored = this.tokenService.getAccessToken();
    if (!stored) return of(void 0);
    // validate token กับ backend:
    return this.api.post('auth/validate', { token: stored }).pipe(
      tap((res) => {
        console.log('################ auth/validate response:', res);
        console.log(
          '####################### appInitializerFactory auth/validate response : ',
          res.data
        );
        if (res?.data?.valid) {
        } else {
          this.tokenService.clearTokens();
        }
      }),
      catchError(() => {
        this.tokenService.clearTokens();
        return of(void 0);
      }),
      // map to void
      map(() => void 0)
    );
  }
}
