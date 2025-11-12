'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { PieChartCard } from '../charts/PieChartCard';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { DateRange } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerPaymentStatus } from '@/lib/api';

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
  const { user } = useAuth();
  const [debtData, setDebtData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch debt/payment status data
  useEffect(() => {
    const fetchDebtData = async () => {
      if (!user?.['assembly-id']) {
        setError('Assembly ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCustomerPaymentStatus({
          'assembly-id': user['assembly-id'],
          'start-date': selectedDateRange.start,
          'end-date': selectedDateRange.end,
        });
        setDebtData(data);
      } catch (err) {
        console.error('Error fetching debt data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load debt data');
      } finally {
        setLoading(false);
      }
    };

    fetchDebtData();
  }, [user, selectedDateRange.start, selectedDateRange.end]);

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

  // Calculate derived values from API data
  const totalCustomers = debtData?.['total-customers'] || 0;
  const newPaidCustomers = debtData?.['new-paid-customers'] || 0;
  const existingPaidCustomers = debtData?.['existing-paid-customers'] || 0;
  const nonPaidCustomers = debtData?.['non-paid-customers'] || 0;

  const newPaidRevenue = debtData?.['new-paid-revenue'] || 0;
  const existingPaidRevenue = debtData?.['existing-paid-revenue'] || 0;
  const totalRevenue = newPaidRevenue + existingPaidRevenue;

  const monthLessCount = debtData?.['month-less-count'] || 0;
  const oneMonthCount = debtData?.['one-month-count'] || 0;
  const twoMonthCount = debtData?.['two-month-count'] || 0;
  const threeMonthCount = debtData?.['three-month-count'] || 0;
  const fourPlusMonthCount = debtData?.['four-plus-month-count'] || 0;

  const activeScannedTickets = debtData?.['active-scanned-tickets'] || 0;
  const expiredScannedTickets = debtData?.['expired-scanned-tickets'] || 0;
  const counterfeitedTickets = debtData?.['counterfeited-tickets'] || 0;

  // Calculate percentages
  const newPaidPct = totalCustomers > 0 ? ((newPaidCustomers / totalCustomers) * 100).toFixed(2) : '0.00';
  const existingPaidPct = totalCustomers > 0 ? ((existingPaidCustomers / totalCustomers) * 100).toFixed(2) : '0.00';
  const nonPaidPct = totalCustomers > 0 ? ((nonPaidCustomers / totalCustomers) * 100).toFixed(2) : '0.00';

  const newRevenuePct = totalRevenue > 0 ? ((newPaidRevenue / totalRevenue) * 100).toFixed(2) : '0.00';
  const existingRevenuePct = totalRevenue > 0 ? ((existingPaidRevenue / totalRevenue) * 100).toFixed(2) : '0.00';

  const monthLessPct = totalCustomers > 0 ? ((monthLessCount / totalCustomers) * 100).toFixed(2) : '0.00';
  const oneMonthPct = totalCustomers > 0 ? ((oneMonthCount / totalCustomers) * 100).toFixed(2) : '0.00';
  const twoMonthPct = totalCustomers > 0 ? ((twoMonthCount / totalCustomers) * 100).toFixed(2) : '0.00';
  const threeMonthPct = totalCustomers > 0 ? ((threeMonthCount / totalCustomers) * 100).toFixed(2) : '0.00';
  const fourPlusMonthPct = totalCustomers > 0 ? ((fourPlusMonthCount / totalCustomers) * 100).toFixed(2) : '0.00';

  // Chart data for paid customers
  const paidCustomersData = [
    { name: 'New Paid', value: newPaidCustomers, color: '#10b981' },
    { name: 'Existing Paid', value: existingPaidCustomers, color: '#3b82f6' },
    { name: 'Non Paid', value: nonPaidCustomers, color: '#dc2626' }
  ];

  // Chart data for total debt/revenue
  const totalDebtData = [
    { name: 'New', value: newPaidRevenue, color: '#10b981' },
    { name: 'Existing', value: existingPaidRevenue, color: '#3b82f6' }
  ];

  // Chart data for debt by months
  const debtByMonthsData = [
    { name: 'Month Less', value: monthLessCount, color: '#10b981' },
    { name: '1 Month', value: oneMonthCount, color: '#3b82f6' },
    { name: '2 Month', value: twoMonthCount, color: '#8b5cf6' },
    { name: '3 Month', value: threeMonthCount, color: '#f59e0b' },
    { name: '4+ Month', value: fourPlusMonthCount, color: '#dc2626' }
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
      value: `${newPaidCustomers.toLocaleString()} (${newPaidPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#3b82f6',
      label: 'Existing Paid',
      value: `${existingPaidCustomers.toLocaleString()} (${existingPaidPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#dc2626',
      label: 'Non Paid',
      value: `${nonPaidCustomers.toLocaleString()} (${nonPaidPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    }
  ];

  const totalDebtValues = [
    { color: '#10b981', label: 'New', value: `GHS ${newPaidRevenue.toLocaleString()} (${newRevenuePct}%)` },
    { color: '#3b82f6', label: 'Existing', value: `GHS ${existingPaidRevenue.toLocaleString()} (${existingRevenuePct}%)` }
  ];

  const debtByMonthsValues = [
    {
      color: '#10b981',
      label: 'Month Less',
      value: `${monthLessCount.toLocaleString()} (${monthLessPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#3b82f6',
      label: '1 Month',
      value: `${oneMonthCount.toLocaleString()} (${oneMonthPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#8b5cf6',
      label: '2 Month',
      value: `${twoMonthCount.toLocaleString()} (${twoMonthPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#f59e0b',
      label: '3 Month',
      value: `${threeMonthCount.toLocaleString()} (${threeMonthPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    },
    {
      color: '#dc2626',
      label: '4+ Month',
      value: `${fourPlusMonthCount.toLocaleString()} (${fourPlusMonthPct}%)`,
      onClick: () => onNavigate && onNavigate('dashboard-details-paid-customers')
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
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
          <ModernSelect placeholder="Revenue Type" options={revenueTypeOptions} />
          <ModernSelect placeholder="Select Business Center" options={businessCenterOptions} />
          <ModernSelect placeholder="Zones" options={zoneOptions} />
        </div>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading debt data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
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
          <ModernSelect placeholder="Revenue Type" options={revenueTypeOptions} />
          <ModernSelect placeholder="Select Business Center" options={businessCenterOptions} />
          <ModernSelect placeholder="Zones" options={zoneOptions} />
        </div>
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center px-4">
            <div className="text-red-600 text-5xl mb-4">⚠</div>
            <p className="text-red-800 font-semibold mb-2">Failed to load debt data</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
          title={`Total Customers : ${totalCustomers.toLocaleString()}`}
          data={paidCustomersData}
          legendItems={paidCustomersLegend}
          legendValues={paidCustomersValues}
        />

        <PieChartCard
          title={`Total Revenue : GHS ${totalRevenue.toLocaleString()}`}
          data={totalDebtData}
          legendItems={totalDebtLegend}
          legendValues={totalDebtValues}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-3">
        <PieChartCard
          title={`# of Months since Last Payment : ${totalCustomers.toLocaleString()} (Total Customers)`}
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
              <AnimatedNumber value={activeScannedTickets} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Active Scanned Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <XCircle size={28} />
              <button
                onClick={() => onNavigate && onNavigate('dashboard-details-customers-inactive-this-year')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={expiredScannedTickets} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Expired Scanned Tickets</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <ShieldAlert size={28} />
              <button
                onClick={() => onNavigate && onNavigate('dashboard-details-counterfeited-tickets')}
                className="text-xs bg-white/20 px-2 py-0.5 rounded-full hover:bg-white/30 transition-colors">
                View Details
              </button>
            </div>
            <div className="text-xl font-bold">
              <AnimatedNumber value={counterfeitedTickets} />
            </div>
            <div className="text-sm font-medium opacity-90 mt-1">Total Scanned Counterfeited Tickets</div>
          </div>
        </Card>
      </div>
    </div>
  );
};