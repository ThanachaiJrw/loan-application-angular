import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzCollapseComponent, NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzContentComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinComponent } from 'ng-zorro-antd/spin';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // role ที่มองเห็นได้
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    route: '/dashboard',
    roles: ['ADMIN', 'USER', 'MANAGER'],
  },
  { label: 'Users', icon: 'group', route: '/admin/users', roles: ['ADMIN'] },
  {
    label: 'Reports',
    icon: 'bar_chart',
    route: '/reports',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    label: 'Profile',
    icon: 'person',
    route: '/profile',
    roles: ['USER', 'ADMIN', 'MANAGER'],
  },
];

@Component({
  selector: 'app-sidebar',
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
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  filteredNav: NavItem[] = [];

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const role = decoded.role;
    this.filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));
  }

  isCollapsed = false;
  isLoading = false;
  currentUser = 'Admin User';
  currentPageTitle = 'Dashboard';

  // แยก menus ออกเป็น 2 ประเภท
  simpleMenus = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Profile', route: '/profile', icon: 'user' },
  ];

  menusWithChildren = [
    {
      label: 'Management',
      icon: 'setting',
      children: [
        { label: 'Users', route: '/users' },
        { label: 'Roles', route: '/roles' },
      ],
    },
  ];

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    // Logout logic here
    console.log('Logout clicked');
  }
}
