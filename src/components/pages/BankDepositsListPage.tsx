import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Camera, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Ban } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { 
  businessLevelOptions, 
  zoneOptions, 
  collectorOptions 
} from '@/lib/data';
import { DateRange } from '@/types/dashboard';
import { 
  copyToClipboard, 
  printData, 
  exportToExcel, 
  exportToCSV, 
  exportToPDF, 
  formatDataForExport, 
  exportHeaders 
} from '@/lib/exportUtils';

// Bank deposits data
const bankDepositsData = [
  {
    id: 1782,
    transId: '1782',
    dateTime: '20 Aug 2025 06:35 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 153,
    zone: 'ZONE 9',
    collector: 'Mabel Tottimeh',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 06:40 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1781,
    transId: '1781',
    dateTime: '20 Aug 2025 06:16 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 170,
    zone: 'ZONE 3',
    collector: 'Rapheal Kwabena Aboagye',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 06:16 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1780,
    transId: '1780',
    dateTime: '20 Aug 2025 06:11 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 132,
    zone: 'Stand Pipes',
    collector: 'Rapheal Kwabena Aboagye',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 06:12 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1778,
    transId: '1778',
    dateTime: '20 Aug 2025 06:11 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 120,
    zone: 'ZONE 1',
    collector: 'Kubura Abdul Rahman',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 06:12 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1777,
    transId: '1777',
    dateTime: '20 Aug 2025 05:41 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 1900,
    zone: 'ZONE 4',
    collector: 'Rapheal Kwabena Aboagye',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 05:45 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1776,
    transId: '1776',
    dateTime: '20 Aug 2025 05:13 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 838,
    zone: 'ZONE 3',
    collector: 'Francis Seguri',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 05:14 PM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1775,
    transId: '1775',
    dateTime: '20 Aug 2025 10:15 AM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 43,
    zone: 'ZONE 4',
    collector: 'Rapheal Kwabena Aboagye',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 10:15 AM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1773,
    transId: '1773',
    dateTime: '20 Aug 2025 09:53 AM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 155,
    zone: 'ZONE 4',
    collector: 'Kubura Abdul Rahman',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 09:53 AM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1772,
    transId: '1772',
    dateTime: '20 Aug 2025 09:51 AM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 150,
    zone: 'ZONE 1',
    collector: 'Kubura Abdul Rahman',
    collectionsRange: '2025-08-20 - 2025-08-20',
    created: '20 Aug 2025 09:52 AM',
    status: 'Deposited',
    receipt: true
  },
  {
    id: 1771,
    transId: '1771',
    dateTime: '19 Aug 2025 05:09 PM',
    bankName: 'National Investment Bank',
    accountNumber: '1121092684901',
    depositAmount: 105.5,
    zone: 'ZONE 8',
    collector: 'John Adesu Senyo',
    collectionsRange: '2025-08-19 - 2025-08-19',
    created: '19 Aug 2025 05:09 PM',
    status: 'Deposited',
    receipt: true
  }
];

interface BankDepositsListPageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const BankDepositsListPage: React.FC<BankDepositsListPageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply
}) => {
  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'transId', label: 'Trans ID', sortable: true, width: '6%' },
    { key: 'dateTime', label: 'Date & Time', sortable: true, width: '10%' },
    { key: 'bankName', label: 'Bank Name', sortable: true, width: '13%' },
    { key: 'accountNumber', label: 'Account #', sortable: true, width: '10%' },
    { key: 'depositAmount', label: 'Deposit Amt', sortable: true, width: '7%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '7%' },
    { key: 'collector', label: 'Collector', sortable: true, width: '11%' },
    { key: 'collectionsRange', label: 'Collections Range', sortable: true, width: '13%' },
    { key: 'created', label: 'Created', sortable: true, width: '10%' },
    { key: 'status', label: 'Status', sortable: true, width: '7%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '6%' }
  ];

  // Sorting function
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Export functions
  const handleExport = async (type: string) => {
    const exportData = formatDataForExport(filteredAndSortedData);
    setExportStatus(`Exporting ${type}...`);
    
    try {
      switch (type) {
        case 'copy':
          const success = await copyToClipboard(exportData, exportHeaders);
          setExportStatus(success ? 'Copied to clipboard!' : 'Failed to copy');
          break;
        case 'print':
          printData(exportData, exportHeaders, 'Bank Deposits Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, exportHeaders, 'bank-deposits');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'bank-deposits');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'bank-deposits');
          setExportStatus('PDF export opened');
          break;
      }
    } catch (error) {
      setExportStatus('Export failed');
    }
    
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = bankDepositsData.filter(deposit =>
      deposit.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.accountNumber.includes(searchTerm) ||
      deposit.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.collector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.transId.includes(searchTerm) ||
      deposit.collectionsRange.includes(searchTerm)
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);
  
  // Calculate total deposit amount from filtered data
  const totalDepositAmount = filteredAndSortedData.reduce((sum, deposit) => sum + deposit.depositAmount, 0);

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
        <DateRangePicker
          selectedDateRange={selectedDateRange}
          displayDateRange={displayDateRange}
          activePreset={activePreset}
          isOpen={dateRangeOpen}
          onToggle={onDateRangeToggle}
          onPresetSelect={onPresetSelect}
          onDateChange={onDateRangeChange}
          onApplyRange={onDateRangeApply}
        />

        <ModernSelect
          placeholder="Select Business Level"
          options={businessLevelOptions}
          value={selectedBusinessLevel}
          onChange={setSelectedBusinessLevel}
        />

        <ModernSelect
          placeholder="Select Zone"
          options={zoneOptions}
          value={selectedZone}
          onChange={setSelectedZone}
        />

        <ModernSelect
          placeholder="Select Collector"
          options={collectorOptions}
          value={selectedCollector}
          onChange={setSelectedCollector}
        />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Deposits</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GH₵ {totalDepositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-green-100">Total Bank Deposits</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Show</span>
              <ModernSelect
                placeholder="50"
                options={entriesOptions}
                value={entriesPerPage}
                onChange={setEntriesPerPage}
                className="w-24"
                showClear={false}
              />
              <span className="text-sm font-medium text-gray-700">entries</span>
            </div>
            {exportStatus && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-800">
                <Check className="w-4 h-4" />
                <span className="text-sm">{exportStatus}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => handleExport('copy')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button 
              onClick={() => handleExport('print')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              <File className="w-4 h-4" />
              CSV
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Search bank deposits, customers, comments..."
            />
          </div>
        </div>
      </div>

      {/* Scroll Hint for Tablet/Small Desktop */}
      <div className="hidden md:block lg:hidden mb-2">
        <div className="text-xs text-gray-500 text-center">
          ← Scroll horizontally to view all columns →
        </div>
      </div>

      {/* Data Table - Desktop & Tablet View */}
      <div className="hidden md:block bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border-0 overflow-hidden backdrop-blur-sm p-1 w-full">
        <div className="bg-white rounded-xl overflow-hidden w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full">
            <table className="w-full table-fixed border-collapse">
            <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-1 py-3 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-600 transition-all duration-300 hover:shadow-lg' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span className="leading-tight font-bold text-white drop-shadow-sm">{column.label}</span>
                      {column.sortable && (
                        <div className="flex items-center flex-shrink-0">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-blue-300 drop-shadow-sm" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-blue-300 drop-shadow-sm" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4 text-gray-300 hover:text-blue-300 transition-colors duration-200" />
                          )}
                        </div>
                      )}
                    </div>
                    {column.sortable && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          <tbody className="bg-white">
            {currentData.map((deposit, index) => (
              <tr key={deposit.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs font-mono">
                    {deposit.transId}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{deposit.dateTime.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {deposit.dateTime.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100">
                  <div className="text-xs">
                    {deposit.bankName}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="font-mono text-xs">
                    {deposit.accountNumber}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-right font-semibold">
                  {deposit.depositAmount.toFixed(0)}
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold text-slate-800">
                    {deposit.zone.replace('ZONE ', '')}
                  </span>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div>
                    {deposit.collector}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100 text-center">
                  <div className="text-xs">
                    {deposit.collectionsRange}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{deposit.created.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {deposit.created.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-center border-r border-gray-100">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                    {deposit.status}
                  </span>
                </td>
                <td className="px-1 py-2 text-xs text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    {deposit.receipt && (
                      <button 
                        onClick={() => console.log('Receipt clicked for deposit:', deposit.transId)}
                        className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs hover:bg-orange-600 transition-colors font-medium w-10" 
                        title="View Receipt"
                      >
                        Rcpt
                      </button>
                    )}
                    <button 
                      onClick={() => console.log('Void clicked for deposit:', deposit.transId)}
                      className="p-0.5 rounded-full hover:bg-gray-50 transition-all duration-200" 
                      title="Void Transaction"
                    >
                      <div className="relative">
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-100"></div>
                        <Ban className="w-3.5 h-3.5 absolute inset-0 text-gray-300 opacity-50" strokeWidth={1.5} />
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
          
          {/* Desktop Table Footer */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 px-6 py-4 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white">
                Showing <span className="font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{startEntry}</span> to <span className="font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{endEntry}</span> of <span className="font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{totalEntries}</span> entries
              </div>
              <div className="text-sm text-gray-300">
                {sortConfig && (
                  <span className="font-medium">Sorted by <span className="font-bold text-blue-300">{columns.find(c => c.key === sortConfig.key)?.label}</span> ({sortConfig.direction})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card View - Mobile Only */}
      <div className="md:hidden space-y-4">
        {/* Mobile Sorting Controls */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {columns.filter(col => col.sortable).map((column) => (
              <button
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortConfig?.key === column.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {column.label}
                {sortConfig?.key === column.key && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {currentData.map((visit, index) => (
          <div key={visit.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ID: {visit.id}</h3>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                  {visit.customerNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                {visit.gps && (
                  <button 
                    onClick={() => console.log('GPS clicked for bank deposit:', visit.id, 'Customer:', visit.customerName)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    title="View GPS Location"
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </button>
                )}
                {visit.photo && (
                  <button 
                    onClick={() => console.log('Photo clicked for bank deposit:', visit.id, 'Customer:', visit.customerName)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    title="View Photo"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</label>
                  <p className="text-11px font-medium text-gray-900">{visit.customerName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-11px text-gray-700">{visit.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {visit.zone}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Name</label>
                  <p className="text-11px text-gray-700">{visit.staffName}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit Date</label>
                  <div>
                    <p className="text-11px font-medium text-gray-900">{visit.visitDate}</p>
                    <p className="text-xs text-gray-500">{visit.visitTime}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit Outcome</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    visit.visitOutcome === 'Other' 
                      ? 'bg-green-100 text-green-800' 
                      : visit.visitOutcome === 'Meter Disconnected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {visit.visitOutcome}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</label>
                  <p className="text-11px text-gray-700">{visit.created}</p>
                </div>
              </div>
            </div>
            
            {(visit.customerComments || visit.staffComments) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {visit.customerComments && (
                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Comments</label>
                    <p className="text-11px text-gray-700 mt-1">{visit.customerComments}</p>
                  </div>
                )}
                {visit.staffComments && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Comments</label>
                    <p className="text-11px text-gray-700 mt-1">{visit.staffComments}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100" style={{ marginTop: '7px', marginBottom: '4px' }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4" style={{ marginTop: '1px', marginBottom: '1px' }}>
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startEntry}</span> to <span className="font-semibold text-gray-900">{endEntry}</span> of <span className="font-semibold text-gray-900">{totalEntries}</span> results
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
                
                if (pageNum < 1 || pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};