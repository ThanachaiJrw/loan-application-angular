import { Component } from '@angular/core';
import {
  DynamicForm,
  FormConfig,
} from '../../shared/components/dynamic-form/dynamic-form';
import { AuthService } from '../../core/services/auth';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { Alert } from '../../shared/components/alert/alert';
import { switchMap, tap } from 'rxjs';
import { MenuService } from '../../core/services/menu';
import { MenuItem } from '../../config/menu.config';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [DynamicForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alert: Alert,
    private menuService: MenuService
  ) {}

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

  // recusive find first route if inside nested array.
  private findFirstRoute(menus: MenuItem[]): MenuItem | null {
    for (const menu of menus) {
      if (menu.route) return menu;
      if (menu.children && menu.children?.length) {
        const child = this.findFirstRoute(menu.children);
        if (child) return child;
      }
    }
    return null;
  }

  handleFormAction(event: { action: string; value: any }) {
    switch (event.action) {
      case 'save':
        this.auth
          .login(event.value)
          .pipe(
            switchMap((response) => {
              // load menu
              return this.menuService.loadMenu();
            }),
            tap((menus) => {
              // find first route
              const firstRoute = this.findFirstRoute(menus);
              if (!!firstRoute) {
                this.router.navigate([firstRoute.route]);
              } else {
                this.router.navigate(['/']);
              }
            })
          )
          .subscribe({
            next: () => {
              this.alert.success('Login สำเร็จและโหลดเมนูแล้ว');
              // this.router.navigate(['/']);
            },
            error: (error) => {
              this.alert.error('Login หรือโหลดเมนูไม่สำเร็จ');
              console.error(error);
            },
          });
        break;
      case 'reset':
        console.log('Form reset สำเร็จ');
        break;
    }
  }
}
