import { Alert, AlertData } from './../alert/alert';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-wrapper.html',
  styleUrl: './alert-wrapper.css',
})
export class AlertWrapper {
  alert: AlertData | null = null;

  constructor(private alertService: Alert) {
    this.alertService.alert$.subscribe((data) => {
      this.alert = data;
    });
  }

  close() {
    this.alert = null;
  }
}
