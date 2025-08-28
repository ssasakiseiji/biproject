// ssasakiseiji/biproject/biproject-c27025170b497117a48b90ae73651843b5f34964/src/_mock/db.ts

import type { User, Settings, Client } from '@/lib/types';

// ✅ Definimos los clientes (empresas)
export const mockClients: Client[] = [
  { id: 'client-a-123', name: 'Empresa Alfa' },
  { id: 'client-b-456', name: 'Compañía Beta' },
];

// ✅ Actualizamos los usuarios para que pertenezcan a un cliente
export const mockUsers: User[] = [
  // Usuarios de la Empresa Alfa
  {
    id: 'admin-01',
    name: 'A Admin',
    email: 'admin@acomp.com',
    role: 'admin',
    clientId: 'client-a-123', 
     password: '1234'
  },
  {
    id: 'user-01',
    name: 'A User',
    email: 'user@acomp.com',
    role: 'user',
    clientId: 'client-a-123',
     password: '1234'
  },
  // Usuario de la Compañía Beta
  {
    id: 'user-02',
    name: 'B User',
    email: 'user@bcomp.com',
    role: 'user',
    clientId: 'client-b-456',
     password: '1234'
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