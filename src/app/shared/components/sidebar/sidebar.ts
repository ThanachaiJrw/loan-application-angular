import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  imports: [CommonModule, NzIconModule],
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
}
