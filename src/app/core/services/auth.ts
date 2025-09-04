import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { TokenService } from './token';
import { Observable, tap } from 'rxjs';

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

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', data).pipe(
      tap((response) => {
        if (response.refreshToken)
          this.tokenService.setRefreshToken(response.refreshToken);
        if (response.accessToken)
          this.tokenService.setAccessToken(response.accessToken);
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.api
      .post<LoginResponse>('auth/refresh-token', { refreshToken })
      .pipe(
        tap((response) => {
          if (response.accessToken)
            this.tokenService.setAccessToken(response.accessToken);
          if (response.refreshToken)
            this.tokenService.setRefreshToken(response.refreshToken);
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
