
import { getDashboardById, getPageData } from '@/services/dataService';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { notFound } from 'next/navigation';
import type { Transaction } from '@/lib/types';

type DashboardPageProps = {
  params: {
    dashboardId: string;
    pageId: string;
  };
};

export async function generateMetadata({ params }: DashboardPageProps) {
  const dashboard = await getDashboardById(params.dashboardId);
  const page = dashboard?.pages?.find(p => p.id === params.pageId);
  if (!dashboard || !page) {
    return { title: 'Page Not Found' };
  }
  return {
    title: `${dashboard.name}: ${page.name} | BizzViz`,
  };
}


export default async function DashboardPage({ params }: DashboardPageProps) {
  const { dashboardId, pageId } = params;

  try {
    const [pageData, dashboard] = await Promise.all([
      getPageData(dashboardId, pageId) as Promise<Transaction[]>,
      getDashboardById(dashboardId)
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
