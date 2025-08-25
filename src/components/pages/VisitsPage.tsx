import React from 'react';
import { MonthYearPicker } from '../layout/MonthYearPicker';
import { ModernSelect } from '../ui/ModernSelect';
import { PieChartCard } from '../charts/PieChartCard';
import { VisitsChart } from '../charts/VisitsChart';
import { 
  customerPaymentStatusData, 
  defaulterReasonsData, 
  monthlyVisitData 
} from '@/lib/data';

interface VisitsPageProps {
  selectedVisitsMonth: string;
  selectedVisitsYear: string;
  visitsMonthYearPickerOpen: boolean;
  onVisitsMonthYearToggle: () => void;
  onVisitsMonthChange: (month: string) => void;
  onVisitsYearChange: (year: string) => void;
  onVisitsMonthYearApply: () => void;
  onNavigate?: (page: string) => void;
}

export const VisitsPage: React.FC<VisitsPageProps> = ({
  selectedVisitsMonth,
  selectedVisitsYear,
  visitsMonthYearPickerOpen,
  onVisitsMonthYearToggle,
  onVisitsMonthChange,
  onVisitsYearChange,
  onVisitsMonthYearApply,
  onNavigate
}) => {
  const businessLevelOptions = [
    { value: 'level1', label: 'Level 1' },
    { value: 'level2', label: 'Level 2' }
  ];

  const zoneOptions = [
    { value: 'zoneA', label: 'Zone A' },
    { value: 'zoneB', label: 'Zone B' }
  ];

  const customerPaymentLegend = [
    { color: '#3b82f6', label: 'Pre-Paid' },
    { color: '#10b981', label: 'Paid' },
    { color: '#8b5cf6', label: 'Partial Payment' },
    { color: '#f59e0b', label: 'Visited - No Payment' },
    { color: '#dc2626', label: 'Not Visited' }
  ];

  const defaulterReasonsLegend = [
    { color: '#3b82f6', label: 'No One Home' },
    { color: '#dc2626', label: 'Meter Disconnected' },
    { color: '#10b981', label: 'Water Supply Issues' },
    { color: '#8b5cf6', label: 'Cancelled/Stopped' },
    { color: '#f59e0b', label: 'Excuses' },
    { color: '#f97316', label: 'Unreadable Meter' },
    { color: '#06b6d4', label: 'Inaccessible Meter' },
    { color: '#1f2937', label: 'Faulty Meter' },
    { color: '#6b7280', label: 'Other' }
  ];

  const customerPaymentValues = [
    { color: '#3b82f6', label: 'Pre-Paid', value: '146 (8.95%)', onClick: () => onNavigate && onNavigate('customer-payment-status-customers-with-negative-balances') },
    { color: '#10b981', label: 'Paid', value: '148 (9.07%)', onClick: () => onNavigate && onNavigate('customer-payment-status-paid-customers') },
    { color: '#8b5cf6', label: 'Partial Payment', value: '63 (3.86%)', onClick: () => onNavigate && onNavigate('customer-payment-status-partial-payment') },
    { color: '#f59e0b', label: 'Visited - No Payment', value: '2 (0.12%)', onClick: () => onNavigate && onNavigate('customer-payment-status-visited-no-payment') },
    { color: '#dc2626', label: 'Not Visited', value: '1,272 (77.99%)', onClick: () => onNavigate && onNavigate('customer-payment-status-not-visited') }
  ];

  const defaulterReasonsValues = [
    { color: '#3b82f6', label: 'No One Home', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-no-one-home') },
    { color: '#dc2626', label: 'Meter Disconnected', value: '1 (50%)', onClick: () => onNavigate && onNavigate('customer-visit-status-meter-disconnected') },
    { color: '#10b981', label: 'Water Supply Issues', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-water-supply-issues') },
    { color: '#8b5cf6', label: 'Cancelled/Stopped', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-cancelled-stopped') },
    { color: '#f59e0b', label: 'Excuses', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-excuses') },
    { color: '#f97316', label: 'Unreadable Meter', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-unreadable-meter') },
    { color: '#06b6d4', label: 'Inaccessible Meter', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-inaccessible-meter') },
    { color: '#1f2937', label: 'Faulty Meter', value: '0 (0%)', onClick: () => onNavigate && onNavigate('customer-visit-status-faulty-meter') },
    { color: '#6b7280', label: 'Other', value: '1 (50%)', onClick: () => onNavigate && onNavigate('customer-visit-status-other') }
  ];

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-3 gap-3">
        <MonthYearPicker
          isOpen={visitsMonthYearPickerOpen}
          selectedMonth={selectedVisitsMonth}
          selectedYear={selectedVisitsYear}
          onToggle={onVisitsMonthYearToggle}
          onMonthChange={onVisitsMonthChange}
          onYearChange={onVisitsYearChange}
          onApply={onVisitsMonthYearApply}
          className="visits-month-year-picker"
        />

        <ModernSelect
          placeholder="Select Business Level"
          options={businessLevelOptions}
        />

        <ModernSelect
          placeholder="Select Zone"
          options={zoneOptions}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-3">
        <PieChartCard
          title="Customer Payment Status - 1631 Customers"
          data={customerPaymentStatusData}
          legendItems={customerPaymentLegend}
          legendValues={customerPaymentValues}
        />

        <PieChartCard
          title="Defaulter Reasons - 2 Customers Visited - No Payment"
          data={defaulterReasonsData.filter(item => item.value > 0)}
          legendItems={defaulterReasonsLegend}
          legendValues={defaulterReasonsValues}
        />
      </div>

      {/* Monthly Visit Chart */}
      <VisitsChart data={monthlyVisitData} />
    </div>
  );
};