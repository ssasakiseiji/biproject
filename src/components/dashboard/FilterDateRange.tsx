'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FilterDateRangeProps = {
    title: string;
    config: {
        filter_key: string;
    };
    onFilterChange: (filterKey: string, value: { from: Date; to: Date } | null) => void;
};

export function FilterDateRange({ title, config, onFilterChange }: FilterDateRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);

    // ✅ Lógica simplificada: actualizamos el filtro directamente en el manejador de eventos
    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
        if (selectedDate?.from && selectedDate?.to) {
            onFilterChange(config.filter_key, { from: selectedDate.from, to: selectedDate.to });
        } else {
            onFilterChange(config.filter_key, null);
        }
    };

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Seleccionar rango</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={handleDateSelect} // ✅ Usamos el nuevo manejador
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}