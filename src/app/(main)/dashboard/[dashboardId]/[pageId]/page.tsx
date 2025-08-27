// Ruta: src/app/(main)/dashboard/[dashboardId]/[pageId]/page.tsx

import { getDashboardById, getPageData } from '@/services/dataService';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { notFound } from 'next/navigation';
import type { Transaction } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: { dashboardId: string; pageId: string };
}) {
  const { dashboardId, pageId } = params;
  const dashboard = await getDashboardById(dashboardId);
  const page = dashboard?.pages?.find(p => p.id === pageId);

  if (!dashboard || !page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: `${dashboard.name}: ${page.name} | BizzViz`,
  };
}

export default async function DashboardPage({
  params,
}: {
  params: { dashboardId: string; pageId: string };
}) {
  const { dashboardId, pageId } = params;

  try {
    const [pageData, dashboard] = await Promise.all([
      getPageData(dashboardId, pageId) as Promise<Transaction[]>,
      getDashboardById(dashboardId),
    ]);

    const page = dashboard?.pages?.find(p => p.id === pageId);

    if (!dashboard || !page) {
      notFound();
    }

    return <DashboardClient initialData={pageData} dashboard={dashboard} page={page} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}