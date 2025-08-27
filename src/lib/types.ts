export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

export interface DashboardPage {
  id: string;
  name: string;
}

export interface Dashboard {
  id: string;
  name: string;
  path: string;
  pages?: DashboardPage[];
}

export interface Permission {
  userId: string;
  dashboardAccess: Array<{
    dashboardId: string;
    pageIds: string[];
  }>;
}

export interface Settings {
  userId: string;
  theme: 'light' | 'dark';
}

export interface BarChartData {
  name: string;
  value: number;
}

export interface PieChartData {
  name:string;
  value: number;
  fill: string;
}

export type DashboardData = Record<string, any>;


export interface Transaction {
  id: string;
  fecha: string;
  categoria: string;
  producto: string;
  region: string;
  ingresos: number;
  unidadesVendidas: number;
}

export interface KPIs {
    totalIngresos: number;
    totalUnidadesVendidas: number;
    promedioVenta: number;
    totalTransacciones: number;
}