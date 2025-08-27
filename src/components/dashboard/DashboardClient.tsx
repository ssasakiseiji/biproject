'use client';

import { useState, useMemo } from 'react';
import type { Dashboard, DashboardPage, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateKPIs, aggregateData } from '@/utils/dataProcessor';
import { KPICard } from './KPICard';
import { InteractiveBarChart } from './InteractiveBarChart';
import { InteractivePieChart } from './InteractivePieChart';
import { DataTable } from './DataTable';
import { VisualCard } from './VisualCard';
// 1. Importar componentes para el panel de filtros
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import dashboardConfig from '@/_mock/dashboardConfigs/sales.json';

type DashboardClientProps = {
  initialData: Transaction[];
  dashboard: Dashboard;
  page: DashboardPage;
};

type ActiveFilters = {
    [key: string]: string | null;
};

const componentMap = {
    kpi: KPICard,
    interactive_bar_chart: InteractiveBarChart,
    interactive_pie_chart: InteractivePieChart,
    data_table: DataTable,
};

const formatValue = (value: any, format?: string, precision?: number) => {
    if (value === undefined || value === null) return 'N/A';
    if (format === 'currency') {
        return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
    }
    return value.toLocaleString();
};

const ALL_ITEMS_VALUE = '__ALL__';

export default function DashboardClient({ initialData, dashboard, page }: DashboardClientProps) {
  const [originalData] = useState<Transaction[]>(initialData);
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // 2. Extraer opciones únicas para los selectores de filtro
  const uniqueRegions = useMemo(() => [...new Set(originalData.map(item => item.region))], [originalData]);
  const uniqueCategories = useMemo(() => [...new Set(originalData.map(item => item.categoria))], [originalData]);

  const currentPageConfig = useMemo(() => {
    return dashboardConfig.pages.find(p => p.pageId === page.id);
  }, [page.id]);

  useMemo(() => {
    if (currentPageConfig) {
      const maxColumns = currentPageConfig.grid.columns;
      currentPageConfig.visuals.forEach(visual => {
        if (visual.grid_position.x + visual.grid_position.w > maxColumns) {
          console.error(
            `Error de configuración: La visualización "${visual.title}" (ID: ${visual.id}) excede el número máximo de columnas (${maxColumns}).`
          );
        }
      });
    }
  }, [currentPageConfig]);

  const filteredData = useMemo(() => {
    return originalData.filter(item => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        return item[key as keyof Transaction] === value;
      });
    });
  }, [originalData, activeFilters]);

  const dynamicDataSources = useMemo(() => {
    const sources: { [key: string]: any } = {};
    sources.kpis = calculateKPIs(filteredData);
    sources.transactions = filteredData;
    
    currentPageConfig?.visuals.forEach(visual => {
        if (visual.type.includes('chart')) {
            const groupBy = visual.filter_key as keyof Transaction;
            sources[visual.id] = aggregateData(filteredData, groupBy, 'ingresos');
        }
    });
    return sources;
  }, [filteredData, currentPageConfig]);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
        ...prev,
        [filterType]: value === ALL_ITEMS_VALUE ? null : value
    }));
  };

  const handleChartClick = (filterType: string, value: string) => {
    const newFilterValue = activeFilters[filterType] === value ? null : value;
    setActiveFilters(prev => ({ ...prev, [filterType]: newFilterValue }));
  };

  const resetFilters = () => {
    setActiveFilters({});
  };
  
  if (!currentPageConfig) {
      return <div className="text-center text-destructive">Error: No se encontró la configuración para esta página del dashboard.</div>;
  }

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== null);

  return (
    <div className="w-full space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold font-headline">{dashboard.name}</h1>
          <p className="text-muted-foreground">{page.name}</p>
        </div>
        <div className="flex items-center gap-2">
            {/* --- 3. BOTÓN DE FILTROS AHORA ABRE EL SHEET --- */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filtros del Dashboard</SheetTitle>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                        {/* Filtro por Región */}
                        <div className="space-y-2">
                            <Label htmlFor="region-filter">Región</Label>
                            <Select
                                value={activeFilters.region || ALL_ITEMS_VALUE}
                                onValueChange={(value) => handleFilterChange('region', value)}
                            >
                                <SelectTrigger id="region-filter">
                                    <SelectValue placeholder="Seleccionar Región" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_ITEMS_VALUE}>Todas las Regiones</SelectItem>
                                    {uniqueRegions.map(region => (
                                        <SelectItem key={region} value={region}>{region}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Filtro por Categoría */}
                        <div className="space-y-2">
                            <Label htmlFor="category-filter">Categoría</Label>
                             <Select
                                value={activeFilters.categoria || ALL_ITEMS_VALUE}
                                onValueChange={(value) => handleFilterChange('categoria', value)}
                            >
                                <SelectTrigger id="category-filter">
                                    <SelectValue placeholder="Seleccionar Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_ITEMS_VALUE}>Todas las Categorías</SelectItem>
                                    {uniqueCategories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button 
                            variant="ghost"
                            onClick={resetFilters}
                            disabled={!hasActiveFilters}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                        <SheetClose asChild>
                            <Button>Hecho</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
      </header>
      
      <div 
        className="w-full grid gap-6"
        style={{
            gridTemplateColumns: `repeat(${currentPageConfig.grid.columns}, minmax(0, 1fr))`,
            gridAutoRows: 'min-content'
        }}
      >
        {currentPageConfig.visuals.map(visual => {
            const Component = componentMap[visual.type as keyof typeof componentMap];
            if (!Component) return null;

            const gridStyle = {
                gridColumn: `span ${visual.grid_position.w}`,
                gridRow: `span ${visual.grid_position.h}`,
            };

            let componentProps: any = {};
            let visualData: any;

            if (visual.type === 'kpi') {
                if (visual.data_source) {
                    const [source, key] = visual.data_source.split('.');
                    const value = dynamicDataSources[source] ? dynamicDataSources[source][key] : undefined;
                    return (
                        <div key={visual.id} style={gridStyle}>
                            <KPICard title={visual.title} value={formatValue(value, visual.format, visual.precision)} />
                        </div>
                    );
                }
                return null;
            } else if (visual.type.includes('chart')) {
                visualData = dynamicDataSources[visual.id] || [];
                componentProps = {
                    chartId: visual.id,
                    data: visualData,
                    onBarClick: (value: string) => handleChartClick(visual.filter_key!, value),
                    onSliceClick: (value: string) => handleChartClick(visual.filter_key!, value),
                };
            } else if (visual.type === 'data_table') {
                visualData = dynamicDataSources.transactions || [];
                componentProps = {
                    tableId: visual.id,
                    data: visualData,
                };
            }
            
            return (
                 <div key={visual.id} style={gridStyle}>
                    <VisualCard
                        title={visual.title}
                        visualId={visual.id}
                        isExcluded={false}
                        onToggleExclude={() => alert(`Excluir ${visual.id}`)}
                        exportType={visual.type.includes('chart') ? 'image' : 'csv'}
                        exportData={visualData}
                        filterOptions={[]}
                        onFilterChange={()=>{}}
                    >
                        <Component {...componentProps} />
                    </VisualCard>
                </div>
            );
        })}
      </div>
    </div>
  );
}