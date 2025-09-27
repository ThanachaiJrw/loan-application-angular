import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { PermissionService } from '../../core/services/permission';
import { MenuItem } from '../../config/menu.config';
import { AuthService } from '../../core/services/auth';
import {
  NzContentComponent,
  NzLayoutComponent,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  NzMenuDirective,
  NzMenuItemComponent,
  NzMenuModule,
  NzSubmenuService,
} from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [
    Sidebar,
    NzMenuDirective,
    NzMenuModule,
    NzIconModule,
    NzLayoutComponent,
    NzSiderComponent,
    NzContentComponent,
    RouterOutlet,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout implements OnInit {
  menus: MenuItem[] = [];
  constructor(
    private permissionService: PermissionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const permissions = ['dashboard', 'users', 'profile'];
    this.permissionService.setPermissions(permissions);
    this.menus = this.permissionService.getAccessibleMenu();
    console.log('################### menus : ', this.menus);
  }

  logout() {
    this.authService.logout();
  }
}
