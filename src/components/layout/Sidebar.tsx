'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleDashboards } from '@/services/dataService';
import type { Dashboard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user, logout } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAccessibleDashboards(user.id)
        .then(setDashboards)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const closeSheet = () => setIsMobileSheetOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <header className="border-b p-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeSheet}>
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">BizzViz</h1>
        </Link>
      </header>
      <nav className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Dashboards</h2>
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted animate-pulse h-9 w-full">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-1">
              {dashboards.map((dashboard) => (
                <li key={dashboard.id}>
                  <Button
                    asChild
                    variant={pathname.startsWith(`/dashboard/${dashboard.id}`) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Link href={`/dashboard/${dashboard.id}`} onClick={closeSheet}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {dashboard.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {user?.role === 'admin' && (
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Admin</h2>
            <ul className="space-y-1">
              <li>
                <Button
                  asChild
                  variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Link href="/admin" onClick={closeSheet}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <footer className="mt-auto space-y-2 border-t p-4">
        <div className="flex items-center justify-between">
           <p className="text-sm text-muted-foreground">Theme</p>
           <ThemeToggle />
        </div>
         <Button
            asChild
            variant={pathname.startsWith('/settings') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            >
            <Link href="/settings" onClick={closeSheet}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
            </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <div className="text-center text-xs text-muted-foreground">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-card">
        {sidebarContent}
      </aside>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden p-4">
        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
