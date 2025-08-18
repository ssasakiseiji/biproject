'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || user?.role !== 'admin') {
    return (
       <div className="flex h-screen w-full items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Admin Panel</h1>
                <p className="text-muted-foreground">Welcome, Administrator.</p>
            </header>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>All systems are operational.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>This is a protected area for administrators. Future administrative components and functionalities will be placed here.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
