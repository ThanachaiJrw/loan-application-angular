import { Injectable } from '@angular/core';

//  ต้องย้ายไป env แล้ว Injection เข้ามา
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}
