
'use server';

import type { Dashboard, DashboardData, User, DashboardPage, Transaction } from '@/lib/types';
import { mockDashboards, mockPermissions, mockUsers } from '@/_mock/db';
import financialsData from '@/_mock/dashboardData/financials.json';
import salesData from '@/_mock/dashboardData/sales.json';

const allDashboardData: Record<string, any> = {
  financials: financialsData,
  sales: salesData,
};


export async function getAccessibleDashboards(userId: string): Promise<Dashboard[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userPermissions = mockPermissions.find(p => p.userId === userId);
      if (!userPermissions) {
        resolve([]);
        return;
      }
      
      const accessibleDashboards = mockDashboards.filter(d => 
        userPermissions.dashboardAccess.some(da => da.dashboardId === d.id)
      ).map(dashboard => {
        const userAccess = userPermissions.dashboardAccess.find(da => da.dashboardId === dashboard.id);
        // For this interactive prototype, all pages under an accessible dashboard are available
        const accessiblePages = dashboard.pages || [];
        return { ...dashboard, pages: accessiblePages };
      });

      resolve(accessibleDashboards);
    }, 200);
  });
}

export async function getDashboardById(dashboardId: string): Promise<Dashboard | undefined> {
    return mockDashboards.find(d => d.id === dashboardId);
}


export async function getDashboardPages(dashboardId: string): Promise<DashboardPage[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dashboard = mockDashboards.find(d => d.id === dashboardId);
      resolve(dashboard?.pages || []);
    }, 100);
  });
}

export async function getPageData(dashboardId: string, pageId: string): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dashboardData = allDashboardData[dashboardId];
      if (dashboardData) {
        // Now returns the entire array of transactions for client-side processing
        resolve(dashboardData);
      } else {
        reject(new Error(`Data for dashboard '${dashboardId}' not found.`));
      }
    }, 200);
  });
}

export async function getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUsers);
        }, 150);
    });
}
