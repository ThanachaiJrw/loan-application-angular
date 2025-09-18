import { Component } from '@angular/core';
import {
  DynamicForm,
  FormConfig,
} from '../../shared/components/dynamic-form/dynamic-form';
import { AuthService } from '../../core/services/auth';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [DynamicForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  loginFormConfig: FormConfig = {
    fields: [
      {
        type: 'text',
        name: 'username',
        label: 'ชื่อผู้ใช้',
        placeholder: 'กรอกชื่อผู้ใช้',
        col: 24,
        showErrorTip: true,
        validators: [{ type: 'required', message: 'กรุณากรอกชื่อผู้ใช้' }],
      },
      {
        type: 'password',
        name: 'password',
        label: 'รหัสผ่าน',
        placeholder: 'กรอกรหัสผ่าน',
        col: 24,
        showErrorTip: true,
        validators: [
          { type: 'required', message: 'กรุณากรอกรหัสผ่าน' },
          {
            type: 'minLength',
            value: 6,
            message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
          },
        ],
      },
    ],
    buttons: [
      {
        label: 'เข้าสู่ระบบ',
        action: 'save',
        color: 'primary',
        requiresValidation: true,
      },
      { label: 'รีเซ็ต', action: 'reset', color: 'warning' },
    ],
  };

  handleFormAction(event: { action: string; value: any }) {
    switch (event.action) {
      case 'save':
        console.log('Login data:', event.value);
        this.auth.login(event.value).subscribe({
          next: (response) => {
            console.log('Login successful:', response);
            // Redirect to dashboard or another page if needed
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
        break;
      case 'reset':
        console.log('Form reset สำเร็จ');
        break;
    }
  }
}
