import type { User, Dashboard, Permission, Settings } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: 'admin-01',
    name: 'Admin User',
    email: 'admin@bizzviz.com',
    role: 'admin',
  },
  {
    id: 'user-01',
    name: 'Standard User',
    email: 'user@bizzviz.com',
    role: 'user',
  },
];

export const mockDashboards: Dashboard[] = [
  {
    id: 'financials',
    name: 'Financials',
    path: '/dashboard/financials',
  },
  {
    id: 'sales',
    name: 'Sales',
    path: '/dashboard/sales',
  },
];

export const mockPermissions: Permission[] = [
  {
    userId: 'admin-01',
    dashboardIds: ['financials', 'sales'],
  },
  {
    userId: 'user-01',
    dashboardIds: ['sales'],
  },
];

export const mockSettings: Settings[] = [
    {
        userId: 'admin-01',
        theme: 'light',
    },
    {
        userId: 'user-01',
        theme: 'dark',
    }
];
