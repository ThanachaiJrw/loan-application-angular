export interface MenuItem {
  id: string; // Key
  parentId?: string | null; // Parent Key
  // key: string; // Permission Key
  label: string; // Header Display
  icon?: string; //Icon
  route?: string | null; // Route / URL
  children?: MenuItem[]; // Sub-menus
  roles: string[]; // Roles that can access this menu
}



export const DEMO_MENUS: MenuItem[] = [
  {
    id: '1',
    label: 'Dashboard',
    icon: 'home',
    route: '/dashboard',
    roles: ['admin', 'user'],
  },
  {
    id: '2',
    label: 'Users',
    icon: 'user',
    route: '/users',
    roles: ['admin'],
    children: [
      {
        id: '3',
        parentId: '2',
        label: 'User List',
        route: '/users/list',
        roles: ['admin'],
      },
      {
        id: '4',
        parentId: '2',
        label: 'Create User',
        route: '/users/create',
        roles: ['admin'],
      },
    ],
  },
  {
    id: '5',
    label: 'Products',
    icon: 'shopping-cart',
    route: '/products',
    roles: ['admin', 'manager'],
    children: [
      {
        id: '6',
        parentId: '5',
        label: 'Product List',
        route: '/products/list',
        roles: ['admin', 'manager'],
      },
      {
        id: '7',
        parentId: '5',
        label: 'Add Product',
        route: '/products/create',
        roles: ['admin'],
      },
    ],
  },
  {
    id: '8',
    label: 'Reports',
    route: '/reports',
    roles: ['admin', 'manager'], // ไม่มี icon
  },
  {
    id: '9',
    label: 'Settings',
    icon: 'setting',
    route: '/settings',
    roles: ['admin'],
    children: [
      {
        id: '10',
        parentId: '9',
        label: 'General',
        route: '/settings/general',
        roles: ['admin'],
      },
      {
        id: '11',
        parentId: '9',
        label: 'Security',
        route: '/settings/security',
        roles: ['admin'],
      },
    ],
  },
];
