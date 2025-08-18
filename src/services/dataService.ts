'use server';

import type { Dashboard, DashboardData, User, DashboardPage } from '@/lib/types';
import { mockDashboards, mockPermissions, mockUsers } from '@/_mock/db';
import financials from '@/_mock/dashboardData/financials.json';
import sales from '@/_mock/dashboardData/sales.json';

const allDashboardData: Record<string, any> = {
  financials,
  sales,
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
        const accessiblePages = dashboard.pages?.filter(p => userAccess?.pageIds.includes(p.id)) || [];
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

export async function getPageData(dashboardId: string, pageId: string): Promise<DashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dashboardJson = allDashboardData[dashboardId];
      if (dashboardJson && dashboardJson[pageId]) {
        resolve(dashboardJson[pageId]);
      } else {
        reject(new Error(`Data for dashboard '${dashboardId}' page '${pageId}' not found.`));
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
