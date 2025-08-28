'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Transaction } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { getPageData } from '@/services/dataService';
import { aggregateData } from '@/utils/dataProcessor';
import Loading from '@/app/(main)/dashboard/[dashboardId]/[pageId]/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

// Importación de todos los componentes visuales
import { KPICard } from './KPICard';
import { InteractiveBarChart } from './InteractiveBarChart';
import { InteractivePieChart } from './InteractivePieChart';
import { DataTable } from './DataTable';
import { VisualCard } from './VisualCard';
import { TextBlock } from './TextBlock';
import { FilterDropdown } from './FilterDropdown';
import { FilterSelector } from './FilterSelector';
import { FilterDateRange } from './FilterDateRange';

const API_BASE_URL = 'http://localhost:8000/api';

const componentMap: { [key: string]: React.ComponentType<any> } = {
    kpi: KPICard,
    interactive_bar_chart: InteractiveBarChart,
    interactive_pie_chart: InteractivePieChart,
    data_table: DataTable,
    text_block: TextBlock,
    filter_dropdown: FilterDropdown,
    filter_selector: FilterSelector,
    filter_date_range: FilterDateRange,
};

const formatValue = (value: any, format?: string, precision?: number) => {
    if (value === undefined || value === null) return 'N/A';
    if (format === 'currency') {
        return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
    }
    return value.toLocaleString();
};

type DrillDownState = {
    level: number;
    path: { key: string; value: string }[];
};

export default function DashboardClient({ dashboardId, pageId }: { dashboardId: string, pageId: string }) {
    const { user } = useAuth();
    const [pageConfig, setPageConfig] = useState<any>(null);
    const [baseData, setBaseData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [kpiData, setKpiData] = useState<any>({});
    const [drillDownState, setDrillDownState] = useState<Record<string, DrillDownState>>({});
    const [chartData, setChartData] = useState<Record<string, any[]>>({});

    useEffect(() => {
        if (user) {
            const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';

            const fetchConfigAndData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const configRes = await fetch(`${API_BASE_URL}/dashboards/${clientApiId}/${dashboardId}/${pageId}/config`);
                    if (!configRes.ok) throw new Error('No se pudo cargar la configuración del dashboard.');
                    const config = await configRes.json();
                    setPageConfig(config);

                    if (config.base_endpoint) {
                        const data = await getPageData(clientApiId, config.base_endpoint);
                        setBaseData(data);
                    } else {
                        throw new Error("La configuración del dashboard no especifica un 'base_endpoint' de datos.");
                    }
                } catch (err) {
                    console.error("Error al cargar el dashboard:", err);
                    setError(err instanceof Error ? err.message : "Un error inesperado ocurrió.");
                } finally {
                    setLoading(false);
                }
            };
            fetchConfigAndData();
        }
    }, [user, dashboardId, pageId]);

    const handleFilterChange = useCallback((filterKey: string, value: any) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
    }, []);

    const filteredData = useMemo(() => {
        return baseData.filter(item => {
            return Object.entries(activeFilters).every(([key, value]) => {
                if (value === null || value === undefined) return true;
                if (key === 'fecha' && typeof value === 'object' && value.from && value.to) {
                    const itemDate = new Date(item.fecha);
                    return itemDate >= value.from && itemDate <= value.to;
                }
                return item[key as keyof Transaction] === value;
            });
        });
    }, [baseData, activeFilters]);

    useEffect(() => {
        if (!user || !baseData || baseData.length === 0) {
            setKpiData({});
            return;
        };
        const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';
        const dataToSend = Object.values(activeFilters).some(v => v !== null && v !== undefined) ? filteredData : baseData;
        
        if (dataToSend.length === 0 && baseData.length > 0) {
            setKpiData({ totalIngresos: 0, totalUnidadesVendidas: 0, promedioVenta: 0, totalTransacciones: 0 });
            return;
        }

        const fetchKpis = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/kpis/${clientApiId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend),
                });
                if (!response.ok) throw new Error('Failed to fetch KPIs');
                const kpis = await response.json();
                setKpiData(kpis);
            } catch (error) {
                console.error("Error fetching KPIs:", error);
                setKpiData({});
            }
        };
        fetchKpis();
    }, [user, filteredData, baseData, activeFilters]);

    // ✅ REFACTORIZADO: Lógica de carga de datos para gráficos
    useEffect(() => {
        if (!pageConfig || !user) return;
        
        const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';

        const fetchAllChartData = async () => {
            const chartVisuals = pageConfig.visuals.filter((v: any) => v.type.includes('chart'));

            // Usamos Promise.all para ejecutar todas las peticiones en paralelo
            const promises = chartVisuals.map((visual: any) => {
                const drill = drillDownState[visual.id] || { level: 0, path: [] };
                const groupByLevels = [visual.filter_key, ...(visual.drill_down_levels || [])];
                const currentGroupBy = groupByLevels.slice(0, drill.level + 1);

                const drilledData = filteredData.filter(item => 
                    drill.path.every((p: {key: string, value: string}) => item[p.key as keyof Transaction] === p.value)
                );

                return fetch(`${API_BASE_URL}/data/chart/${clientApiId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        base_data: drilledData,
                        group_by: currentGroupBy,
                        metric: 'ingresos'
                    }),
                })
                .then(res => res.json())
                .then(data => ({ chartId: visual.id, data }))
                .catch(error => {
                    console.error(`Error fetching data for chart ${visual.id}:`, error);
                    return { chartId: visual.id, data: [] }; // Devuelve datos vacíos en caso de error
                });
            });

            // Esperamos a que todas las peticiones terminen
            const results = await Promise.all(promises);

            // Creamos un nuevo objeto con todos los datos y actualizamos el estado una sola vez
            const newChartData = results.reduce((acc, result) => {
                acc[result.chartId] = result.data;
                return acc;
            }, {} as Record<string, any[]>);
            
            setChartData(newChartData);
        };

        fetchAllChartData();
    }, [pageConfig, user, filteredData, drillDownState]);

    const handleChartClick = (visual: any, value: string) => {
        const currentDrill = drillDownState[visual.id] || { level: 0, path: [] };
        if (visual.drill_down_levels && currentDrill.level < visual.drill_down_levels.length) {
            const groupByLevels = [visual.filter_key, ...(visual.drill_down_levels || [])];
            const newDrill = {
                level: currentDrill.level + 1,
                path: [...currentDrill.path, { key: groupByLevels[currentDrill.level], value: value }]
            };
            setDrillDownState(prev => ({ ...prev, [visual.id]: newDrill }));
        }
    };

    const handleDrillUp = (visualId: string) => {
        const currentDrill = drillDownState[visualId];
        if (!currentDrill || currentDrill.level === 0) return;
        const newDrill = {
            level: currentDrill.level - 1,
            path: currentDrill.path.slice(0, -1)
        };
        setDrillDownState(prev => ({ ...prev, [visualId]: newDrill }));
    };

    if (loading) return <Loading />;
    if (error) {
        return (
            <Card className="m-auto mt-10 w-full max-w-lg bg-destructive/10 border-destructive">
              <CardHeader><CardTitle className="text-destructive">Error al Cargar el Dashboard</CardTitle></CardHeader>
              <CardContent><p>{error}</p><p className="mt-4 text-sm text-muted-foreground">Por favor, intenta refrescar la página o contacta a soporte.</p></CardContent>
            </Card>
        );
    }
    if (!pageConfig) return null;

    return (
        <div className="w-full space-y-8">
            <header><h1 className="text-4xl font-bold font-headline">{pageConfig.name}</h1></header>
            <div className="w-full grid gap-6" style={{ gridTemplateColumns: `repeat(${pageConfig.grid.columns}, minmax(0, 1fr))` }}>
                {pageConfig.visuals.map((visual: any) => {
                    const Component = componentMap[visual.type];
                    if (!Component) return null;
                    const gridStyle = { gridColumn: `span ${visual.grid_position.w}`, gridRow: `span ${visual.grid_position.h}` };

                    if (visual.type.startsWith('filter_')) {
                        return ( <div key={visual.id} style={gridStyle}> <Component title={visual.title} config={visual.config} onFilterChange={handleFilterChange} /> </div> );
                    }
                    if (visual.type === 'text_block') {
                        return ( <div key={visual.id} style={gridStyle}> <Component content={visual.content} /> </div> );
                    }
                    if (visual.type === 'kpi') {
                        const key = visual.data_source.split('.')[1];
                        const value = kpiData[key];
                        return ( <div key={visual.id} style={gridStyle}> <KPICard title={visual.title} value={formatValue(value, visual.format, visual.precision)} /> </div> );
                    }

                    let visualData: any;
                    const props: any = { title: visual.title };

                    if (visual.type.includes('chart')) {
                        visualData = chartData[visual.id] || [];
                        props.data = visualData;
                        props.onBarClick = (val: string) => handleChartClick(visual, val);
                        props.onSliceClick = (val: string) => handleChartClick(visual, val);
                    } else if (visual.type === 'data_table') {
                        visualData = filteredData;
                        props.data = visualData;
                    }
                    
                    const drill = drillDownState[visual.id];
                    const isDrilledDown = drill && drill.level > 0;

                    return (
                        <div key={visual.id} style={gridStyle}>
                            <VisualCard title={visual.title} visualId={visual.id} exportType={visual.type.includes('chart') ? 'image' : 'csv'} exportData={visualData}>
                                {isDrilledDown && (
                                    <Button variant="ghost" size="sm" className="absolute top-2 right-12 z-10" onClick={() => handleDrillUp(visual.id)}>
                                        <ArrowUp className="h-4 w-4 mr-1" /> Subir Nivel
                                    </Button>
                                )}
                                <Component {...props} />
                            </VisualCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}