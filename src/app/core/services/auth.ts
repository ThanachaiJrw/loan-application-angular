import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from './api';
import { TokenService } from './token';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  constructor(private api: ApiService, private tokenService: TokenService) {}

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

  logout(): void {
    this.tokenService.clearTokens();
    // Optionally, you can also notify the backend about the logout
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }
}
