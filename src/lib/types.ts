export interface Client {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  clientId: string;
  password?: string;
}

export interface DashboardPage {
  id: string;
  name: string;
}

export interface Dashboard {
  id: string;
  clientId: string;
  name: string;
  path: string;
  pages?: DashboardPage[];
}

export interface VisualItem {
  id: string;
  type: string;
  title: string;
  grid_position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content?: string;
  data_source?: string;
  format?: string;
  precision?: number;
  api_endpoint?: string;
  filter_key?: string;
  drill_down_levels?: string[];
  config?: any;
}

export interface PageConfig {
  pageId: string;
  name: string;
  base_endpoint: string;
  layout: {
    columns: number;
    rows: number;
  };
  visuals: VisualItem[];
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