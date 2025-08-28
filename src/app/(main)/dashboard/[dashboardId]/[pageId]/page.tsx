// src/app/(main)/dashboard/[dashboardId]/[pageId]/page.tsx

import DashboardClient from '@/components/dashboard/DashboardClient';

// Esta página ahora solo pasa los parámetros al componente cliente.
export default function DashboardPage({
  params,
}: {
  params: { dashboardId: string; pageId: string };
}) {
  return <DashboardClient dashboardId={params.dashboardId} pageId={params.pageId} />;
}