'use server';

import type { Dashboard, User, DashboardPage, Transaction } from '@/lib/types';
import { mockUsers } from '@/_mock/db';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function getAccessibleDashboards(userId: string): Promise<Dashboard[]> {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    return [];
  }
  const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';
  try {
    const response = await fetch(`${API_BASE_URL}/dashboards/${clientApiId}`);
    if (!response.ok) {
      throw new Error(`Error fetching dashboards: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch accessible dashboards:", error);
    return [];
  }
}

// ✅ CORRECCIÓN: Se actualiza getPageData para que siempre use POST
export async function getPageData(clientId: string, endpointId: string, filters: object = {}): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${clientId}/${endpointId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters), // Enviamos los filtros en el cuerpo
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error fetching data for endpoint ${endpointId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch page data for ${endpointId}:`, error);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
    return Promise.resolve(mockUsers);
}