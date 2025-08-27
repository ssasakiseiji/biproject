'use server';

import type { Dashboard, User, DashboardPage, Transaction } from '@/lib/types';
import { mockUsers } from '@/_mock/db';
import financialsData from '@/_mock/dashboardData/financials.json';
import salesData from '@/_mock/dashboardData/sales.json';
import salesDashboardConfig from '@/_mock/dashboardConfigs/sales.json';

const allDashboardData: Record<string, any> = {
  financials: financialsData,
  sales: salesData,
};

export async function getAccessibleDashboards(userId: string): Promise<Dashboard[]> {
  const allAvailableDashboards: Dashboard[] = [];
  const salesPages: DashboardPage[] = salesDashboardConfig.pages.map(p => ({
    id: p.pageId,
    name: p.name,
  }));
  
  allAvailableDashboards.push({
    id: salesDashboardConfig.dashboardId,
    name: salesDashboardConfig.name,
    path: `/dashboard/${salesDashboardConfig.dashboardId}`,
    pages: salesPages,
  });

  const user = mockUsers.find(u => u.id === userId);
  if (user?.role === 'admin') {
    return allAvailableDashboards;
  }
  
  return allAvailableDashboards.filter(d => d.id === 'sales');
}

export async function getDashboardById(dashboardId: string): Promise<Dashboard | undefined> {
    if (dashboardId === salesDashboardConfig.dashboardId) {
        const salesPages: DashboardPage[] = salesDashboardConfig.pages.map(p => ({
            id: p.pageId,
            name: p.name,
        }));
        return {
            id: salesDashboardConfig.dashboardId,
            name: salesDashboardConfig.name,
            path: `/dashboard/${salesDashboardConfig.dashboardId}`,
            pages: salesPages,
        };
    }
    return undefined;
}

export async function getPageData(dashboardId: string, pageId: string): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    // Se elimina el setTimeout
    const dashboardData = allDashboardData[dashboardId];
    if (dashboardData) {
      resolve(dashboardData);
    } else {
      reject(new Error(`Data for dashboard '${dashboardId}' not found.`));
    }
  });
}

export async function getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
        // Se elimina el setTimeout
        resolve(mockUsers);
    });
}