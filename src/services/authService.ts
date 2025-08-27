import { mockUsers } from '@/_mock/db';
import type { User } from '@/lib/types';

export const authService = {
  login: (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Se elimina el setTimeout
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      // Se elimina el setTimeout
      resolve();
    });
  },
};