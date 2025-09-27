import { Injectable } from '@angular/core';
import { DEMO_MENUS, MenuItem } from '../../config/menu.config';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: string[] = [];

  setPermissions(permissions: string[]) {
    this.permissions = permissions;
  }

  getAccessibleMenu(): MenuItem[] {
    return this.filterMenus(DEMO_MENUS);
  }

  private filterMenus(menus: MenuItem[]): MenuItem[] {
    return menus
      .filter(
        (menu) =>
          this.permissions.includes(menu.key) ||
          (menu.children &&
            menu.children.some((child) => this.permissions.includes(child.key)))
      )
      .map((menu) => ({
        ...menu,
        children: menu.children ? this.filterMenus(menu.children) : undefined,
      }));
  }
}
