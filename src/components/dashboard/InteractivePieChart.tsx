
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';

type ChartData = {
  name: string;
  value: number;
};

type InteractivePieChartProps = {
    data: ChartData[];
    onSliceClick: (name: string) => void;
}

const COLORS = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
];

export function InteractivePieChart({ data, onSliceClick }: InteractivePieChartProps) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#f5f5f5' : '#333';
    
    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        onClick={(payload) => onSliceClick(payload.name)}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                        ))}
                    </Pie>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ right: -10, color: tickColor }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
