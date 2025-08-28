'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, BarChart, FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { exportComponentAsPng, exportToCsv } from '@/utils/exportUtils';
import type { Transaction, BarChartData } from '@/lib/types';
import { cn } from '@/lib/utils';

type VisualCardProps = {
  title: string;
  children: React.ReactNode;
  visualId: string;
  exportType: 'csv' | 'image';
  exportData: Transaction[] | BarChartData[];
};

export function VisualCard({
  title,
  children,
  visualId,
  exportType,
  exportData,
}: VisualCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleExport = () => {
    // Genera un nombre de archivo limpio a partir del título
    const filename = title.toLowerCase().replace(/\s+/g, '_');

    if (exportType === 'image') {
      // Usamos el visualId para encontrar el elemento a capturar
      exportComponentAsPng(visualId, filename);
    } else if (exportType === 'csv') {
      exportToCsv(exportData, filename);
    }
  };

  return (
    <TooltipProvider>
      <Card 
          className="shadow-lg relative h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
          <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{title}</CardTitle>
                <div 
                    className={cn(
                        "flex items-center gap-1 transition-opacity",
                        isHovered ? "opacity-100" : "opacity-0 focus-within:opacity-100"
                    )}
                >
                  <DropdownMenu>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Más Opciones</span>
                              </Button>
                              </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent><p>Más opciones</p></TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleExport}>
                              {exportType === 'image' ? <BarChart className="mr-2 h-4 w-4"/> : <FileDown className="mr-2 h-4 w-4"/>}
                              <span>Exportar como {exportType === 'image' ? 'PNG' : 'CSV'}</span>
                          </DropdownMenuItem>
                          {/* Aquí se pueden añadir más opciones en el futuro */}
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              </div>
          </CardHeader>
          {/* Le damos al contenido el ID único que usará html2canvas */}
          <CardContent id={visualId} className="flex-1">
              {children}
          </CardContent>
      </Card>
    </TooltipProvider>
  );
}