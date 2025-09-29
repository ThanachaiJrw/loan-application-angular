import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { DEMO_MENUS, MenuItem } from '../../config/menu.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menusSubject = new BehaviorSubject<MenuItem[]>([]);
  menus$ = this.menusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMenus();
  }

  loadMenus() {
    // สมมติว่าเราดึงเมนูจาก API
    // this.http.get<MenuItem[]>('/api/menus').subscribe((menus) => {
    //   this.menusSubject.next(menus);
    // });
    const menus: MenuItem[] = DEMO_MENUS;
    this.menusSubject.next(menus);
  }

  filterMenusByRoles(roles: string[]): void {
    const filterFn = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.roles.some((role) => roles.includes(role)))
        .map((item) => ({
          ...item,
          children: item.children ? filterFn(item.children) : undefined,
        }));
    };
    this.menusSubject.next(filterFn(this.menusSubject.value));
  }
}
