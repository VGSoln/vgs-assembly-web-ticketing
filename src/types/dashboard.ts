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
  title: string | React.ReactNode;
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

export type PageType = 'performance' | 'debt' | 'revenue-officer-performance' | 'ticket-payments' | 'bank-deposits' | 'storage-tanks' | 'storage-tank-meter-readings' | 'customer-meter-readings' | 'staff' | 'staff-details' | 'edit-staff' | 'add-staff' | 'customer-locations' | 'collector-locations' | 'collector-paths' | 'storage-tank-locations' | 'ticket-customers' | 'ticket-rates' | 'customer-details' | 'dashboard-details-customer-debt' | 'dashboard-details-yearly-water-connections' | 'dashboard-details-paid-customers' | 'dashboard-details-non-paid-customers' | 'dashboard-details-customers-with-no-payments' | 'dashboard-details-inactive-customers' | 'dashboard-details-customers-inactive-this-year' | 'customer-payment-status' | 'customer-payment-status-paid-customers' | 'customer-payment-status-customers-with-negative-balances' | 'customer-payment-status-partial-payment' | 'customer-payment-status-visited-no-payment' | 'customer-payment-status-not-visited' | 'customer-visit-status-no-one-home' | 'customer-visit-status-meter-disconnected' | 'customer-visit-status-water-supply-issues' | 'customer-visit-status-cancelled-stopped' | 'customer-visit-status-excuses' | 'customer-visit-status-unreadable-meter' | 'customer-visit-status-inaccessible-meter' | 'customer-visit-status-faulty-meter' | 'customer-visit-status-other' | 'bill-generation';