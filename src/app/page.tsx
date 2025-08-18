'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleDashboards } from '@/services/dataService';
import type { Dashboard } from '@/lib/types';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user) {
        getAccessibleDashboards(user.id)
          .then((dashboards: Dashboard[]) => {
            if (dashboards.length > 0) {
              router.replace(`/dashboard/${dashboards[0].id}`);
            } else {
              // Handle case where user has no dashboards
              // For now, just stay on a loading-like page
              // In a real app, you might show a "No dashboards" message
              setIsRedirecting(false); 
            }
          })
          .catch(() => {
            // Handle error fetching dashboards
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
