import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LoginRoutes } from './pages/login/login.routes';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  HomeOutline,
  LogoutOutline,
  MenuFoldOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { APP_INIT_PROVIDER } from './core/init/app.initializer';

const icons: IconDefinition[] = [
  DashboardOutline,
  UserOutline,
  LogoutOutline,
  MenuFoldOutline,
  HomeOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideNzIcons(icons),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter([...routes, ...LoginRoutes]),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) =>
          inject(AuthInterceptor).intercept(req, {
            handle: (req) => next(req),
          }),
      ])
    ),
    APP_INIT_PROVIDER, //before app running
  ],
};
