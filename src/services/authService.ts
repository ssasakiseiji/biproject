import { mockUsers } from '@/_mock/db';
import type { User } from '@/lib/types';

export const authService = {
  login: (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },
};
