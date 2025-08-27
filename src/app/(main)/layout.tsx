'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar'; // Solo necesitamos el Provider

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 animate-spin text-primary"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-muted/40">
        {/* 1. Sidebar con ancho fijo y sin encogerse */}
        <Sidebar />
        
        {/* 2. Contenedor del contenido principal */}
        {/* - flex-1: Ocupa todo el espacio restante */}
        {/* - overflow-y-auto: Maneja su propio scroll vertical */}
        <main className="flex-1 overflow-y-auto">
          {/* 3. Div interno para el padding */}
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}