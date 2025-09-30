import { Component, computed, OnInit, signal } from '@angular/core';
import { MenuItem } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth';
import {
  NzContentComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { MenuService } from '../../core/services/menu';

@Component({
  selector: 'app-auth-layout',
  imports: [
    CommonModule,
    NzIconModule,
    NzLayoutComponent,
    NzSiderComponent,
    NzCollapseModule,
    NzMenuModule,
    RouterLink,
    NzHeaderComponent,
    NzAvatarComponent,
    NzContentComponent,
    NzSpinComponent,
    RouterOutlet,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout implements OnInit {
  menus: MenuItem[] = [];
  // isCollapsed = false;
  isCollapsed = signal(false);
  isLoading = false;
  currentUser = 'Admin User';
  currentUserRole = 'admin';
  currentPageTitle = 'Dashboard';
  openSubmenus = signal<string[]>([]);
  filteredMenus = signal<MenuItem[]>([]);
  simpleMenus = computed(() =>
    this.filteredMenus().filter((menu) => !menu.children?.length)
  );
  menusWithChildren = computed(() =>
    this.filteredMenus().filter((menu) => menu.children?.length)
  );

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {}

  // เหลือ fix css ให้สวยๆ
  ngOnInit() {
    this.menuService.menus$.subscribe((menus) => {
      console.log('### menus from service: ', menus);
      this.menus = menus;
    });
    this.filteredMenus.set(
      this.filterMenusByRole(this.menus, this.currentUserRole)
    );
    // const token = localStorage.getItem('access_token');
    // if (!token) return;
    // const decoded: any = jwtDecode(token);
    // const role = decoded.role;
    // this.filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));
  }

  toggleSubmenu(label: string) {
    const current = this.openSubmenus();
    if (current.includes(label)) {
      this.openSubmenus.set(current.filter((l) => l !== label));
    } else {
      this.openSubmenus.set([...current, label]);
    }
  }

  toggleCollapse(): void {
    // this.isCollapsed = !this.isCollapsed;
    this.isCollapsed.set(!this.isCollapsed());
  }

  getMenuInitials(label: string): string {
    if (!label) return '';

    const words = label.split(' ');
    if (words.length === 1) {
      // ถ้าเป็นคำเดียว ให้เอา 2 ตัวแรก
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // ถ้าเป็นหลายคำ ให้เอาตัวแรกของแต่ละคำ
      return words
        .map((word) => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
  }

  logout() {
    this.authService.logout();
  }

  private filterMenusByRole(menus: MenuItem[], userRole: string): MenuItem[] {
    return menus
      .filter((menu) => menu.roles.includes(userRole))
      .map((menu) => ({
        ...menu,
        children: menu.children
          ? this.filterMenusByRole(menu.children, userRole)
          : undefined,
      }))
      .filter((menu) => !menu.children || menu.children.length > 0); // Remove empty parent menus
  }

  // Check if user has permission to access menu
  hasPermission(menu: MenuItem): boolean {
    return menu.roles.includes(this.currentUserRole);
  }

  // Get current page title based on route
  updatePageTitle(route: string): void {
    const findMenuByRoute = (
      menus: MenuItem[],
      targetRoute: string
    ): MenuItem | null => {
      for (const menu of menus) {
        if (menu.route === targetRoute) {
          return menu;
        }
        if (menu.children) {
          const found = findMenuByRoute(menu.children, targetRoute);
          if (found) return found;
        }
      }
      return null;
    };

    const currentMenu = findMenuByRoute(this.menus, route);
    this.currentPageTitle = currentMenu?.label || 'Dashboard';
  }
}
