import { APP_INITIALIZER, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MenuService } from '../services/menu';
import { AuthService } from '../services/auth';
import { TokenService } from '../services/token';

// factory ที่คืนค่าเป็นฟังก์ชันที่ Angular จะเรียกตอนเริ่มแอป
export function appInitializerFactory() {
  const auth = inject(AuthService);
  const menu = inject(MenuService);
  const tokenService = inject(TokenService);

  return async (): Promise<void> => {
    try {
      if (typeof auth.restoreSession === 'function') {
        console.log(
          '####################### appInitializerFactory auth.restoreSession : '
        );
        await Promise.resolve(auth.restoreSession());
      }

      const token = tokenService.getAccessToken();
      console.log(
        '####################### appInitializerFactory token : ',
        token
      );
      if (token) {
        try {
          await firstValueFrom(menu.loadMenu());
        } catch {
          console.error('App initialization menu.loadMenu error');
        }
      }
    } catch {
      console.error('App initialization error');
    }
  };
}

// provider ที่จะเพิ่มใน appConfig.providers
export const APP_INIT_PROVIDER = {
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  multi: true,
};
