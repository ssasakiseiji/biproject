'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { useTheme } from 'next-themes';

type ChartData = {
    name: string;
    value: number;
};

type InteractiveBarChartProps = {
    data: ChartData[];
    onBarClick: (name: string) => void;
    chartId: string;
};

export function InteractiveBarChart({ data, onBarClick, chartId }: InteractiveBarChartProps) {
    const { theme } = useTheme();
    // --- LÓGICA DE COLOR DINÁMICO ---
    const tooltipTextColor = theme === 'dark' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';
    const tickColor = theme === 'dark' ? '#f5f5f5' : '#333';
    const primaryColor = 'hsl(var(--primary))';
    
    return (
        <div className="h-96 w-full" id={chartId}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} onClick={(payload) => {
                    if (payload && payload.activeLabel) {
                        onBarClick(payload.activeLabel);
                    }
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "hsl(var(--border))" : "#E5E7EB"} />
                    <XAxis dataKey="name" stroke={tickColor} fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                         // --- ESTILO DINÁMICO APLICADO ---
                        itemStyle={{ color: tooltipTextColor }}
                    />
                    <Legend iconSize={10} wrapperStyle={{ color: tickColor }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={primaryColor} className="cursor-pointer" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}