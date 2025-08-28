'use server';

import type { Dashboard, User, Transaction } from '@/lib/types';
import { mockUsers } from '@/_mock/db';

// URL base de la API del backend
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Obtiene la lista de dashboards a los que un usuario tiene acceso.
 * Ahora llama al backend para obtener esta lista.
 */
export async function getAccessibleDashboards(userId: string): Promise<Dashboard[]> {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    console.error(`Usuario no encontrado con id: ${userId}`);
    return [];
  }

  // Mapeamos el ID de cliente de nuestro mock a los IDs que espera el backend ('client_a', 'client_b')
  const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';

  try {
    const response = await fetch(`${API_BASE_URL}/dashboards/${clientApiId}`);
    if (!response.ok) {
      throw new Error(`Error fetching dashboards: ${response.statusText}`);
    }
    const dashboards: Dashboard[] = await response.json();
    return dashboards;
  } catch (error) {
    console.error("Failed to fetch accessible dashboards:", error);
    return [];
  }
}

/**
 * Obtiene la configuración completa de un dashboard específico por su ID.
 * Esto también vendrá del backend.
 */
export async function getDashboardConfig(clientId: string, dashboardId: string): Promise<any> {
    // Este endpoint aún no lo hemos creado, pero lo haremos en el futuro.
    // Por ahora, simulamos que lo obtenemos de la configuración del cliente.
    console.log(`Buscando dashboard ${dashboardId} para cliente ${clientId}`);
    // En una implementación real, este podría ser otro endpoint que devuelva solo la config del dashboard.
    return null; // De momento no lo necesitamos para la vista principal.
}

/**
 * Obtiene los datos para una visualización específica.
 */
export async function getPageData(clientId: string, endpointId: string): Promise<Transaction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${clientId}/${endpointId}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for endpoint ${endpointId}: ${response.statusText}`);
    }
    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch page data for ${endpointId}:`, error);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
    return Promise.resolve(mockUsers);
}