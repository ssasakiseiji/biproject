'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { KPICard } from './KPICard';
import { BarChartComponent as BarChart } from './BarChart';
import { PieChartComponent as PieChart } from './PieChart';
import { InteractiveBarChart } from './InteractiveBarChart';
import { InteractivePieChart } from './InteractivePieChart';
import { DataTable } from './DataTable';
import { TextBlock } from './TextBlock';
import { FilterDropdown } from './FilterDropdown';
import { FilterSelector } from './FilterSelector';
import { FilterDateRange } from './FilterDateRange';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const componentMap: { [key: string]: React.ComponentType<any> } = {
    kpi: KPICard,
    bar_chart: BarChart,
    pie_chart: PieChart,
    data_table: DataTable,
    text_block: TextBlock,
    interactive_bar_chart: InteractiveBarChart,
    interactive_pie_chart: InteractivePieChart,
    filter_dropdown: FilterDropdown,
    filter_selector: FilterSelector,
    filter_date_range: FilterDateRange,
};

export function VisualWrapper({ item, kpiData, activeFilters, onFilterChange }) {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // KPI data is passed down directly, not fetched here.
        if (item.type === 'kpi') {
            if (kpiData && item.data_source) {
                // Resolve the value from the kpiData object using the data_source string (e.g., "kpis.totalIngresos")
                const value = item.data_source.split('.').reduce((o, k) => (o || {})[k], { kpis: kpiData });
                setData({ value });
            }
            setLoading(false);
            return;
        }

        // Handle static content and filters without fetching data
        if (item.type === 'text_block' || item.type.startsWith('filter_')) {
            setLoading(false);
            return;
        }

        if (!user || !item.api_endpoint) {
            setLoading(false);
            if (!item.api_endpoint) {
                 console.warn(`No api_endpoint defined for visual item:`, item);
                 setError(`No se ha definido un endpoint para '${item.title}'`);
            }
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';
                
                const response = await fetch(`${API_BASE_URL}/data/${clientApiId}/${item.api_endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(activeFilters)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch data.');
                }
                const result = await response.json();
                setData(result);

            } catch (err) {
                console.error(`Error fetching data for ${item.id}:`, err);
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, item, activeFilters, kpiData]);

    const Component = componentMap[item.type];
    if (!Component) {
        return <div className="text-red-500">Error: Componente visual '{item.type}' no encontrado.</div>;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-xs text-destructive/80 p-2">
                {error}
            </div>
        );
    }

    // Prepare props for the specific component
    const props: any = { ...item, data };

    if (item.type.startsWith('filter_')) {
        props.onFilterChange = onFilterChange;
        props.value = activeFilters[item.config.filter_key];
    }
    
    // For KPI, the data is just the value, not an array
    if (item.type === 'kpi') {
        props.value = data?.value;
    }

    return <Component {...props} />;
}
