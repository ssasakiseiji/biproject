
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

export function calculateKPIs(data: Transaction[]): KPIs {
  if (!data || data.length === 0) {
    return {
      totalIngresos: 0,
      totalUnidadesVendidas: 0,
      promedioVenta: 0,
      totalTransacciones: 0,
    };
  }

  const totalIngresos = data.reduce((acc, item) => acc + item.ingresos, 0);
  const totalUnidadesVendidas = data.reduce((acc, item) => acc + item.unidadesVendidas, 0);
  const totalTransacciones = data.length;
  const promedioVenta = totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0;

  return {
    totalIngresos,
    totalUnidadesVendidas,
    promedioVenta,
    totalTransacciones,
  };
}
