'use client';

import type { BarChartData, PieChartData } from '@/lib/types';
import { BarChartComponent } from './BarChart';
import { PieChartComponent } from './PieChart';

type ChartComponentProps = {
    data: {
        barChartData?: BarChartData[];
        pieChartData?: PieChartData[];
    }
}

export function ChartComponent({ data }: ChartComponentProps) {
    if (data.barChartData) {
        return <BarChartComponent data={data.barChartData} />;
    }
    if (data.pieChartData) {
        return <PieChartComponent data={data.pieChartData} />;
    }
    return <div className="text-center text-muted-foreground">No chart data available for this page.</div>;
}
