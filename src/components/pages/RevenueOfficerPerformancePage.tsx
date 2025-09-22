import React, { useState, useMemo } from 'react';
import { Award, Users, UserCheck, UserX, TrendingUp, Trophy, TrendingDown, ChevronUp, ChevronDown, Download, Search } from 'lucide-react';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ModernSelect } from '../ui/ModernSelect';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { DateRange } from '@/types/dashboard';

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
  const [sortField, setSortField] = useState<SortField>('attendanceRate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const officerData: OfficerData[] = [
    { name: 'John Doe', expectedCustomers: 650, paidCustomers: 582, performance: 89.5, expectedRevenue: 8600, revenueCollected: 8450, revenuePerformance: 98.2, workDays: 22, daysPresent: 22, daysAbsent: 0, attendanceRate: 100, todayStatus: 'Present' },
    { name: 'Jane Smith', expectedCustomers: 500, paidCustomers: 456, performance: 91.2, expectedRevenue: 7800, revenueCollected: 7200, revenuePerformance: 92.5, workDays: 22, daysPresent: 22, daysAbsent: 0, attendanceRate: 100, todayStatus: 'Present' },
    { name: 'Michael Johnson', expectedCustomers: 450, paidCustomers: 389, performance: 86.4, expectedRevenue: 7900, revenueCollected: 6890, revenuePerformance: 87.3, workDays: 22, daysPresent: 14, daysAbsent: 8, attendanceRate: 63.6, todayStatus: 'Absent' },
    { name: 'Sarah Williams', expectedCustomers: 520, paidCustomers: 468, performance: 90.0, expectedRevenue: 8200, revenueCollected: 7850, revenuePerformance: 95.7, workDays: 22, daysPresent: 22, daysAbsent: 0, attendanceRate: 100, todayStatus: 'Present' },
    { name: 'Robert Brown', expectedCustomers: 480, paidCustomers: 422, performance: 87.9, expectedRevenue: 7500, revenueCollected: 6950, revenuePerformance: 92.7, workDays: 22, daysPresent: 19, daysAbsent: 3, attendanceRate: 86.4, todayStatus: 'Present' },
    { name: 'Emily Davis', expectedCustomers: 550, paidCustomers: 495, performance: 90.0, expectedRevenue: 9100, revenueCollected: 8645, revenuePerformance: 95.0, workDays: 22, daysPresent: 20, daysAbsent: 2, attendanceRate: 90.9, todayStatus: 'Present' },
    { name: 'David Wilson', expectedCustomers: 410, paidCustomers: 361, performance: 88.0, expectedRevenue: 6800, revenueCollected: 6120, revenuePerformance: 90.0, workDays: 22, daysPresent: 21, daysAbsent: 1, attendanceRate: 95.5, todayStatus: 'Present' },
    { name: 'Lisa Anderson', expectedCustomers: 470, paidCustomers: 418, performance: 88.9, expectedRevenue: 7600, revenueCollected: 7220, revenuePerformance: 95.0, workDays: 22, daysPresent: 18, daysAbsent: 4, attendanceRate: 81.8, todayStatus: 'Present' },
    { name: 'James Martinez', expectedCustomers: 590, paidCustomers: 525, performance: 89.0, expectedRevenue: 9500, revenueCollected: 8740, revenuePerformance: 92.0, workDays: 22, daysPresent: 22, daysAbsent: 0, attendanceRate: 100, todayStatus: 'Absent' },
    { name: 'Patricia Garcia', expectedCustomers: 430, paidCustomers: 376, performance: 87.4, expectedRevenue: 7200, revenueCollected: 6480, revenuePerformance: 90.0, workDays: 22, daysPresent: 17, daysAbsent: 5, attendanceRate: 77.3, todayStatus: 'Present' }
  ];

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

  // Calculate average collection per officer
  const averageCollection = useMemo(() => {
    const totalRevenue = officerData.reduce((sum, officer) => sum + officer.revenueCollected, 0);
    return Math.round(totalRevenue / officerData.length);
  }, []);

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
              value={10}
              percentage="100%"
              subtitle="Active Revenue Officers"
              gradient="from-blue-500 to-cyan-600"
              icon={Users}
              animated
            />
            
            <StatsCard
              title="Present Today"
              value={8}
              percentage="80%"
              subtitle="Attendance Rate"
              gradient="from-green-500 to-emerald-600"
              icon={UserCheck}
              animated
            />
            
            <StatsCard
              title="Absent Today"
              value={2}
              percentage="20%"
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
              value={averageCollection}
              percentage={`${((averageCollection / (officerData.reduce((sum, o) => sum + o.expectedRevenue, 0) / officerData.length)) * 100).toFixed(1)}%`}
              subtitle="Per Officer (GHS)"
              gradient="from-purple-500 to-indigo-600"
              icon={TrendingUp}
              animated
              isCurrency
            />
            
            <StatsCard
              title="Top Performer"
              value={
                <>
                  Jane Smith <span className="text-lg font-normal">(91.2%)</span>
                </>
              }
              subtitle="456 of 500 customers paid"
              gradient="from-orange-500 to-amber-600"
              icon={Trophy}
              animated={false}
            />
            
            <StatsCard
              title="Lowest Performer"
              value={
                <>
                  Michael Johnson <span className="text-lg font-normal">(86.4%)</span>
                </>
              }
              subtitle="389 of 450 customers paid"
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
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">
                    Jane Smith <span className="text-sm font-normal">(456)</span>
                  </span>
                </div>
                <span className="font-semibold text-green-600">91.2%</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    2. John Doe <span className="text-sm font-normal">(582)</span>
                  </span>
                </div>
                <span className="font-semibold text-yellow-600">89.5%</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    3. Michael Johnson <span className="text-sm font-normal">(389)</span>
                  </span>
                </div>
                <span className="font-semibold text-yellow-600">86.4%</span>
              </div>
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
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[110px]"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[110px]"
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
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-bold text-blue-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-bold text-green-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-bold text-red-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('todayStatus')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Today's Status</span>
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
      </Card>
    </div>
  );
};