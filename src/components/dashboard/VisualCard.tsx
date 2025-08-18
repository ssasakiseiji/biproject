
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Filter, FilterX, BarChart, FileDown } from 'lucide-react';
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
  isExcluded: boolean;
  onToggleExclude: (visualId: string) => void;
  exportType: 'csv' | 'image';
  exportData: Transaction[] | BarChartData[];
};

export function VisualCard({
  title,
  children,
  visualId,
  isExcluded,
  onToggleExclude,
  exportType,
  exportData
}: VisualCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleExport = () => {
    const elementId = `${visualId}-element`;
    const filename = `${title.toLowerCase().replace(/\s/g, '_')}`;
    
    if (exportType === 'image') {
      exportComponentAsPng(elementId, filename);
    } else if (exportType === 'csv' && 'id' in exportData[0]) {
      exportToCsv(exportData as Transaction[], filename);
    }
  };

  return (
    <TooltipProvider>
      <Card 
          className={cn("shadow-lg relative", isExcluded && "opacity-60 bg-slate-50 dark:bg-slate-900/50")}
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
                  <Tooltip>
                      <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => onToggleExclude(visualId)}>
                              {isExcluded ? <FilterX className="h-4 w-4 text-accent" /> : <Filter className="h-4 w-4" />}
                              <span className="sr-only">{isExcluded ? 'Include in cross-filter' : 'Exclude from cross-filter'}</span>
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>{isExcluded ? 'Include in cross-filter' : 'Exclude from cross-filter'}</p>
                      </TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More Options</span>
                              </Button>
                              </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>More options</p>
                          </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleExport}>
                              {exportType === 'image' ? <BarChart className="mr-2 h-4 w-4"/> : <FileDown className="mr-2 h-4 w-4"/>}
                              <span>Export as {exportType === 'image' ? 'PNG' : 'CSV'}</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              </div>
          </CardHeader>
          <CardContent>
              {isExcluded && (
                   <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded cursor-default">
                                E
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This visual is excluded from cross-filtering.</p>
                        </TooltipContent>
                   </Tooltip>
              )}
              {children}
          </CardContent>
      </Card>
    </TooltipProvider>
  );
}
