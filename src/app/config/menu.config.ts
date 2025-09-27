export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

export const DEMO_MENUS: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
  },
  {
    key: 'users',
    label: 'Users',
    icon: 'user',
    route: '/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'setting',
    children: [
      {
        key: 'profile',
        label: 'Profile',
        route: '/settings/profile',
      },
      {
        key: 'security',
        label: 'Security',
        route: '/settings/security',
      },
    ],
  },
];
