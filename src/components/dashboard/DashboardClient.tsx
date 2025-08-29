'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { VisualItem, PageConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { VisualWrapper } from './VisualWrapper';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Componente Props ahora recibe los IDs desde la página
interface DashboardClientProps {
  dashboardId: string;
  pageId: string;
}

export default function DashboardClient({ dashboardId, pageId }: DashboardClientProps) {
    const { user } = useAuth();
    const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
    const [kpiData, setKpiData] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

    const handleFilterChange = useCallback((filterKey: string, value: any) => {
        console.log(`Filter changed: { ${filterKey}:`, value, `}`);
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
    }, []);

    useEffect(() => {
        if (user && dashboardId && pageId) {
            const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';
            
            const fetchPageData = async () => {
                setLoading(true);
                setError(null);
                try {
                    // 1. Fetch page configuration
                    const configResponse = await fetch(`${API_BASE_URL}/dashboards/${clientApiId}/${dashboardId}/${pageId}/config`);
                    if (!configResponse.ok) {
                        const errorData = await configResponse.json();
                        throw new Error(errorData.detail || 'Failed to load page configuration.');
                    }
                    const config: PageConfig = await configResponse.json();
                    setPageConfig(config);

                    // 2. If a base endpoint is defined, fetch base data and then KPIs
                    if (config.base_endpoint) {
                        const dataResponse = await fetch(`${API_BASE_URL}/data/${clientApiId}/${config.base_endpoint}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({}), // Send empty filters object
                        });
                        if (!dataResponse.ok) {
                            throw new Error('Failed to load base data for KPIs.');
                        }
                        const baseData = await dataResponse.json();

                        const kpiResponse = await fetch(`${API_BASE_URL}/kpis/${clientApiId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(baseData),
                        });
                        if (!kpiResponse.ok) {
                            throw new Error('Failed to calculate KPIs.');
                        }
                        const kpis = await kpiResponse.json();
                        setKpiData(kpis);
                    }
                } catch (err) {
                    console.error("Error loading dashboard page:", err);
                    setError(err instanceof Error ? err.message : "An unexpected error occurred.");
                } finally {
                    setLoading(false);
                }
            };
            fetchPageData();
        }
    }, [user, dashboardId, pageId]);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
    if (error) {
        return (
            <Card className="m-auto mt-10 w-full max-w-lg bg-destructive/10 border-destructive">
              <CardHeader><CardTitle className="text-destructive">Error al Cargar Dashboard</CardTitle></CardHeader>
              <CardContent><p>{error}</p></CardContent>
            </Card>
        );
    }
    if (!pageConfig) return null;

    return (
        <div className="w-full space-y-8 p-4 md:p-8">
            <header>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{pageConfig.name}</h1>
            </header>
            <div 
                className="w-full grid gap-6"
                style={{
                    gridTemplateColumns: `repeat(${pageConfig.layout.columns}, minmax(0, 1fr))`,
                    gridAutoRows: '80px',
                }}
            >
                {pageConfig.visuals.map((item: VisualItem) => {
                    const gridStyle = { 
                        gridColumn: `span ${item.grid_position.w}`, 
                        gridRow: `span ${item.grid_position.h}`,
                        minHeight: 0
                    };
                    
                    return (
                        <div key={item.id} style={gridStyle}>
                            <VisualWrapper 
                                item={item} 
                                kpiData={kpiData}
                                activeFilters={activeFilters} 
                                onFilterChange={handleFilterChange} 
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}