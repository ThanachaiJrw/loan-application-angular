import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertWrapper } from './shared/components/alert-wrapper/alert-wrapper';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './core/interceptors/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, AlertWrapper],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('loan-application-angular');
}
