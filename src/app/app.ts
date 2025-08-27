import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertWrapper } from './shared/components/alert-wrapper/alert-wrapper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, AlertWrapper],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('loan-application-angular');
}
