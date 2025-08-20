import React from 'react';
import { Users, AlertTriangle, UserX } from 'lucide-react';
import { MonthYearPicker } from '../layout/MonthYearPicker';
import { ModernSelect } from '../ui/ModernSelect';
import { PieChartCard } from '../charts/PieChartCard';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { paidCustomersData, totalDebtData, debtByMonthsData } from '@/lib/data';

interface DebtPageProps {
  selectedMonth: string;
  selectedYear: string;
  monthYearPickerOpen: boolean;
  onMonthYearToggle: () => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onMonthYearApply: () => void;
}

export const DebtPage: React.FC<DebtPageProps> = ({
  selectedMonth,
  selectedYear,
  monthYearPickerOpen,
  onMonthYearToggle,
  onMonthChange,
  onYearChange,
  onMonthYearApply
}) => {
  const businessCenterOptions = [
    { value: 'center1', label: 'Center 1' },
    { value: 'center2', label: 'Center 2' }
  ];

  const zoneOptions = [
    { value: 'zoneA', label: 'Zone A' },
    { value: 'zoneB', label: 'Zone B' }
  ];

  const paidCustomersLegend = [
    { color: '#10b981', label: 'Paid Customers' },
    { color: '#dc2626', label: 'Non Paid Customers' }
  ];

  const totalDebtLegend = [
    { color: '#10b981', label: 'Current Debt' },
    { color: '#dc2626', label: 'Old Debt' }
  ];

  const debtByMonthsLegend = [
    { color: '#10b981', label: 'No Debt' },
    { color: '#3b82f6', label: '1 Month Debt' },
    { color: '#8b5cf6', label: '2 Month Debt' },
    { color: '#f59e0b', label: '3 Month Debt' },
    { color: '#dc2626', label: '4+ Month Debt' }
  ];

  const paidCustomersValues = [
    { color: '#10b981', label: 'Paid', value: '118 (7.44%)' },
    { color: '#dc2626', label: 'Non Paid', value: '1,468 (92.56%)' }
  ];

  const totalDebtValues = [
    { color: '#10b981', label: 'Current', value: 'GH₵ 162,856 (40.87%)' },
    { color: '#dc2626', label: 'Old', value: 'GH₵ 234,052 (58.13%)' }
  ];

  const debtByMonthsValues = [
    { color: '#10b981', label: 'No Debt', value: '125 (8.70%)' },
    { color: '#3b82f6', label: '1 Month', value: '491 (34.17%)' },
    { color: '#8b5cf6', label: '2 Month', value: '307 (21.36%)' },
    { color: '#f59e0b', label: '3 Month', value: '174 (12.11%)' },
    { color: '#dc2626', label: '4+ Month', value: '340 (23.66%)' }
  ];

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-3 gap-3">
        <MonthYearPicker
          isOpen={monthYearPickerOpen}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onToggle={onMonthYearToggle}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          onApply={onMonthYearApply}
        />
        
        <ModernSelect
          placeholder="Select Business Center"
          options={businessCenterOptions}
        />
        
        <ModernSelect
          placeholder="Zones"
          options={zoneOptions}
        />
      </div>

      {/* Top Charts Row */}
      <div className="grid grid-cols-2 gap-3">
        <PieChartCard
          title="Total Customers : 1586"
          data={paidCustomersData}
          legendItems={paidCustomersLegend}
          legendValues={paidCustomersValues}
        />
        
        <PieChartCard
          title="Total Debt : GH₵396,907"
          data={totalDebtData}
          legendItems={totalDebtLegend}
          legendValues={totalDebtValues}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-3">
        <PieChartCard
          title="Customers with Payment : 1437"
          data={debtByMonthsData}
          legendItems={debtByMonthsLegend}
          legendValues={debtByMonthsValues}
          className="col-span-3"
        />

        <Card title="Inactive & No Payment Customers" className="col-span-2 space-y-2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <Users size={28} />
              <button className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={19} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Customers made Inactive this Year</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <UserX size={28} />
              <button className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={168} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Inactive Customers</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <AlertTriangle size={28} />
              <button className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={149} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Customers with No Payment</div>
          </div>
        </Card>
      </div>
    </div>
  );
};