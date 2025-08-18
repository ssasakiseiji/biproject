'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleDashboards } from '@/services/dataService';
import type { Dashboard } from '@/lib/types';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        getAccessibleDashboards(user.id)
          .then((dashboards: Dashboard[]) => {
            if (dashboards.length > 0) {
              const firstDashboard = dashboards[0];
              if (firstDashboard.pages && firstDashboard.pages.length > 0) {
                 router.replace(`/dashboard/${firstDashboard.id}/${firstDashboard.pages[0].id}`);
              } else {
                // Fallback if a dashboard has no pages
                router.replace(`/dashboard/${firstDashboard.id}`);
              }
            } else {
              // In a real app, show a "No dashboards" message
              // For now, redirecting to a generic dashboard route
               router.replace('/dashboard/no-access');
            }
          })
          .catch(() => {
            router.replace('/login');
          });
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 animate-spin text-primary"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="text-lg text-muted-foreground">Loading BizzViz...</p>
      </div>
    </div>
  );
}
