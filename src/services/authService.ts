import { mockUsers } from '@/_mock/db';
import type { User } from '@/lib/types';

export const authService = {
  // ✅ La función ahora acepta y valida email y contraseña
  login: (email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const user = mockUsers.find((u) => u.email === email);

      if (user && user.password === password) {
        // Por seguridad, nunca devolvemos la contraseña al frontend
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword as User);
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      resolve();
    });
  },
};