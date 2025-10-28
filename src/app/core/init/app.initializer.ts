import { APP_INITIALIZER, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MenuService } from '../services/menu';
import { AuthService } from '../services/auth';

// factory ที่คืนค่าเป็นฟังก์ชันที่ Angular จะเรียกตอนเริ่มแอป
export function appInitializerFactory() {
  const auth = inject(AuthService);
  const menu = inject(MenuService);

  return async (): Promise<void> => {
    try {
      // restoreSession() / loadToken() เป็นตัวอย่าง ฟังก์ชันจริงขึ้นกับ AuthService ของคุณ
      if (typeof auth.restoreSession === 'function') {
        await Promise.resolve(auth.restoreSession());
      } else if (typeof auth.loadToken === 'function') {
        await Promise.resolve(auth.loadToken());
      }

      // ถ้ามี token อยู่ ให้โหลดเมนูจาก API (menu.loadMenu คืน Observable)
      const token = (auth as any).getToken?.() || (auth as any).token;
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
