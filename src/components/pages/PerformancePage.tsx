import React, { useState } from 'react';
import { Users, AlertTriangle, Banknote, Ticket, Building2, Home, UserX, Briefcase, Clock } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { StatsCard } from '../ui/StatsCard';
import { RevenueChart } from '../charts/RevenueChart';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { DateRange, ActiveYears } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import { chartData } from '@/lib/data';

interface PerformancePageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  activeYears: ActiveYears;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
  onToggleYear: (year: number) => void;
  onNavigate?: (page: string) => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  activeYears,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply,
  onToggleYear,
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

  const collectorOptions = [
    { value: 'collector1', label: 'Collector 1' },
    { value: 'collector2', label: 'Collector 2' }
  ];

  const ticketTypeOptions = [
    { 
      value: 'all', 
      label: 'All Ticket Types' 
    },
    { 
      value: 'lorry-park', 
      label: 'Lorry Park'
    },
    { 
      value: 'market', 
      label: 'Market'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
          placeholder="Select Business Center"
          options={businessCenterOptions}
        />
        
        <ModernSelect
          placeholder="Zones"
          options={zoneOptions}
        />
        
        <ModernSelect
          placeholder="Ticket Type"
          options={ticketTypeOptions}
        />
        
        <ModernSelect
          placeholder="Collectors"
          options={collectorOptions}
        />
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard
          title="Paid Customers"
          value={157}
          percentage="9.91%"
          subtitle="Expected: 1,585"
          gradient="from-cyan-500 to-blue-600"
          animated
        />
        
        <StatsCard
          title="Revenue"
          value={32948}
          percentage="20.49%"
          subtitle="Expected Monthly: GHS 160,799"
          gradient="from-green-500 to-emerald-600"
          animated
          isCurrency
        />
        
        <StatsCard
          title="Bank Deposits"
          value="GHS 33,135 | GHS -187"
          subtitle="Deposited Amt | Non-Deposit Amt"
          gradient="from-teal-500 to-cyan-600"
          animated={false}
        />
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard
          title="New Registrations"
          value="0 | GHS 0"
          subtitle="Customers | Paid Fees"
          gradient="from-indigo-500 to-purple-600"
          animated={false}
        />
        
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-3">
          <div className="text-sm font-medium opacity-90 mb-1">Revenue Breakdown</div>
          <div className="space-y-1 text-sm">
            <div>Cash: GHS 18,058 (54.81%)</div>
            <div>Cheque: GHS 0 (0.00%)</div>
            <div>ePayments: GHS 14,890 (45.19%)</div>
          </div>
        </Card>
        
        <StatsCard
          title="Voided / Cancelled Payments"
          value="0 | GHS 0"
          subtitle="Voided Payments | Amount Voided"
          gradient="from-orange-500 to-red-500"
          animated={false}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
        <div className="lg:col-span-2">
          <RevenueChart
            data={chartData}
            activeYears={activeYears}
            onToggleYear={onToggleYear}
          />
        </div>

        <Card title="Ticketing & Attendance Information" className="space-y-2">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <AlertTriangle size={28} />
              <button 
                onClick={() => onNavigate && onNavigate('dashboard-details-counterfeited-tickets')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={17} />
              <span className="text-lg ml-2">(3.4%)</span>
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Scanned Counterfeited Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <Clock size={28} />
              <button 
                onClick={() => onNavigate && onNavigate('dashboard-details-yearly-water-connections')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={344} />
              <span className="text-lg ml-2">(42.8%)</span>
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Customers with No Payment for 4+ Months</div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <UserX size={28} />
              <button 
                onClick={() => onNavigate && onNavigate('dashboard-details-revenue-officer-field-attendance')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={2} />
              <span className="text-lg ml-2">(20%)</span>
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">
              Absent Today <span className="text-xs font-normal">(2 out of 10 Revenue Officers Absent)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};