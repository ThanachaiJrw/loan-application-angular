import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DEMO_MENUS, MenuItem } from '../../config/menu.config';
import { ApiService, ApiResponse } from './api';

const MENU_CACHE_KEY = 'app_menu_cache_v1';
const MENU_CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menusSubject = new BehaviorSubject<MenuItem[]>([]);
  menus$ = this.menusSubject.asObservable();

  constructor(private api: ApiService) {}

  getSnapshot(): MenuItem[] {
    return this.menusSubject.value;
  }

  setMenu(items: MenuItem[]): void {
    this.menusSubject.next(items);
    this.saveToCache(items);
  }

  clearCache(): void {
    try {
      localStorage.removeItem(MENU_CACHE_KEY);
    } catch {
      // ignore
    }
    this.menusSubject.next([]);
  }

  private saveToCache(items: MenuItem[]): void {
    try {
      const payload = { ts: Date.now(), items };
      localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }

  private loadFromCache(): MenuItem[] | null {
    try {
      const raw = localStorage.getItem(MENU_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts || !Array.isArray(parsed.items)) return null;
      if (Date.now() - parsed.ts > MENU_CACHE_TTL_MS) return null; // expired
      return parsed.items as MenuItem[];
    } catch {
      return null;
    }
  }

  // loadMenus() {
  //   // สมมติว่าเราดึงเมนูจาก API
  //   this.http.get<MenuItem[]>('/menus').subscribe((menus) => {
  //     this.menusSubject.next(menus);
  //   });
  //   // const menus: MenuItem[] = DEMO_MENUS;
  //   // this.menusSubject.next(menus);
  // }

  loadMenu(force = false): Observable<MenuItem[]> {
    if (!force) {
      const cached = this.loadFromCache();
      if (cached) {
        this.menusSubject.next(cached);
        return of(cached);
      }
    }

    return this.api.get<ApiResponse>('menu').pipe(
      map((res) => (res?.data as MenuItem[]) || []),
      tap((items: MenuItem[]) => {
        this.menusSubject.next(items);
        this.saveToCache(items);
      }),
      catchError((err) => {
        // ถ้า API ล้มเหลว แต่มี cache เก่า ให้ fallback ไปใช้ cache
        const cached = this.loadFromCache();
        if (cached) {
          this.menusSubject.next(cached);
          return of(cached);
        }
        // ถ้าไม่มี cache ให้ rethrow error
        throw err;
      })
    );
  }

  filterMenusByRoles(roles: string[]): void {
    const filterFn = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) =>
          Array.isArray(item.roles)
            ? item.roles.some((role) => roles.includes(role))
            : true
        )
        .map((item) => ({
          ...item,
          children: item.children ? filterFn(item.children) : undefined,
        }));
    };
    this.menusSubject.next(filterFn(this.menusSubject.value));
  }
}
