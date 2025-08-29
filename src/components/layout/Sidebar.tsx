'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleDashboards } from '@/services/dataService';
import type { Dashboard } from '@/lib/types';
import { 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Wand2,
  Loader2
} from 'lucide-react';
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar, // Sigue siendo útil para móvil
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SearchableDropdown } from '../common/SearchableDropdown';

export function Sidebar() {
  const { user, logout } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
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
        const firstPage = dashboard.pages?.find(p => p.id);
        if (firstPage) {
            router.push(`/dashboard/${dashboard.id}/${firstPage.id}`);
        } else {
            router.push(`/dashboard/${dashboard.id}/no-pages`);
        }
        setOpenMobile(false);
    }
  };
  
  const handleLogout = () => {
    setOpenMobile(false);
    logout();
  }

  const selectedDashboardPages = selectedDashboard?.pages || [];

  return (
    <UiSidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold font-headline">KIN BI</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="mb-4">
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Dashboards</h2>
            {loading ? (
                <div className="flex items-center justify-center h-9">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            ) : (
                <SearchableDropdown
                    options={dashboards.map(d => ({ value: d.id, label: d.name }))}
                    onSelect={handleDashboardSelect}
                    placeholder="Seleccionar dashboard..."
                    selectedValue={selectedDashboard?.id}
                />
            )}
        </div>
        
        {selectedDashboardPages.length > 0 && (
           <div className="mb-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Páginas</h3>
            <SidebarMenu>
              {selectedDashboardPages.map((page) => (
                page.id ? (
                <SidebarMenuItem key={page.id}>
                    <Button 
                        asChild 
                        variant={pathname.endsWith(`/${page.id}`) ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                    >
                        <Link href={`/dashboard/${selectedDashboard?.id}/${page.id}`} onClick={() => setOpenMobile(false)}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>{page.name}</span>
                        </Link>
                    </Button>
                </SidebarMenuItem>
                ) : null
              ))}
            </SidebarMenu>
           </div>
        )}

        {user?.role === 'admin' && (
          <div className="mb-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Admin</h3>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Button 
                        asChild 
                        variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                    >
                        <Link href="/admin" onClick={() => setOpenMobile(false)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Panel de Admin</span>
                        </Link>
                    </Button>
                </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="p-4 space-y-2">
            <SidebarMenuItem>
                <Button 
                    asChild 
                    variant={pathname.startsWith('/ai-analyst') ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                >
                    <Link href="/ai-analyst" onClick={() => setOpenMobile(false)}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        <span>Analista IA</span>
                    </Link>
                </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Button 
                    asChild
                    variant={pathname.startsWith('/settings') ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                >
                    <Link href="/settings" onClick={() => setOpenMobile(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                    </Link>
                </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </SidebarFooter>
    </UiSidebar>
  );
}