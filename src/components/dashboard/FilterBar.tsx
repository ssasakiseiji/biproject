
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

type FilterBarProps = {
  categories: string[];
  regions: string[];
  activeFilters: {
    categoria: string | null;
    region: string | null;
  };
  onFilterChange: (filterType: 'categoria' | 'region', value: string | null) => void;
  onResetFilters: () => void;
};

export function FilterBar({ categories, regions, activeFilters, onFilterChange, onResetFilters }: FilterBarProps) {
  return (
    <Card className="p-4 shadow">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <h3 className="text-md font-semibold whitespace-nowrap">Filtros Globales:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Select
                    value={activeFilters.categoria || ''}
                    onValueChange={(value) => onFilterChange('categoria', value || null)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas las Categorías</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={activeFilters.region || ''}
                    onValueChange={(value) => onFilterChange('region', value || null)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por Región" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas las Regiones</SelectItem>
                        {regions.map(reg => (
                            <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="ghost" onClick={onResetFilters} className="w-full md:w-auto">
                <X className="mr-2 h-4 w-4" />
                Limpiar Filtros
            </Button>
        </div>
    </Card>
  );
}
