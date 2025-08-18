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
  {
    id: 'user-02',
    name: 'Editor User',
    email: 'editor@bizzviz.com',
    role: 'editor',
  }
];

export const mockDashboards: Dashboard[] = [
  {
    id: 'financials',
    name: 'Financials',
    path: '/dashboard/financials',
    pages: [
        { id: 'results', name: 'Results' },
        { id: 'accounts', name: 'Accounts' }
    ]
  },
  {
    id: 'sales',
    name: 'Sales',
    path: '/dashboard/sales',
     pages: [
        { id: 'overview', name: 'Overview' },
        { id: 'regions', name: 'Regions' }
    ]
  },
];

export const mockPermissions: Permission[] = [
  {
    userId: 'admin-01',
    dashboardAccess: [
        { dashboardId: 'financials', pageIds: ['results', 'accounts'] },
        { dashboardId: 'sales', pageIds: ['overview', 'regions'] }
    ]
  },
  {
    userId: 'user-01',
    dashboardAccess: [
        { dashboardId: 'sales', pageIds: ['overview'] }
    ]
  },
  {
    userId: 'user-02',
    dashboardAccess: [
        { dashboardId: 'financials', pageIds: ['results'] },
        { dashboardId: 'sales', pageIds: ['overview', 'regions'] }
    ]
  }
];

export const mockSettings: Settings[] = [
    {
        userId: 'admin-01',
        theme: 'light',
    },
    {
        userId: 'user-01',
        theme: 'dark',
    },
    {
        userId: 'user-02',
        theme: 'light',
    }
];
