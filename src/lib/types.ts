// ssasakiseiji/biproject/biproject-c27025170b497117a48b90ae73651843b5f34964/src/lib/types.ts

export interface Client {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  clientId: string; // ✅ Añadimos la relación con un cliente
  password?: string;
}

export interface DashboardPage {
  id: string;
  name: string;
}

export interface Dashboard {
  id: string;
  clientId: string; // ✅ Añadimos la relación con un cliente
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