'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loadingRole, setLoadingRole] = useState<'admin' | 'user' | null>(null);

  const handleLogin = async (role: 'admin' | 'user') => {
    setLoadingRole(role);
    const email = role === 'admin' ? 'admin@bizzviz.com' : 'user@bizzviz.com';
    try {
      await login(email);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not log in. Please try again.',
      });
      setLoadingRole(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BarChart3 className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline">BizzViz</CardTitle>
          <CardDescription>Your Business Intelligence Partner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              For this prototype, please select a role to log in.
            </p>
            <Button
              onClick={() => handleLogin('admin')}
              disabled={!!loadingRole}
              className="w-full"
              size="lg"
            >
              {loadingRole === 'admin' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Login as Admin
            </Button>
            <Button
              onClick={() => handleLogin('user')}
              disabled={!!loadingRole}
              variant="secondary"
              className="w-full"
               size="lg"
            >
              {loadingRole === 'user' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Login as User
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
