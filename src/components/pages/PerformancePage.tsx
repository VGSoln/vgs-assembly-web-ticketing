'use client';

import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Banknote, Ticket, Building2, Home, UserX, Briefcase, Clock } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { StatsCard } from '../ui/StatsCard';
import { RevenueChart } from '../charts/RevenueChart';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { DateRange, ActiveYears, ChartDataItem } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import { getDashboardStats } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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

interface DashboardData {
  'paid-customers': number;
  'expected-customers': number;
  'paid-customers-percentage': number;
  'total-revenue': number;
  'expected-monthly-revenue': number;
  'revenue-percentage': number;
  'bank-deposits': number;
  'non-deposit-amount': number;
  'new-registrations': number;
  'new-registrations-fees': number;
  'cash-revenue': number;
  'cash-percentage': number;
  'cheque-revenue': number;
  'cheque-percentage': number;
  'epayment-revenue': number;
  'epayment-percentage': number;
  'voided-payments': number;
  'voided-amount': number;
  'counterfeited-tickets': number;
  'counterfeited-percentage': number;
  'customers-no-payment-4-months': number;
  'customers-no-payment-4-months-percentage': number;
  'absent-officers': number;
  'absent-officers-percentage': number;
  'total-officers': number;
  'monthly-revenue'?: ChartDataItem[];
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
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getDashboardStats({
          'assembly-id': user['assembly-id'],
          'start-date': selectedDateRange.start,
          'end-date': selectedDateRange.end,
        });

        setDashboardData(data);

        // Set chart data from API response or use empty array
        if (data['monthly-revenue'] && Array.isArray(data['monthly-revenue'])) {
          setChartData(data['monthly-revenue']);
        } else {
          // Fallback empty chart data
          setChartData([
            { month: 'JAN', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'FEB', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'MAR', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'APR', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'MAY', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'JUN', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'JUL', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'AUG', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'SEP', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'OCT', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'NOV', 2023: 0, 2024: 0, 2025: 0 },
            { month: 'DEC', 2023: 0, 2024: 0, 2025: 0 },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        // Set default values on error
        setChartData([
          { month: 'JAN', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'FEB', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'MAR', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'APR', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'MAY', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'JUN', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'JUL', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'AUG', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'SEP', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'OCT', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'NOV', 2023: 0, 2024: 0, 2025: 0 },
          { month: 'DEC', 2023: 0, 2024: 0, 2025: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, selectedDateRange]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <p className="text-gray-800 font-medium mb-1">Failed to load dashboard data</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

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
          value={dashboardData['paid-customers'] || 0}
          percentage={`${dashboardData['paid-customers-percentage']?.toFixed(2) || 0}%`}
          subtitle={`Expected: ${dashboardData['expected-customers'] || 0}`}
          gradient="from-cyan-500 to-blue-600"
          animated
        />

        <StatsCard
          title="Revenue"
          value={dashboardData['total-revenue'] || 0}
          percentage={`${dashboardData['revenue-percentage']?.toFixed(2) || 0}%`}
          subtitle={`Expected Monthly: GHS ${(dashboardData['expected-monthly-revenue'] || 0).toLocaleString()}`}
          gradient="from-green-500 to-emerald-600"
          animated
          isCurrency
        />

        <StatsCard
          title="Bank Deposits"
          value={`GHS ${(dashboardData['bank-deposits'] || 0).toLocaleString()} | GHS ${(dashboardData['non-deposit-amount'] || 0).toLocaleString()}`}
          subtitle="Deposited Amt | Non-Deposit Amt"
          gradient="from-teal-500 to-cyan-600"
          animated={false}
        />
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard
          title="New Registrations"
          value={`${dashboardData['new-registrations'] || 0} | GHS ${(dashboardData['new-registrations-fees'] || 0).toLocaleString()}`}
          subtitle="Customers | Paid Fees"
          gradient="from-indigo-500 to-purple-600"
          animated={false}
        />

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-3">
          <div className="text-sm font-medium opacity-90 mb-1">Revenue Breakdown</div>
          <div className="space-y-1 text-sm">
            <div>Cash: GHS {(dashboardData['cash-revenue'] || 0).toLocaleString()} ({dashboardData['cash-percentage']?.toFixed(2) || 0}%)</div>
            <div>Cheque: GHS {(dashboardData['cheque-revenue'] || 0).toLocaleString()} ({dashboardData['cheque-percentage']?.toFixed(2) || 0}%)</div>
            <div>ePayments: GHS {(dashboardData['epayment-revenue'] || 0).toLocaleString()} ({dashboardData['epayment-percentage']?.toFixed(2) || 0}%)</div>
          </div>
        </Card>

        <StatsCard
          title="Voided / Cancelled Payments"
          value={`${dashboardData['voided-payments'] || 0} | GHS ${(dashboardData['voided-amount'] || 0).toLocaleString()}`}
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
              <AnimatedNumber value={dashboardData['counterfeited-tickets'] || 0} />
              <span className="text-lg ml-2">({dashboardData['counterfeited-percentage']?.toFixed(1) || 0}%)</span>
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Scanned Counterfeited Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <Clock size={28} />
              <button
                onClick={() => onNavigate && onNavigate('dashboard-details-paid-customers')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={dashboardData['customers-no-payment-4-months'] || 0} />
              <span className="text-lg ml-2">({dashboardData['customers-no-payment-4-months-percentage']?.toFixed(1) || 0}%)</span>
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
              <AnimatedNumber value={dashboardData['absent-officers'] || 0} />
              <span className="text-lg ml-2">({dashboardData['absent-officers-percentage']?.toFixed(0) || 0}%)</span>
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">
              Absent Today <span className="text-xs font-normal">({dashboardData['absent-officers'] || 0} out of {dashboardData['total-officers'] || 0} Revenue Officers Absent)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};