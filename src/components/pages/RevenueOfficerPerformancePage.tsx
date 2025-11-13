import React, { useState, useMemo, useEffect } from 'react';
import { Award, Users, UserCheck, UserX, TrendingUp, Trophy, TrendingDown, ChevronUp, ChevronDown, Download, Search } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { DateRange } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getOfficerPerformance } from '@/lib/api';

interface RevenueOfficerPerformancePageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
}

type SortField = 'name' | 'expectedCustomers' | 'paidCustomers' | 'performance' | 'expectedRevenue' | 'revenueCollected' | 'revenuePerformance' | 'workDays' | 'daysPresent' | 'daysAbsent' | 'attendanceRate' | 'todayStatus';
type SortDirection = 'asc' | 'desc';

interface OfficerData {
  name: string;
  expectedCustomers: number;
  paidCustomers: number;
  performance: number;
  expectedRevenue: number;
  revenueCollected: number;
  revenuePerformance: number;
  workDays: number;
  daysPresent: number;
  daysAbsent: number;
  attendanceRate: number;
  todayStatus: 'Present' | 'Absent';
}

interface APIResponseItem {
  'officer-name': string;
  'expected-customers': number;
  'paid-customers': number;
  'performance': number;
  'expected-revenue': number;
  'revenue-collected': number;
  'revenue-performance': number;
  'work-days': number;
  'days-present': number;
  'days-absent': number;
  'attendance-rate': number;
  'today-status': string;
}

export const RevenueOfficerPerformancePage: React.FC<RevenueOfficerPerformancePageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply
}) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<SortField>('attendanceRate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [officerData, setOfficerData] = useState<OfficerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch officer performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getOfficerPerformance({
          'assembly-id': user['assembly-id'],
          'start-date': selectedDateRange.start,
          'end-date': selectedDateRange.end,
        });

        // Map API response to component state
        const mappedData: OfficerData[] = response.map((item: APIResponseItem) => ({
          name: item['officer-name'],
          expectedCustomers: item['expected-customers'],
          paidCustomers: item['paid-customers'],
          performance: item['performance'],
          expectedRevenue: item['expected-revenue'],
          revenueCollected: item['revenue-collected'],
          revenuePerformance: item['revenue-performance'],
          workDays: item['work-days'],
          daysPresent: item['days-present'],
          daysAbsent: item['days-absent'],
          attendanceRate: item['attendance-rate'],
          todayStatus: item['today-status'] === 'Present' ? 'Present' : 'Absent',
        }));

        setOfficerData(mappedData);
      } catch (err) {
        console.error('Failed to fetch officer performance:', err);
        setError('Failed to load officer performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user, selectedDateRange]);

  const filteredAndSortedData = useMemo(() => {
    // First filter based on search query
    let filtered = officerData;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = officerData.filter(officer => {
        return (
          officer.name.toLowerCase().includes(query) ||
          officer.expectedCustomers.toString().includes(query) ||
          officer.paidCustomers.toString().includes(query) ||
          officer.performance.toFixed(1).includes(query) ||
          officer.expectedRevenue.toString().includes(query) ||
          officer.revenueCollected.toString().includes(query) ||
          officer.revenuePerformance.toFixed(1).includes(query) ||
          officer.workDays.toString().includes(query) ||
          officer.daysPresent.toString().includes(query) ||
          officer.daysAbsent.toString().includes(query) ||
          officer.attendanceRate.toFixed(1).includes(query) ||
          officer.todayStatus.toLowerCase().includes(query)
        );
      });
    }
    
    // Then sort the filtered data
    const sorted = [...filtered].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'todayStatus') {
        aVal = a.todayStatus === 'Present' ? 1 : 0;
        bVal = b.todayStatus === 'Present' ? 1 : 0;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (sortDirection === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
    
    return sorted;
  }, [searchQuery, sortField, sortDirection]);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (officerData.length === 0) {
      return {
        totalOfficers: 0,
        presentToday: 0,
        absentToday: 0,
        averageCollection: 0,
        averageExpected: 0,
        topPerformer: null,
        lowestPerformer: null,
      };
    }

    const totalRevenue = officerData.reduce((sum, officer) => sum + officer.revenueCollected, 0);
    const totalExpected = officerData.reduce((sum, officer) => sum + officer.expectedRevenue, 0);
    const presentToday = officerData.filter(o => o.todayStatus === 'Present').length;
    const absentToday = officerData.filter(o => o.todayStatus === 'Absent').length;

    // Sort by performance to find top and lowest
    const sortedByPerformance = [...officerData].sort((a, b) => b.performance - a.performance);

    return {
      totalOfficers: officerData.length,
      presentToday,
      absentToday,
      averageCollection: Math.round(totalRevenue / officerData.length),
      averageExpected: Math.round(totalExpected / officerData.length),
      topPerformer: sortedByPerformance[0],
      lowestPerformer: sortedByPerformance[sortedByPerformance.length - 1],
    };
  }, [officerData]);

  // Get top 3 performers for the card
  const topPerformers = useMemo(() => {
    return [...officerData]
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 3);
  }, [officerData]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPerformanceColor = (value: number, field: 'performance' | 'revenuePerformance') => {
    const values = officerData.map(d => field === 'performance' ? d.performance : d.revenuePerformance);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    if (value === max) return 'text-green-600';
    if (value === min) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getAttendanceColor = (value: number) => {
    const max = Math.max(...officerData.map(d => d.attendanceRate));
    const min = Math.min(...officerData.map(d => d.attendanceRate));
    
    if (value === max) return 'text-green-600';
    if (value === min) return 'text-red-600';
    return 'text-yellow-600';
  };

  const downloadCSV = () => {
    const headers = [
      'Officer Name',
      'Expected Customers',
      'Paid Customers',
      'Performance %',
      'Expected Revenue',
      'Revenue Collected',
      'Revenue Performance %',
      'Work Days',
      'Days Present',
      'Days Absent',
      'Attendance Rate %',
      'Today Status'
    ];

    const csvData = filteredAndSortedData.map(officer => [
      officer.name,
      officer.expectedCustomers,
      officer.paidCustomers,
      officer.performance.toFixed(1),
      officer.expectedRevenue,
      officer.revenueCollected,
      officer.revenuePerformance.toFixed(1),
      officer.workDays,
      officer.daysPresent,
      officer.daysAbsent,
      officer.attendanceRate.toFixed(1),
      officer.todayStatus
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-officer-performance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
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

  const businessCenterOptions = [
    { value: 'center1', label: 'Center 1' },
    { value: 'center2', label: 'Center 2' }
  ];

  const zoneOptions = [
    { value: 'zoneA', label: 'Zone A' },
    { value: 'zoneB', label: 'Zone B' }
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
          placeholder="Ticket Type"
          options={ticketTypeOptions}
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

      {/* Performance Overview with Top Performers Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Left side - 6 boxes in 2 rows */}
        <div className="lg:col-span-3 space-y-3">
          {/* First row - Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatsCard
              title="Total Officers"
              value={stats.totalOfficers}
              percentage="100%"
              subtitle="Active Revenue Officers"
              gradient="from-blue-500 to-cyan-600"
              icon={Users}
              animated
            />

            <StatsCard
              title="Present Today"
              value={stats.presentToday}
              percentage={stats.totalOfficers > 0 ? `${((stats.presentToday / stats.totalOfficers) * 100).toFixed(1)}%` : '0%'}
              subtitle="Attendance Rate"
              gradient="from-green-500 to-emerald-600"
              icon={UserCheck}
              animated
            />

            <StatsCard
              title="Absent Today"
              value={stats.absentToday}
              percentage={stats.totalOfficers > 0 ? `${((stats.absentToday / stats.totalOfficers) * 100).toFixed(1)}%` : '0%'}
              subtitle="Absence Rate"
              gradient="from-red-500 to-rose-600"
              icon={UserX}
              animated
            />
          </div>

          {/* Second row - Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatsCard
              title="Average Collection"
              value={stats.averageCollection}
              percentage={stats.averageExpected > 0 ? `${((stats.averageCollection / stats.averageExpected) * 100).toFixed(1)}%` : '0%'}
              subtitle="Per Officer (GHS)"
              gradient="from-purple-500 to-indigo-600"
              icon={TrendingUp}
              animated
              isCurrency
            />

            <StatsCard
              title="Top Performer"
              value={
                stats.topPerformer ? (
                  <>
                    {stats.topPerformer.name} <span className="text-lg font-normal">({stats.topPerformer.performance?.toFixed(1) || '0.0'}%)</span>
                  </>
                ) : 'N/A'
              }
              subtitle={stats.topPerformer ? `${stats.topPerformer.paidCustomers || 0} of ${stats.topPerformer.expectedCustomers || 0} customers paid` : 'No data'}
              gradient="from-orange-500 to-amber-600"
              icon={Trophy}
              animated={false}
            />

            <StatsCard
              title="Lowest Performer"
              value={
                stats.lowestPerformer ? (
                  <>
                    {stats.lowestPerformer.name} <span className="text-lg font-normal">({stats.lowestPerformer.performance?.toFixed(1) || '0.0'}%)</span>
                  </>
                ) : 'N/A'
              }
              subtitle={stats.lowestPerformer ? `${stats.lowestPerformer.paidCustomers || 0} of ${stats.lowestPerformer.expectedCustomers || 0} customers paid` : 'No data'}
              gradient="from-gray-500 to-slate-600"
              icon={TrendingDown}
              animated={false}
            />
          </div>
        </div>
        
        {/* Right side - Top Performers Card */}
        <div className="lg:col-span-1">
          <Card
            title={
              <>
                Top Performers{' '}
                <span className="text-xs font-normal">(Paid Customers)</span>
              </>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No data available</div>
              ) : (
                topPerformers.map((officer, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      index === 0
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Award className="h-5 w-5 text-yellow-600" />}
                      <span className={`font-medium ${index === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {index > 0 && `${index + 1}. `}{officer.name}{' '}
                        <span className="text-sm font-normal">({officer.paidCustomers})</span>
                      </span>
                    </div>
                    <span className={`font-semibold ${index === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {officer.performance.toFixed(1)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Officer Performance Table */}
      <Card 
        title={
          <div className="flex items-center justify-between w-full">
            <span>Revenue Officer Performance Details</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-1.5 w-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={downloadCSV}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download CSV"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        }
        className="overflow-hidden"
      >
        {searchQuery && (
          <div className="px-4 pb-2 text-sm text-gray-600">
            Found {filteredAndSortedData.length} of {officerData.length} officers
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-gray-700">
                <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Officer Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('expectedCustomers')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Expected Customers</span>
                    {sortField === 'expectedCustomers' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('paidCustomers')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Paid Customers</span>
                    {sortField === 'paidCustomers' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('performance')}
                >
                  <div className="flex items-center space-x-1">
                    <span>PERF. %</span>
                    {sortField === 'performance' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600 min-w-[110px]"
                  onClick={() => handleSort('expectedRevenue')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Expected Revenue</span>
                    {sortField === 'expectedRevenue' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600 min-w-[110px]"
                  onClick={() => handleSort('revenueCollected')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Revenue Collected</span>
                    {sortField === 'revenueCollected' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('revenuePerformance')}
                >
                  <div className="flex items-center space-x-1">
                    <span>REV. PERF. %</span>
                    {sortField === 'revenuePerformance' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('workDays')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Work Days</span>
                    {sortField === 'workDays' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-green-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('daysPresent')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Days Present</span>
                    {sortField === 'daysPresent' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('daysAbsent')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Days Absent</span>
                    {sortField === 'daysAbsent' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('attendanceRate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Attendance Rate</span>
                    {sortField === 'attendanceRate' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600"
                  onClick={() => handleSort('todayStatus')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Today&apos;s Status</span>
                    {sortField === 'todayStatus' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((officer, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{officer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{officer.expectedCustomers}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-center">{officer.paidCustomers}</td>
                  <td className="px-2 py-3 text-center">
                    <span className={`${getPerformanceColor(officer.performance, 'performance')} font-semibold text-sm`}>
                      {officer.performance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">GHS {officer.expectedRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold whitespace-nowrap">GHS {officer.revenueCollected.toLocaleString()}</td>
                  <td className="px-2 py-3 text-center">
                    <span className={`${getPerformanceColor(officer.revenuePerformance, 'revenuePerformance')} font-semibold text-sm`}>
                      {officer.revenuePerformance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-bold text-center">{officer.workDays}</td>
                  <td className={`px-4 py-3 text-sm font-bold text-center ${officer.daysPresent === 0 ? 'text-black' : 'text-green-600'}`}>
                    {officer.daysPresent}
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold text-center ${officer.daysAbsent === 0 ? 'text-black' : 'text-red-700'}`}>
                    {officer.daysAbsent}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`${getAttendanceColor(officer.attendanceRate)} font-semibold text-sm`}>
                      {officer.attendanceRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      officer.todayStatus === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {officer.todayStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
};