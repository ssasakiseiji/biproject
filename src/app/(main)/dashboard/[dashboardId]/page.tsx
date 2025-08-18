import { getDashboardData, getDashboardById } from '@/services/dataService';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { notFound } from 'next/navigation';

type DashboardPageProps = {
  params: {
    dashboardId: string;
  };
};

export async function generateMetadata({ params }: DashboardPageProps) {
  const dashboard = await getDashboardById(params.dashboardId);
  if (!dashboard) {
    return { title: 'Dashboard Not Found' };
  }
  return {
    title: `${dashboard.name} Dashboard | BizzViz`,
  };
}


export default async function DashboardPage({ params }: DashboardPageProps) {
  const { dashboardId } = params;

  try {
    const [initialData, dashboard] = await Promise.all([
      getDashboardData(dashboardId),
      getDashboardById(dashboardId)
    ]);

    if (!dashboard) {
        notFound();
    }

    return <DashboardClient initialData={initialData} dashboard={dashboard} />;
  } catch (error) {
    notFound();
  }
}
