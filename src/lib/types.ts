export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Dashboard {
  id: string;
  name: string;
  path: string;
}

export interface Permission {
  userId: string;
  dashboardIds: string[];
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

export interface DashboardData {
  barChartData: BarChartData[];
  pieChartData: PieChartData[];
}
