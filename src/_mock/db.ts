import type { User, Settings } from '@/lib/types';

// La lista de usuarios sigue siendo necesaria para la simulación del login.
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