
'use client';

import { useState, useMemo } from 'react';
import type { Dashboard, DashboardPage, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Filter, X } from 'lucide-react';
import { generateDashboardSummaryAction } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { calculateKPIs, aggregateData } from '@/utils/dataProcessor';
import { KPICard } from './KPICard';
import { InteractiveBarChart } from './InteractiveBarChart';
import { InteractivePieChart } from './InteractivePieChart';
import { DataTable } from './DataTable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DashboardClientProps = {
  initialData: Transaction[];
  dashboard: Dashboard;
  page: DashboardPage;
};

type ActiveFilters = {
    categoria: string | null;
    region: string | null;
};

const ALL_ITEMS_VALUE = '__ALL__';


export default function DashboardClient({ initialData, dashboard, page }: DashboardClientProps) {
  const [originalData] = useState<Transaction[]>(initialData);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categoria: null,
    region: null,
  });

  const [crossFilterConfig, setCrossFilterConfig] = useState({
    categoria: true,
    region: true,
  });

  const filteredData = useMemo(() => {
    return originalData.filter(item => {
      const categoriaMatch = !activeFilters.categoria || item.categoria === activeFilters.categoria;
      const regionMatch = !activeFilters.region || item.region === activeFilters.region;
      return categoriaMatch && regionMatch;
    });
  }, [originalData, activeFilters]);

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const dataByCategoria = useMemo(() => aggregateData(filteredData, 'categoria', 'ingresos'), [filteredData]);
  const dataByRegion = useMemo(() => aggregateData(filteredData, 'region', 'ingresos'), [filteredData]);

  const handleFilterChange = (filterType: keyof ActiveFilters, value: string | null) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleChartClick = (filterType: keyof ActiveFilters, value: string) => {
    // Only apply cross-filter if it's enabled for that chart type
    if (!crossFilterConfig[filterType]) return;

    // If clicking the same value again, reset the filter
    const newFilterValue = activeFilters[filterType] === value ? null : value;
    handleFilterChange(filterType, newFilterValue);
  };
  
  const resetFilters = () => {
    setActiveFilters({ categoria: null, region: null });
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    const result = await generateDashboardSummaryAction(dashboard, filteredData, page);
    setIsSummaryLoading(false);

    if (result.success) {
      setSummary(result.summary);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };
  
  const uniqueCategories = useMemo(() => [...new Set(originalData.map(item => item.categoria))], [originalData]);
  const uniqueRegions = useMemo(() => [...new Set(originalData.map(item => item.region))], [originalData]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold font-headline">{dashboard.name}</h1>
          <p className="text-muted-foreground">{page.name}</p>
        </div>
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <div className="p-4 space-y-6">
                        <h3 className="text-lg font-semibold">Filtros Globales</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-2 block">Categoría</Label>
                                <Select
                                    value={activeFilters.categoria || ALL_ITEMS_VALUE}
                                    onValueChange={(value) => handleFilterChange('categoria', value === ALL_ITEMS_VALUE ? null : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por Categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL_ITEMS_VALUE}>Todas las Categorías</SelectItem>
                                        {uniqueCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label className="mb-2 block">Región</Label>
                                <Select
                                    value={activeFilters.region || ALL_ITEMS_VALUE}
                                    onValueChange={(value) => handleFilterChange('region', value === ALL_ITEMS_VALUE ? null : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por Región" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL_ITEMS_VALUE}>Todas las Regiones</SelectItem>
                                        {uniqueRegions.map(reg => (
                                            <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={resetFilters} className="w-full">
                            <X className="mr-2 h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
            <Button onClick={handleGenerateSummary} disabled={isSummaryLoading}>
            {isSummaryLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate AI Summary
            </Button>
        </div>
      </header>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Ingresos" value={`$${kpis.totalIngresos.toLocaleString()}`} />
        <KPICard title="Total Unidades" value={kpis.totalUnidadesVendidas.toLocaleString()} />
        <KPICard title="Promedio Venta" value={`$${kpis.promedioVenta.toFixed(2)}`} />
        <KPICard title="Transacciones" value={kpis.totalTransacciones.toLocaleString()} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
         <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ingresos por Categoría</CardTitle>
                        <CardDescription>Haga clic en una sección para filtrar.</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="crossfilter-categoria" checked={crossFilterConfig.categoria} onCheckedChange={(checked) => setCrossFilterConfig(prev => ({ ...prev, categoria: checked }))} />
                        <Label htmlFor="crossfilter-categoria" className="text-xs">Cross-filter</Label>
                    </div>
                </div>
            </CardHeader>
           <CardContent>
              <InteractivePieChart data={dataByCategoria} onSliceClick={(categoria) => handleChartClick('categoria', categoria)} />
           </CardContent>
         </Card>
         <Card className="shadow-lg">
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ingresos por Región</CardTitle>
                        <CardDescription>Haga clic en una barra para filtrar.</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="crossfilter-region" checked={crossFilterConfig.region} onCheckedChange={(checked) => setCrossFilterConfig(prev => ({ ...prev, region: checked }))} />
                        <Label htmlFor="crossfilter-region" className="text-xs">Cross-filter</Label>
                    </div>
                </div>
           </CardHeader>
           <CardContent>
             <InteractiveBarChart data={dataByRegion} onBarClick={(region) => handleChartClick('region', region)} />
           </CardContent>
         </Card>
      </div>

      <div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Detalle de Transacciones</CardTitle>
             <CardDescription>Datos filtrados basados en sus selecciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredData} />
          </CardContent>
        </Card>
      </div>

       <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI-Powered Summary for {page.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-foreground">
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
