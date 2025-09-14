import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.example.com';
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = params
      ? { params: new HttpParams({ fromObject: params }) }
      : {};
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
  }
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
