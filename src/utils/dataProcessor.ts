
import type { Transaction, KPIs, BarChartData } from '@/lib/types';

export function aggregateData(data: Transaction[], groupBy: keyof Transaction, metric: keyof Transaction): BarChartData[] {
  if (!data || data.length === 0) return [];

  const result: { [key: string]: number } = {};

  data.forEach(item => {
    const key = item[groupBy] as string;
    const value = item[metric] as number;

    if (!result[key]) {
      result[key] = 0;
    }
    result[key] += value;
  });

  return Object.entries(result).map(([name, value]) => ({ name, value }));
}
