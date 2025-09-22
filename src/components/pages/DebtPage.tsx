import React from 'react';
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { PieChartCard } from '../charts/PieChartCard';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { paidCustomersData, totalDebtData, debtByMonthsData } from '@/lib/data';
import { DateRange } from '@/types/dashboard';

interface DebtPageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
  onNavigate?: (page: string, filter?: any) => void;
}

export const DebtPage: React.FC<DebtPageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply,
  onNavigate
}) => {
  const businessCenterOptions = [
    { value: 'center1', label: 'Center 1' },
    { value: 'center2', label: 'Center 2' }
  ];

  const zoneOptions = [
    { value: 'zoneA', label: 'Zone A' },
    { value: 'zoneB', label: 'Zone B' }
  ];

  const revenueTypeOptions = [
    { 
      value: 'all', 
      label: 'All Revenue Types' 
    },
    { 
      value: 'ticketing', 
      label: 'TICKETING',
      isBold: true 
    },
    { 
      value: 'lorry-park', 
      label: 'Lorry Park',
      group: 'ticketing',
      indented: true
    },
    { 
      value: 'market', 
      label: 'Market',
      group: 'ticketing',
      indented: true
    },
    { 
      value: 'bop', 
      label: 'BOP',
      isBold: true
    },
    { 
      value: 'property-rate', 
      label: 'PROPERTY RATE',
      isBold: true
    }
  ];

  const paidCustomersLegend = [
    { color: '#10b981', label: 'New Paid Customers' },
    { color: '#3b82f6', label: 'Existing Paid Customers' },
    { color: '#dc2626', label: 'Non Paid Customers' }
  ];

  const totalDebtLegend = [
    { color: '#10b981', label: 'New Paid Customers' },
    { color: '#3b82f6', label: 'Existing Paid Customers' }
  ];

  const debtByMonthsLegend = [
    { color: '#10b981', label: 'Month Less' },
    { color: '#3b82f6', label: '1 Month' },
    { color: '#8b5cf6', label: '2 Month' },
    { color: '#f59e0b', label: '3 Month' },
    { color: '#dc2626', label: '4+ Month' }
  ];

  const paidCustomersValues = [
    { 
      color: '#10b981', 
      label: 'New Paid', 
      value: '118 (7.44%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#3b82f6', 
      label: 'Existing Paid', 
      value: '387 (24.40%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#dc2626', 
      label: 'Non Paid', 
      value: '1,081 (68.16%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    }
  ];

  const totalDebtValues = [
    { color: '#10b981', label: 'New', value: 'GHS 162,856 (41.03%)' },
    { color: '#3b82f6', label: 'Existing', value: 'GHS 234,052 (58.97%)' }
  ];

  const debtByMonthsValues = [
    { 
      color: '#10b981', 
      label: 'Month Less', 
      value: '125 (7.88%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#3b82f6', 
      label: '1 Month', 
      value: '491 (30.97%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#8b5cf6', 
      label: '2 Month', 
      value: '307 (19.37%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#f59e0b', 
      label: '3 Month', 
      value: '174 (10.97%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    },
    { 
      color: '#dc2626', 
      label: '4+ Month', 
      value: '489 (30.81%)',
      onClick: () => onNavigate && onNavigate('dashboard-details-yearly-water-connections')
    }
  ];

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <DateRangePicker
          isOpen={dateRangeOpen}
          selectedDateRange={selectedDateRange}
          displayDateRange={displayDateRange}
          activePreset={activePreset}
          onToggle={onDateRangeToggle}
          onPresetSelect={onPresetSelect}
          onDateChange={onDateRangeChange}
          onApplyRange={onDateRangeApply}
        />
        
        <ModernSelect
          placeholder="Revenue Type"
          options={revenueTypeOptions}
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
          title="Total Revenue : GHS 396,908"
          data={totalDebtData}
          legendItems={totalDebtLegend}
          legendValues={totalDebtValues}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-3">
        <PieChartCard
          title="# of Months since Last Payment : 1586 (Total Customers)"
          data={debtByMonthsData}
          legendItems={debtByMonthsLegend}
          legendValues={debtByMonthsValues}
          className="col-span-3"
        />

        <Card title="Scanned Tickets Information" className="col-span-2 space-y-2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <CheckCircle2 size={28} />
              <button 
                onClick={() => onNavigate && onNavigate('dashboard-details-customers-inactive-this-year')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={19} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Active Scanned Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <XCircle size={28} />
              <button 
                onClick={() => onNavigate('dashboard-details-customers-inactive-this-year')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={168} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Expired Scanned Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <ShieldAlert size={28} />
              <button 
                onClick={() => onNavigate('dashboard-details-counterfeited-tickets')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={149} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Scanned Counterfeited Tickets</div>
          </div>
        </Card>
      </div>
    </div>
  );
};