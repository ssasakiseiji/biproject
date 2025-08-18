
'use client';

import type { BarChartData, PieChartData } from '@/lib/types';
import { BarChartComponent } from './BarChart';
import { PieChartComponent } from './PieChart';
import { InteractiveBarChart } from './InteractiveBarChart';
import { InteractivePieChart } from './InteractivePieChart';

type ChartComponentProps = {
    data: {
        barChartData?: BarChartData[];
        pieChartData?: PieChartData[];
    }
    type: 'interactive-bar' | 'interactive-pie' | 'bar' | 'pie';
    onDataClick?: (name: string) => void;
}

export function ChartComponent({ data, type, onDataClick = () => {} }: ChartComponentProps) {
    if (type === 'interactive-bar' && data.barChartData) {
        return <InteractiveBarChart data={data.barChartData} onBarClick={onDataClick} />;
    }
     if (type === 'interactive-pie' && data.pieChartData) {
        return <InteractivePieChart data={data.pieChartData} onSliceClick={onDataClick} />;
    }
    if (type === 'bar' && data.barChartData) {
        return <BarChartComponent data={data.barChartData} />;
    }
    if (type === 'pie' && data.pieChartData) {
        return <PieChartComponent data={data.pieChartData} />;
    }
    return <div className="text-center text-muted-foreground h-96 flex items-center justify-center">No chart data available for this view.</div>;
}
