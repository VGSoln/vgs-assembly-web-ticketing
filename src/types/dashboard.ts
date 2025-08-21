export interface DateRange {
  start: string;
  end: string;
}

export interface DatePreset {
  label: string;
  start: string;
  end: string;
}

export interface MenuItemType {
  icon: any;
  label: string;
  color: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  label: string;
  page?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface ChartDataItem {
  month: string;
  [key: string]: string | number;
}

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyVisitData {
  month: string;
  prePaid: number;
  paid: number;
  partialPayment: number;
  visitedNoPayment: number;
  notVisited: number;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  percentage?: string;
  gradient: string;
  icon?: React.ComponentType<{ size?: number }>;
  animated?: boolean;
  isCurrency?: boolean;
}

export interface ActiveYears {
  [key: number]: boolean;
}

export type PageType = 'performance' | 'debt' | 'visits' | 'visits-list' | 'payments' | 'bank-deposits' | 'pump-stations' | 'storage-tanks' | 'pump-station-meter-readings' | 'storage-tank-meter-readings' | 'customer-meter-readings' | 'staff' | 'staff-details' | 'edit-staff' | 'add-staff' | 'customer-locations' | 'collector-locations' | 'collector-paths' | 'pump-station-locations' | 'storage-tank-locations' | 'customers' | 'customer-details';