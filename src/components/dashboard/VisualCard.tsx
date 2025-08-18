
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, FilterX, BarChart, FileDown, Filter as FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { exportComponentAsPng, exportToCsv } from '@/utils/exportUtils';
import type { Transaction, BarChartData } from '@/lib/types';
import { cn } from '@/lib/utils';

type FilterOption = {
    value: string;
    label: string;
    group?: string;
};

type VisualCardProps = {
  title: string;
  children: React.ReactNode;
  visualId: string;
  isExcluded: boolean;
  onToggleExclude: (visualId: string) => void;
  exportType: 'csv' | 'image';
  exportData: Transaction[] | BarChartData[];
  filterOptions: FilterOption[];
  onFilterChange: (value: string, group?: string) => void;
  activeFilter?: string | null;
};

export function VisualCard({
  title,
  children,
  visualId,
  isExcluded,
  onToggleExclude,
  exportType,
  exportData,
  filterOptions,
  onFilterChange,
  activeFilter
}: VisualCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const handleExport = () => {
    const elementId = `${visualId}-element`;
    const filename = `${title.toLowerCase().replace(/\s/g, '_')}`;
    
    if (exportType === 'image') {
      exportComponentAsPng(elementId, filename);
    } else if (exportType === 'csv' && exportData.length > 0 && 'id' in exportData[0]) {
      exportToCsv(exportData as Transaction[], filename);
    }
  };

  const handleFilterSelect = (value: string, group?: string) => {
    onFilterChange(value, group);
    setFilterPopoverOpen(false);
  }

  const isFilterable = filterOptions && filterOptions.length > 0;
  
  const groupedFilterOptions = useMemo(() => {
    if (!filterOptions.some(opt => opt.group)) {
      return null;
    }
    return filterOptions.reduce((acc, option) => {
      const group = option.group || 'Default';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
      return acc;
    }, {} as Record<string, FilterOption[]>);
  }, [filterOptions]);


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
                  {isFilterable && (
                    <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <FilterIcon className="h-4 w-4" />
                                  <span className="sr-only">Apply Filter</span>
                              </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Apply Filter</p>
                        </TooltipContent>
                      </Tooltip>
                      <PopoverContent className="w-[200px] p-0" align="end">
                         <Command>
                            <CommandInput placeholder="Search filter..." />
                            <CommandList>
                              <CommandEmpty>No options found.</CommandEmpty>
                              {groupedFilterOptions ? (
                                Object.entries(groupedFilterOptions).map(([groupName, options], index) => (
                                  <React.Fragment key={groupName}>
                                    <CommandGroup heading={groupName}>
                                      {options.map((option) => (
                                        <CommandItem
                                          key={option.value}
                                          value={option.value}
                                          onSelect={() => handleFilterSelect(option.value, option.group)}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              activeFilter === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {option.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                    {index < Object.keys(groupedFilterOptions).length - 1 && <CommandSeparator />}
                                  </React.Fragment>
                                ))
                              ) : (
                                <CommandGroup>
                                  {filterOptions.map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={() => handleFilterSelect(option.value)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          activeFilter === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {option.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                         </Command>
                      </PopoverContent>
                    </Popover>
                  )}


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
                          <DropdownMenuItem onClick={() => onToggleExclude(visualId)}>
                              <FilterX className="mr-2 h-4 w-4" />
                              <span>{isExcluded ? 'Include in cross-filter' : 'Exclude from cross-filter'}</span>
                          </DropdownMenuItem>
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
