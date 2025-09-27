import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from './api';
import { TokenService } from './token';
import { firstValueFrom, Observable, tap } from 'rxjs';
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
  // Authentication related methods will go here
  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(dataLogin: LoginRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('auth/login', dataLogin).pipe(
      tap((response) => {
        if (response.statusCode === 200) {
          const data: LoginResponse = response.data;
          console.log('################# Login response:', response.data);
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
    await this.tokenService.clearTokens();
    await this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }
}
