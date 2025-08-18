'use server';

import type { Dashboard, DashboardData } from '@/lib/types';
import { mockDashboards, mockPermissions } from '@/_mock/db';
import financials from '@/_mock/dashboardData/financials.json';
import sales from '@/_mock/dashboardData/sales.json';

export async function getAccessibleDashboards(userId: string): Promise<Dashboard[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userPermissions = mockPermissions.find(p => p.userId === userId);
      if (!userPermissions) {
        resolve([]);
        return;
      }
      const accessibleDashboards = mockDashboards.filter(d => userPermissions.dashboardIds.includes(d.id));
      resolve(accessibleDashboards);
    }, 200);
  });
}

export async function getDashboardById(dashboardId: string): Promise<Dashboard | undefined> {
    return mockDashboards.find(d => d.id === dashboardId);
}

export async function getDashboardData(dashboardId: string): Promise<DashboardData> {
  // This function is intended to run on the server.
  // In a real app, this would fetch from a database or API.
  // For this prototype, we'll read from the imported JSON files.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dashboardId === 'financials') {
        resolve(financials as DashboardData);
      } else if (dashboardId === 'sales') {
        resolve(sales as DashboardData);
      } else {
        reject(new Error(`Dashboard data for ${dashboardId} not found.`));
      }
    }, 200);
  });
}
