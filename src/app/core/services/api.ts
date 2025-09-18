import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiResponse {
  message: string;
  statusCode: Number;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<ApiResponse> {
    const options = params
      ? { params: new HttpParams({ fromObject: params }) }
      : {};
    return this.http.get<ApiResponse>(`${this.baseUrl}/${endpoint}`, options);
  }
  post<T>(endpoint: string, body: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/${endpoint}`, body);
  }
  put<T>(endpoint: string, body: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${endpoint}`, body);
  }
  delete<T>(endpoint: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${endpoint}`);
  }
}
