import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'error' | 'waring' | 'info';

export interface AlertData {
  message: string;
  type: AlertType;
  time?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private alertSubject = new BehaviorSubject<AlertData | null>(null);
  alert$ = this.alertSubject.asObservable();

  show(message: string, type: AlertType = 'info', time: number = 3000) {
    this.alertSubject.next({ message, type, time });
    setTimeout(() => this.clear(), time);
  }

  clear() {
    this.alertSubject.next(null);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  waring(message: string) {
    this.show(message, 'waring');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
