'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { BarChartData } from '@/lib/types';
import { useTheme } from 'next-themes';

export function BarChartComponent({ data }: { data: BarChartData[] }) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const primaryColor = 'hsl(var(--primary))';
    
    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke={tickColor} fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                    <Tooltip
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Legend iconSize={10} />
                    <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
