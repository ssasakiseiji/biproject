'use server';

import { summarizeDashboard } from '@/ai/flows/dashboard-summary';
import type { Dashboard, DashboardData, DashboardPage } from '@/lib/types';

export async function generateDashboardSummaryAction(dashboard: Dashboard, dashboardData: DashboardData, page: DashboardPage) {
  try {
    const result = await summarizeDashboard({
      dashboardName: `${dashboard.name} - ${page.name}`,
      dashboardData: JSON.stringify(dashboardData),
    });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return { success: false, error: 'Failed to generate summary. Please try again.' };
  }
}
