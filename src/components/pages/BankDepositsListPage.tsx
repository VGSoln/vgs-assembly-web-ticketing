import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Camera, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Ban } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { DepositReceiptModal } from '../ui/DepositReceiptModal';
import { VoidDepositModal } from '../ui/VoidDepositModal';
import { VoidedDepositModal } from '../ui/VoidedDepositModal';
import { VoidSuccessModal } from '../ui/VoidSuccessModal';
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
  exportToPDF
} from '@/lib/exportUtils';
import { getDeposits } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// Deposit type from API
interface Deposit {
  id: string;
  'trans-id': string;
  'deposit-date': string;
  'bank-name': string;
  'account-number': string;
  amount: number;
  'zone-name'?: string;
  'collector-name': string;
  'collector-phone'?: string;
  'deposit-type': string;
  'created-at': string;
  status: string;
  'void-reason'?: string;
  'voided-date'?: string;
  'voided-by'?: string;
  'has-receipt': boolean;
}

// Export headers for bank deposits
export const bankDepositsExportHeaders = [
  'Trans ID',
  'Date & Time',
  'Bank Name',
  'Account Number',
  'Deposit Amount',
  'Zone',
  'Collector',
  'Collector Phone',
  'Deposit Type',
  'Created',
  'Status',
  'Void Reason',
  'Voided Date',
  'Voided By'
];

// Transform function for export
const transformForExport = (deposits: Deposit[]) => {
  return deposits.map(deposit => ({
    'Trans ID': deposit['trans-id'],
    'Date & Time': deposit['deposit-date'],
    'Bank Name': deposit['bank-name'],
    'Account Number': deposit['account-number'],
    'Deposit Amount': deposit.amount.toFixed(2),
    'Zone': deposit['zone-name'] || 'N/A',
    'Collector': deposit['collector-name'],
    'Collector Phone': deposit['collector-phone'] || 'N/A',
    'Deposit Type': deposit['deposit-type'],
    'Created': deposit['created-at'],
    'Status': deposit.status,
    'Void Reason': deposit['void-reason'] || '',
    'Voided Date': deposit['voided-date'] || '',
    'Voided By': deposit['voided-by'] || ''
  }));
};

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
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [depositReceiptModalData, setDepositReceiptModalData] = useState<any>(null);
  const [showDepositReceiptModal, setShowDepositReceiptModal] = useState(false);
  const [voidDepositModalData, setVoidDepositModalData] = useState<any>(null);
  const [showVoidDepositModal, setShowVoidDepositModal] = useState(false);
  const [voidedDepositModalData, setVoidedDepositModalData] = useState<any>(null);
  const [showVoidedDepositModal, setShowVoidedDepositModal] = useState(false);
  const [showVoidSuccessModal, setShowVoidSuccessModal] = useState(false);
  const [voidedTransactionId, setVoidedTransactionId] = useState<string>('');

  // Fetch deposits from API
  useEffect(() => {
    const fetchDeposits = async () => {
      if (!user?.['assembly-id']) {
        setError('No assembly ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getDeposits({
          'assembly-id': user['assembly-id'],
          'start-date': selectedDateRange.start,
          'end-date': selectedDateRange.end
        });
        setDeposits(data);
      } catch (err) {
        console.error('Error fetching deposits:', err);
        setError('Failed to load deposits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [user, selectedDateRange]);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'transId', label: 'Trans ID', sortable: true, width: '6%' },
    { key: 'dateTime', label: 'Date & Time', sortable: true, width: '12%' },
    { key: 'bankName', label: 'Bank Name', sortable: true, width: '15%' },
    { key: 'accountNumber', label: 'Account #', sortable: true, width: '12%' },
    { key: 'depositAmount', label: 'Deposit Amt', sortable: true, width: '8%' },
    { key: 'collector', label: 'Collector', sortable: true, width: '13%' },
    { key: 'depositType', label: 'Deposit Type', sortable: true, width: '13%' },
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
    const exportData = transformForExport(filteredAndSortedData);
    setExportStatus(`Exporting ${type}...`);

    try {
      switch (type) {
        case 'copy':
          const success = await copyToClipboard(exportData, bankDepositsExportHeaders);
          setExportStatus(success ? 'Copied to clipboard!' : 'Failed to copy');
          break;
        case 'print':
          printData(exportData, bankDepositsExportHeaders, 'Bank Deposits Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, bankDepositsExportHeaders, 'bank-deposits');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, bankDepositsExportHeaders, 'bank-deposits');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, bankDepositsExportHeaders, 'bank-deposits');
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
    let filtered = deposits;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      // Special handling for deposit type searches
      const isExactBankSearch = search === 'bank';

      filtered = filtered.filter(deposit => {
        // For exact "bank" search, only match deposit type
        if (isExactBankSearch) {
          return deposit['deposit-type'].toLowerCase() === 'bank';
        }

        // Check all fields including deposit type
        const matchesId = deposit.id.toString().includes(search);
        const matchesTransId = deposit['trans-id'].toLowerCase().includes(search);
        const matchesDateTime = deposit['deposit-date'].toLowerCase().includes(search);
        const matchesBankName = deposit['bank-name'].toLowerCase().includes(search);
        const matchesAccountNumber = deposit['account-number'].toLowerCase().includes(search);
        const matchesAmount = deposit.amount.toString().includes(search);
        const matchesZone = deposit['zone-name'] ? deposit['zone-name'].toLowerCase().includes(search) : false;
        const matchesCollector = deposit['collector-name'].toLowerCase().includes(search);
        const matchesPhone = deposit['collector-phone'] ? deposit['collector-phone'].toLowerCase().includes(search) : false;
        const matchesDepositType = deposit['deposit-type'].toLowerCase().includes(search);
        const matchesCreated = deposit['created-at'].toLowerCase().includes(search);
        const matchesStatus = deposit.status.toLowerCase().includes(search);
        const matchesVoidReason = deposit['void-reason'] ? deposit['void-reason'].toLowerCase().includes(search) : false;
        const matchesVoidedDate = deposit['voided-date'] ? deposit['voided-date'].toLowerCase().includes(search) : false;
        const matchesVoidedBy = deposit['voided-by'] ? deposit['voided-by'].toLowerCase().includes(search) : false;

        return matchesId || matchesTransId || matchesDateTime || matchesBankName ||
               matchesAccountNumber || matchesAmount || matchesZone || matchesCollector ||
               matchesPhone || matchesDepositType || matchesCreated || matchesStatus ||
               matchesVoidReason || matchesVoidedDate || matchesVoidedBy;
      });
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Map sortConfig keys to deposit field names
        switch (sortConfig.key) {
          case 'transId':
            aValue = a['trans-id'];
            bValue = b['trans-id'];
            break;
          case 'dateTime':
            aValue = a['deposit-date'];
            bValue = b['deposit-date'];
            break;
          case 'bankName':
            aValue = a['bank-name'];
            bValue = b['bank-name'];
            break;
          case 'accountNumber':
            aValue = a['account-number'];
            bValue = b['account-number'];
            break;
          case 'depositAmount':
            aValue = a.amount;
            bValue = b.amount;
            break;
          case 'collector':
            aValue = a['collector-name'];
            bValue = b['collector-name'];
            break;
          case 'depositType':
            aValue = a['deposit-type'];
            bValue = b['deposit-type'];
            break;
          case 'created':
            aValue = a['created-at'];
            bValue = b['created-at'];
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            aValue = '';
            bValue = '';
        }

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
  }, [deposits, searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  // Calculate total deposit amount from filtered data
  const totalDepositAmount = filteredAndSortedData.reduce((sum, deposit) => sum + deposit.amount, 0);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deposits...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Deposits</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
          <div className="text-xl font-bold">GHS {totalDepositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
              placeholder="Search deposits... (try: eDeposit, Bank, zone, collector)"
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
                    {deposit['trans-id']}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{deposit['deposit-date'].split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {deposit['deposit-date'].split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100">
                  <div className="text-xs">
                    {deposit['bank-name']}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="font-mono text-xs">
                    {deposit['account-number']}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-right font-semibold">
                  {deposit.amount.toFixed(0)}
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div>
                    {deposit['collector-name']}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className={deposit['deposit-type'] === 'eDeposit' ? 'text-blue-600' : ''}>
                    {deposit['deposit-type']}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{deposit['created-at'].split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {deposit['created-at'].split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-center border-r border-gray-100">
                  {deposit.status === 'Voided' ? (
                    <button
                      onClick={() => {
                        setVoidedDepositModalData({
                          transactionId: deposit['trans-id'],
                          depositDate: deposit['deposit-date'],
                          bankName: deposit['bank-name'],
                          accountNumber: deposit['account-number'],
                          depositAmount: deposit.amount,
                          collector: deposit['collector-name'],
                          voidReason: deposit['void-reason'] || 'Not specified',
                          voidedDate: deposit['voided-date'] || 'Unknown',
                          voidedBy: deposit['voided-by'] || 'Unknown'
                        });
                        setShowVoidedDepositModal(true);
                      }}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      {deposit.status}
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                      {deposit.status}
                    </span>
                  )}
                </td>
                <td className="px-1 py-2 text-xs text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    {deposit['has-receipt'] && (
                      <button
                        onClick={() => {
                          if (deposit['deposit-type'] === 'eDeposit') return;
                          setDepositReceiptModalData({
                            collectorName: deposit['collector-name'],
                            collectorPhone: deposit['collector-phone'] || 'N/A',
                            depositDate: deposit['deposit-date'],
                            amount: deposit.amount,
                            bankName: deposit['bank-name'],
                            accountNumber: deposit['account-number'],
                            transactionId: deposit['trans-id'],
                            receiptImage: '/images/reciept1.jpg'
                          });
                          setShowDepositReceiptModal(true);
                        }}
                        className={`px-1.5 py-0.5 rounded text-xs font-medium w-10 transition-colors ${
                          deposit['deposit-type'] === 'eDeposit'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                        title={deposit['deposit-type'] === 'eDeposit' ? 'Disabled for eDeposit' : 'View Receipt'}
                        disabled={deposit['deposit-type'] === 'eDeposit'}
                      >
                        Rcpt
                      </button>
                    )}
                    {deposit.status === 'Voided' ? (
                      <button
                        onClick={() => {
                          setVoidedDepositModalData({
                            transactionId: deposit['trans-id'],
                            depositDate: deposit['deposit-date'],
                            bankName: deposit['bank-name'],
                            accountNumber: deposit['account-number'],
                            depositAmount: deposit.amount,
                            zone: deposit['zone-name'] || 'N/A',
                            collector: deposit['collector-name'],
                            voidReason: deposit['void-reason'] || 'Not specified',
                            voidedDate: deposit['voided-date'] || 'Unknown',
                            voidedBy: deposit['voided-by'] || 'Unknown'
                          });
                          setShowVoidedDepositModal(true);
                        }}
                        className="p-0.5 rounded-full transition-all duration-200 hover:bg-red-50"
                        title="View Void Details"
                      >
                        <div className="relative">
                          <div className="w-5 h-5 rounded-full bg-red-100"></div>
                          <Ban className="w-5 h-5 absolute inset-0 text-red-600" strokeWidth={1.5} />
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (deposit['deposit-type'] === 'eDeposit') return;
                          setVoidDepositModalData({
                            transactionId: deposit['trans-id'],
                            depositDate: deposit['deposit-date'],
                            bankName: deposit['bank-name'],
                            accountNumber: deposit['account-number'],
                            depositAmount: deposit.amount,
                            zone: deposit['zone-name'] || 'N/A',
                            collector: deposit['collector-name']
                          });
                          setShowVoidDepositModal(true);
                        }}
                        className={`p-0.5 rounded-full transition-all duration-200 ${
                          deposit['deposit-type'] === 'eDeposit'
                            ? 'cursor-not-allowed opacity-30'
                            : 'hover:bg-gray-50'
                        }`}
                        title={deposit['deposit-type'] === 'eDeposit' ? 'Disabled for eDeposit' : 'Void Transaction'}
                        disabled={deposit['deposit-type'] === 'eDeposit'}
                      >
                        <div className="relative">
                          <div className={`w-5 h-5 rounded-full ${deposit['deposit-type'] === 'eDeposit' ? 'bg-gray-200' : 'bg-gray-100'}`}></div>
                          <Ban className={`w-5 h-5 absolute inset-0 ${deposit['deposit-type'] === 'eDeposit' ? 'text-gray-400' : 'text-gray-300'} opacity-50`} strokeWidth={1.5} />
                        </div>
                      </button>
                    )}
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
        
        {currentData.map((deposit, index) => (
          <div key={deposit.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trans ID: {deposit['trans-id']}</h3>
                <p className="text-blue-600 font-medium">
                  {deposit['bank-name']}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {deposit.status === 'Voided' ? (
                  <button
                    onClick={() => {
                      setVoidedDepositModalData({
                        transactionId: deposit['trans-id'],
                        depositDate: deposit['deposit-date'],
                        bankName: deposit['bank-name'],
                        accountNumber: deposit['account-number'],
                        depositAmount: deposit.amount,
                        zone: deposit['zone-name'] || 'N/A',
                        collector: deposit['collector-name'],
                        voidReason: deposit['void-reason'] || 'Not specified',
                        voidedDate: deposit['voided-date'] || 'Unknown',
                        voidedBy: deposit['voided-by'] || 'Unknown'
                      });
                      setShowVoidedDepositModal(true);
                    }}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    {deposit.status}
                  </button>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {deposit.status}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Number</label>
                  <p className="text-sm font-medium text-gray-900">{deposit['account-number']}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit Amount</label>
                  <p className="text-lg font-bold text-green-600">GHS {deposit.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {deposit['zone-name'] || 'N/A'}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collector</label>
                  <p className="text-sm text-gray-700">{deposit['collector-name']}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</label>
                  <p className="text-sm font-medium text-gray-900">{deposit['deposit-date']}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit Type</label>
                  <p className={`text-sm ${deposit['deposit-type'] === 'eDeposit' ? 'text-blue-600' : 'text-gray-700'}`}>
                    {deposit['deposit-type']}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</label>
                  <p className="text-sm text-gray-700">{deposit['created-at']}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
              {deposit['has-receipt'] && (
                <button
                  onClick={() => {
                    if (deposit['deposit-type'] === 'eDeposit') return;
                    setDepositReceiptModalData({
                      collectorName: deposit['collector-name'],
                      collectorPhone: deposit['collector-phone'] || 'N/A',
                      depositDate: deposit['deposit-date'],
                      amount: deposit.amount,
                      bankName: deposit['bank-name'],
                      accountNumber: deposit['account-number'],
                      transactionId: deposit['trans-id'],
                      receiptImage: '/images/reciept1.jpg'
                    });
                    setShowDepositReceiptModal(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    deposit['deposit-type'] === 'eDeposit'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                  title={deposit['deposit-type'] === 'eDeposit' ? 'Disabled for eDeposit' : 'View Receipt'}
                  disabled={deposit['deposit-type'] === 'eDeposit'}
                >
                  View Receipt
                </button>
              )}
              {deposit.status === 'Voided' ? (
                <button
                  onClick={() => {
                    setVoidedDepositModalData({
                      transactionId: deposit['trans-id'],
                      depositDate: deposit['deposit-date'],
                      bankName: deposit['bank-name'],
                      accountNumber: deposit['account-number'],
                      depositAmount: deposit.amount,
                      zone: deposit['zone-name'] || 'N/A',
                      collector: deposit['collector-name'],
                      voidReason: deposit['void-reason'] || 'Not specified',
                      voidedDate: deposit['voided-date'] || 'Unknown',
                      voidedBy: deposit['voided-by'] || 'Unknown'
                    });
                    setShowVoidedDepositModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                >
                  View Void Details
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (deposit['deposit-type'] === 'eDeposit') return;
                    setVoidDepositModalData({
                      transactionId: deposit['trans-id'],
                      depositDate: deposit['deposit-date'],
                      bankName: deposit['bank-name'],
                      accountNumber: deposit['account-number'],
                      depositAmount: deposit.amount,
                      zone: deposit['zone-name'] || 'N/A',
                      collector: deposit['collector-name']
                    });
                    setShowVoidDepositModal(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    deposit['deposit-type'] === 'eDeposit'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title={deposit['deposit-type'] === 'eDeposit' ? 'Disabled for eDeposit' : 'Void Transaction'}
                  disabled={deposit['deposit-type'] === 'eDeposit'}
                >
                  Void Transaction
                </button>
              )}
            </div>
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

      {/* Deposit Receipt Modal */}
      {showDepositReceiptModal && depositReceiptModalData && (
        <DepositReceiptModal
          isOpen={showDepositReceiptModal}
          onClose={() => {
            setShowDepositReceiptModal(false);
            setDepositReceiptModalData(null);
          }}
          collectorName={depositReceiptModalData.collectorName}
          collectorPhone={depositReceiptModalData.collectorPhone}
          depositDate={depositReceiptModalData.depositDate}
          amount={depositReceiptModalData.amount}
          bankName={depositReceiptModalData.bankName}
          accountNumber={depositReceiptModalData.accountNumber}
          transactionId={depositReceiptModalData.transactionId}
          receiptImage={depositReceiptModalData.receiptImage}
        />
      )}

      {/* Void Deposit Modal */}
      {showVoidDepositModal && voidDepositModalData && (
        <VoidDepositModal
          isOpen={showVoidDepositModal}
          onClose={() => {
            setShowVoidDepositModal(false);
            setVoidDepositModalData(null);
          }}
          onConfirm={(reason) => {
            console.log('Voiding deposit:', voidDepositModalData.transactionId, 'Reason:', reason);
            // Here you would typically make an API call to void the deposit
            const transactionId = voidDepositModalData.transactionId;
            setVoidedTransactionId(transactionId);
            setShowVoidDepositModal(false);
            setVoidDepositModalData(null);
            // Show success modal
            setShowVoidSuccessModal(true);
          }}
          transactionId={voidDepositModalData.transactionId}
          depositDate={voidDepositModalData.depositDate}
          bankName={voidDepositModalData.bankName}
          accountNumber={voidDepositModalData.accountNumber}
          depositAmount={voidDepositModalData.depositAmount}
          zone={voidDepositModalData.zone}
          collector={voidDepositModalData.collector}
        />
      )}

      {/* Voided Deposit Modal */}
      {showVoidedDepositModal && voidedDepositModalData && (
        <VoidedDepositModal
          isOpen={showVoidedDepositModal}
          onClose={() => {
            setShowVoidedDepositModal(false);
            setVoidedDepositModalData(null);
          }}
          transactionId={voidedDepositModalData.transactionId}
          depositDate={voidedDepositModalData.depositDate}
          bankName={voidedDepositModalData.bankName}
          accountNumber={voidedDepositModalData.accountNumber}
          depositAmount={voidedDepositModalData.depositAmount}
          zone={voidedDepositModalData.zone}
          collector={voidedDepositModalData.collector}
          voidReason={voidedDepositModalData.voidReason}
          voidedDate={voidedDepositModalData.voidedDate}
          voidedBy={voidedDepositModalData.voidedBy}
        />
      )}

      {/* Void Success Modal */}
      <VoidSuccessModal
        isOpen={showVoidSuccessModal}
        onClose={() => {
          setShowVoidSuccessModal(false);
          setVoidedTransactionId('');
          // Optionally refresh the data here
        }}
        transactionId={voidedTransactionId}
        transactionType="deposit"
      />
    </div>
  );
};