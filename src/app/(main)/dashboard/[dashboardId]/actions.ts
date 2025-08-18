'use server';

import { summarizeDashboard } from '@/ai/flows/dashboard-summary';
import type { Dashboard, DashboardData } from '@/lib/types';

export async function generateDashboardSummaryAction(dashboard: Dashboard, dashboardData: DashboardData) {
  try {
    const result = await summarizeDashboard({
      dashboardName: dashboard.name,
      dashboardData: JSON.stringify(dashboardData),
    });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return { success: false, error: 'Failed to generate summary. Please try again.' };
  }
}
