import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
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
import { PageHeaderComponent } from '../header/page-header';

@Component({
  selector: 'app-auth-layout',
  imports: [
    Sidebar,
    PageHeaderComponent,
    NzMenuModule,
    NzIconModule,
    NzLayoutComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  menus: MenuItem[] = [];
  constructor() {}
}
