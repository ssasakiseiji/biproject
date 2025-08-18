'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleDashboards, getDashboardPages } from '@/services/dataService';
import type { Dashboard, DashboardPage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Menu,
  Wand2,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SearchableDropdown } from '../common/SearchableDropdown';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  
  const currentDashboardId = pathname.split('/')[2];

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAccessibleDashboards(user.id)
        .then(userDashboards => {
          setDashboards(userDashboards);
          if (currentDashboardId) {
            const current = userDashboards.find(d => d.id === currentDashboardId);
            setSelectedDashboard(current || null);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, currentDashboardId]);


  const handleDashboardSelect = (dashboardId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
        setSelectedDashboard(dashboard);
        if (dashboard.pages && dashboard.pages.length > 0) {
            router.push(`/dashboard/${dashboard.id}/${dashboard.pages[0].id}`);
        } else {
             router.push(`/dashboard/${dashboard.id}`);
        }
    }
     closeSheet();
  };

  const handleAiAnalystClick = () => {
    toast({
        title: "AI Analyst",
        description: "This feature is coming soon!",
    });
  }

  const closeSheet = () => setIsMobileSheetOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card text-card-foreground">
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
             <div className="flex items-center gap-2 p-2 rounded-md bg-muted animate-pulse h-9 w-full">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
          ) : (
            <SearchableDropdown
              options={dashboards.map(d => ({ value: d.id, label: d.name }))}
              onSelect={handleDashboardSelect}
              placeholder="Select a dashboard..."
              selectedValue={selectedDashboard?.id}
            />
          )}
        </div>
        
        {selectedDashboard && selectedDashboard.pages && (
           <div>
            <h3 className="my-2 text-xs font-semibold uppercase text-muted-foreground">{selectedDashboard.name} Pages</h3>
            <ul className="space-y-1">
              {selectedDashboard.pages.map((page) => (
                <li key={page.id}>
                  <Button
                    asChild
                    variant={pathname.endsWith(`/${page.id}`) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Link href={`/dashboard/${selectedDashboard.id}/${page.id}`} onClick={closeSheet}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {page.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
           </div>
        )}

        {user?.role === 'admin' && (
          <div>
            <h2 className="my-2 text-xs font-semibold uppercase text-muted-foreground">Admin</h2>
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
          </div>
        )}
      </nav>

      <footer className="mt-auto space-y-2 border-t p-4">
         <Button variant="ghost" className="w-full justify-start" onClick={handleAiAnalystClick}>
            <Wand2 className="mr-2 h-4 w-4" />
            AI Analyst
        </Button>
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
        <Button variant="outline" className="w-full justify-start" onClick={() => { closeSheet(); logout();}}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <div className="pt-2 text-center text-xs text-muted-foreground">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r">
        {sidebarContent}
      </aside>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden p-4 absolute top-0 left-0 z-50">
        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
