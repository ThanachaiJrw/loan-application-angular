import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from './api';
import { TokenService } from './token';
import { catchError, firstValueFrom, Observable, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  token?: string | null;

  // Authentication related methods will go here
  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  // โหลด token จาก TokenService (ไม่ใช่ network) — ใช้เป็น loadToken()
  loadToken(): void {
    this.token = this.tokenService.getAccessToken() || null;
  }

  login(dataLogin: LoginRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('auth/login', dataLogin).pipe(
      tap((response) => {
        if (response.statusCode === 200) {
          const data: LoginResponse = response.data;
          if (data.refreshToken)
            this.tokenService.setRefreshToken(data.refreshToken);
          if (data.accessToken)
            this.tokenService.setAccessToken(data.accessToken);
          // เก็บลง instance ด้วย
          this.token = data.accessToken || null;
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
            this.token = data.accessToken || null;
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
    await this.tokenService.clearTokens();
    this.token = null;
    await this.router.navigate(['/login']);
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
    // ถ้าต้อง validate token กับ backend:
    return this.api.post('auth/validate', { token: stored }).pipe(
      tap((res) => {
        console.log('################ auth/validate response:', res);
        if (res?.data?.valid) {
          this.token = stored;
        } else {
          this.token = null;
          this.tokenService.clearTokens();
        }
      }),
      catchError(() => {
        this.token = null;
        this.tokenService.clearTokens();
        return of(void 0);
      }),
      // map to void
      map(() => void 0)
    );
  }
}
