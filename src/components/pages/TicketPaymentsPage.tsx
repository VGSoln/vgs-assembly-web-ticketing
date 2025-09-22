import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Camera, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Ban } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { ReceiptModal } from '../ui/ReceiptModal';
import { LocationModal } from '../ui/LocationModal';
import { ChequeModal } from '../ui/ChequeModal';
import { VoidPaymentModal } from '../ui/VoidPaymentModal';
import { VoidDetailsModal } from '../ui/VoidDetailsModal';
import { SuccessModal } from '../ui/SuccessModal';
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

// Ticket payments data - this will be different from regular payments
const ticketPaymentsData = [
  {
    id: 1,
    ticketId: 'TKT-0504-07-001784',
    ticketType: 'Market',
    locationName: 'Central Market',
    customerPhone: '055-918-5237',
    customerCategory: 'Stall',
    identifier: 'S-124',
    date: '20 Aug 2025 06:47 PM',
    amount: 50.00,
    paymentType: 'Cash',
    revenueOfficer: 'Revenue Officer 1',
    community: 'Adum',
    zone: 'Zone A',
    createdDate: '20 Aug 2025 06:47 PM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  {
    id: 2,
    ticketId: 'TKT-019-36SVKE01',
    ticketType: 'Lorry Park',
    locationName: 'Main Station',
    customerPhone: '050-608-2996',
    customerCategory: 'Taxi',
    identifier: 'AS-1234-21',
    date: '20 Aug 2025 05:02 PM',
    amount: 30.00,
    paymentType: 'e-Payment',
    revenueOfficer: 'Revenue Officer 2',
    community: 'Asafo',
    zone: 'Zone B',
    createdDate: '20 Aug 2025 05:02 PM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  {
    id: 3,
    ticketId: 'TKT-0504-07-001785',
    ticketType: 'Market',
    locationName: 'Street Market',
    customerPhone: '024-123-4567',
    customerCategory: 'Hawker',
    identifier: 'H-456',
    date: '20 Aug 2025 04:30 PM',
    amount: 20.00,
    paymentType: 'Cheque',
    revenueOfficer: 'Revenue Officer 3',
    community: 'Bantama',
    zone: 'Zone C',
    createdDate: '20 Aug 2025 04:30 PM',
    receipt: true,
    gps: true,
    status: 'Pending'
  },
  {
    id: 4,
    ticketId: 'TKT-0504-07-001786',
    ticketType: 'Market',
    locationName: 'Kejetia Market',
    customerPhone: '055-234-5678',
    customerCategory: 'Table-Top',
    identifier: 'TT-087',
    date: '19 Aug 2025 03:15 PM',
    amount: 100.00,
    paymentType: 'Cash',
    revenueOfficer: 'Revenue Officer 1',
    community: 'Kejetia',
    zone: 'Zone A',
    createdDate: '19 Aug 2025 03:15 PM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  {
    id: 5,
    ticketId: 'TKT-019-36SVKE02',
    ticketType: 'Lorry Park',
    locationName: 'Tech Junction',
    customerPhone: '020-987-6543',
    customerCategory: 'Trotro',
    identifier: 'GN-5678-20',
    date: '19 Aug 2025 02:00 PM',
    amount: 40.00,
    paymentType: 'e-Payment',
    revenueOfficer: 'Revenue Officer 2',
    community: 'Tech',
    zone: 'Zone B',
    createdDate: '19 Aug 2025 02:00 PM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  {
    id: 6,
    ticketId: 'TKT-0504-07-001787',
    ticketType: 'Market',
    locationName: 'Adum Market',
    customerPhone: '024-456-7890',
    customerCategory: 'Hawker',
    identifier: 'H-789',
    date: '18 Aug 2025 10:30 AM',
    amount: 25.00,
    paymentType: 'Cash',
    revenueOfficer: 'Revenue Officer 3',
    community: 'Adum',
    zone: 'Zone A',
    createdDate: '18 Aug 2025 10:30 AM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  {
    id: 7,
    ticketId: 'TKT-0504-07-001788',
    ticketType: 'Market',
    locationName: 'Bantama Market',
    customerPhone: '055-678-9012',
    customerCategory: 'Table-Top',
    identifier: 'TT-234',
    date: '18 Aug 2025 09:15 AM',
    amount: 35.00,
    paymentType: 'Cheque',
    revenueOfficer: 'Revenue Officer 1',
    community: 'Bantama',
    zone: 'Zone C',
    createdDate: '18 Aug 2025 09:15 AM',
    receipt: false,
    gps: true,
    status: 'Voided'
  },
  {
    id: 8,
    ticketId: 'TKT-019-36SVKE03',
    ticketType: 'Lorry Park',
    locationName: 'Atonsu Station',
    customerPhone: '020-345-6789',
    customerCategory: 'Private',
    identifier: 'KS-9012-22',
    date: '17 Aug 2025 04:45 PM',
    amount: 50.00,
    paymentType: 'Cash',
    revenueOfficer: 'Revenue Officer 2',
    community: 'Atonsu',
    zone: 'Zone B',
    createdDate: '17 Aug 2025 04:45 PM',
    receipt: true,
    gps: true,
    status: 'Paid'
  },
  // Add more ticket payment data as needed
];

interface TicketPaymentsPageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
  onCustomerClick?: (customerId: string) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const TicketPaymentsPage: React.FC<TicketPaymentsPageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply,
  onCustomerClick
}) => {
  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [receiptModalData, setReceiptModalData] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [locationModalData, setLocationModalData] = useState<any>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [chequeModalData, setChequeModalData] = useState<any>(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidModalData, setVoidModalData] = useState<any>(null);
  const [showVoidDetailsModal, setShowVoidDetailsModal] = useState(false);
  const [voidDetailsData, setVoidDetailsData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'ticketId', label: 'Ticket ID', sortable: true, width: '8%' },
    { key: 'ticketType', label: 'Ticket Type', sortable: true, width: '6%' },
    { key: 'locationName', label: 'Location Name', sortable: true, width: '8%' },
    { key: 'customerPhone', label: 'Customer Phone #', sortable: true, width: '8%' },
    { key: 'customerCategory', label: 'Customer Type', sortable: true, width: '7%' },
    { key: 'identifier', label: 'Identifier', sortable: true, width: '7%' },
    { key: 'community', label: 'Community', sortable: true, width: '7%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '5%' },
    { key: 'date', label: 'Date', sortable: true, width: '7%' },
    { key: 'amount', label: 'Amount', sortable: true, width: '6%' },
    { key: 'paymentType', label: 'Payment Type', sortable: true, width: '7%' },
    { key: 'revenueOfficer', label: 'Revenue Officer', sortable: true, width: '9%' },
    { key: 'createdDate', label: 'Created Date', sortable: true, width: '8%' },
    { key: 'status', label: 'Status', sortable: true, width: '6%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '5%' }
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
          printData(exportData, exportHeaders, 'Ticket Payments Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, exportHeaders, 'ticket-payments');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'ticket-payments');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'ticket-payments');
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
    let filtered = ticketPaymentsData.filter(payment => {
      // Date range filter
      if (selectedDateRange.start && selectedDateRange.end) {
        // Parse payment date from "20 Aug 2025 06:47 PM" format
        const paymentDateStr = payment.date.split(' ').slice(0, 3).join(' '); // "20 Aug 2025"
        const paymentDate = new Date(paymentDateStr);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        
        if (isNaN(paymentDate.getTime()) || paymentDate < startDate || paymentDate > endDate) {
          return false;
        }
      }
      
      // Business Level filter (ticket type)
      if (selectedBusinessLevel && payment.ticketType !== selectedBusinessLevel) {
        return false;
      }
      
      // Zone filter
      if (selectedZone && payment.zone !== selectedZone) {
        return false;
      }
      
      // Collector filter (revenue officer)
      if (selectedCollector && payment.revenueOfficer !== selectedCollector) {
        return false;
      }
      
      // Search filter
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        return (
          payment.id.toString().includes(searchTerm) ||
          payment.ticketId.toLowerCase().includes(search) ||
          payment.ticketType.toLowerCase().includes(search) ||
          payment.locationName.toLowerCase().includes(search) ||
          payment.customerPhone.includes(searchTerm) ||
          payment.customerCategory.toLowerCase().includes(search) ||
          payment.identifier.toLowerCase().includes(search) ||
          payment.community?.toLowerCase().includes(search) ||
          payment.date.toLowerCase().includes(search) ||
          payment.amount.toString().includes(searchTerm) ||
          (payment.paymentType && payment.paymentType.toLowerCase().includes(search)) ||
          payment.revenueOfficer.toLowerCase().includes(search) ||
          payment.zone.toLowerCase().includes(search) ||
          payment.createdDate.toLowerCase().includes(search)
        );
      }
      
      return true;
    });

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
  }, [selectedDateRange, selectedBusinessLevel, selectedZone, selectedCollector, searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);
  
  // Calculate total amount from filtered data
  const totalAmount = filteredAndSortedData.reduce((sum, payment) => sum + payment.amount, 0);

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
          placeholder="Select Business Center"
          options={businessLevelOptions}
          value={selectedBusinessLevel}
          onChange={setSelectedBusinessLevel}
        />

        <ModernSelect
          placeholder="Select Zone"
          options={[
            { value: 'Zone A', label: 'Zone A' },
            { value: 'Zone B', label: 'Zone B' },
            { value: 'Zone C', label: 'Zone C' }
          ]}
          value={selectedZone}
          onChange={setSelectedZone}
        />

        <ModernSelect
          placeholder="Select Revenue Officer"
          options={[
            { value: 'Revenue Officer 1', label: 'Revenue Officer 1' },
            { value: 'Revenue Officer 2', label: 'Revenue Officer 2' },
            { value: 'Revenue Officer 3', label: 'Revenue Officer 3' }
          ]}
          value={selectedCollector}
          onChange={setSelectedCollector}
        />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Tickets</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GHS {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-green-100">Total Ticket Revenue</div>
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
              placeholder="Search tickets, vendors..."
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
            {currentData.map((payment, index) => (
              <tr key={payment.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs font-mono">
                    {payment.ticketId}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  <span className={`text-xs font-medium ${
                    payment.ticketType === 'Market' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {payment.ticketType}
                  </span>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="text-xs">
                    {payment.locationName}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="font-mono text-xs">
                    {payment.customerPhone}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100 font-medium">
                  <div className="text-xs">
                    {payment.customerCategory}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="text-xs">
                    {payment.identifier}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100 text-center">
                  {payment.community || '-'}
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold text-slate-800">
                    {payment.zone}
                  </span>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{payment.date.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {payment.date.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-right font-semibold">
                  {payment.amount.toFixed(2)}
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  <span className={`text-xs font-medium ${
                    payment.paymentType === 'Cash' ? 'text-green-600' : 
                    payment.paymentType === 'e-Payment' ? 'text-blue-600' : 
                    'text-purple-600'
                  }`}>
                    {payment.paymentType}
                  </span>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="text-xs">
                    {payment.revenueOfficer}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{payment.createdDate.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {payment.createdDate.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : payment.status === 'Voided'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-1 py-2 text-xs text-center">
                  <div className="flex items-center justify-center gap-1">
                    {payment.gps && (
                      <button 
                        onClick={() => {
                          setLocationModalData({
                            customerName: payment.locationName,
                            customerNumber: payment.customerPhone,
                            phoneNumber: payment.identifier,
                            customerType: payment.customerCategory,
                            transactionId: payment.ticketId,
                            amount: payment.amount,
                            date: payment.createdDate,
                            latitude: 5.6037 + (Math.random() - 0.5) * 0.02,
                            longitude: -0.1870 + (Math.random() - 0.5) * 0.02
                          });
                          setShowLocationModal(true);
                        }}
                        className="p-1 rounded-full transition-all duration-200 bg-blue-500 hover:bg-blue-600"
                        title="View GPS Location"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </button>
                    )}
                    {payment.status === 'Voided' ? (
                      <button 
                        onClick={() => {
                          // Show void details for already voided transactions
                          setVoidDetailsData({
                            transactionId: payment.ticketId,
                            originalAmount: payment.amount,
                            voidedBy: 'Admin User',
                            voidedDate: 'Aug 25, 2025 10:30 AM',
                            voidReason: 'Duplicate payment entry',
                            customerName: payment.locationName,
                            customerNumber: payment.customerPhone,
                            phoneNumber: payment.identifier,
                            originalDate: payment.date
                          });
                          setShowVoidDetailsModal(true);
                        }}
                        className="group relative"
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
                          // Show void modal for active transactions
                          setVoidModalData({
                            ticketId: payment.ticketId,
                            ticketType: payment.ticketType,
                            locationName: payment.locationName,
                            customerPhone: payment.customerPhone,
                            customerCategory: payment.customerCategory,
                            identifier: payment.identifier,
                            amount: payment.amount,
                            paymentType: payment.paymentType,
                            revenueOfficer: payment.revenueOfficer,
                            date: payment.date,
                            createdDate: payment.createdDate
                          });
                          setShowVoidModal(true);
                        }}
                        className="group relative"
                        title="Void Transaction"
                      >
                        <div className="relative">
                          <div className="w-5 h-5 rounded-full bg-gray-100"></div>
                          <Ban className="w-5 h-5 absolute inset-0 text-gray-300 opacity-50" strokeWidth={1.5} />
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

      {/* Receipt Modal */}
      {showReceiptModal && receiptModalData && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            setReceiptModalData(null);
          }}
          customerName={receiptModalData.customerName}
          customerNumber={receiptModalData.customerNumber}
          phoneNumber={receiptModalData.phoneNumber}
          transactionId={receiptModalData.transactionId}
          amount={receiptModalData.amount}
          date={receiptModalData.date}
          receiptImage={receiptModalData.receiptImage}
        />
      )}

      {/* Location Modal */}
      {showLocationModal && locationModalData && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setLocationModalData(null);
          }}
          customerName={locationModalData.customerName}
          customerNumber={locationModalData.customerNumber}
          phoneNumber={locationModalData.phoneNumber}
          customerType={locationModalData.customerType}
          transactionId={locationModalData.transactionId}
          amount={locationModalData.amount}
          date={locationModalData.date}
          latitude={locationModalData.latitude}
          longitude={locationModalData.longitude}
          modalTitle="Ticket Transaction Location"
          customerNameLabel="Location"
          customerNumberLabel="Phone Number"
          phoneNumberLabel="Identifier"
        />
      )}

      {/* Void Payment Modal */}
      {showVoidModal && voidModalData && (
        <VoidPaymentModal
          isOpen={showVoidModal}
          onClose={() => {
            setShowVoidModal(false);
            setVoidModalData(null);
          }}
          onConfirm={(reason) => {
            // Handle the void confirmation
            console.log('Voiding payment:', voidModalData.ticketId, 'Reason:', reason);
            setShowVoidModal(false);
            setSuccessMessage(`Transaction ${voidModalData.ticketId} has been voided successfully.`);
            setShowSuccessModal(true);
            // Here you would typically make an API call to void the transaction
            // and then refresh the data
          }}
          transactionId={voidModalData.ticketId}
          amount={voidModalData.amount}
          customerName={voidModalData.locationName}
          customerNumber={voidModalData.customerPhone}
          phoneNumber={voidModalData.identifier}
          transactionDate={voidModalData.date}
        />
      )}

      {/* Void Details Modal */}
      {showVoidDetailsModal && voidDetailsData && (
        <VoidDetailsModal
          isOpen={showVoidDetailsModal}
          onClose={() => {
            setShowVoidDetailsModal(false);
            setVoidDetailsData(null);
          }}
          transactionId={voidDetailsData.transactionId}
          amount={voidDetailsData.originalAmount}
          voidedBy={voidDetailsData.voidedBy}
          voidedDate={voidDetailsData.voidedDate}
          voidReason={voidDetailsData.voidReason}
          customerName={voidDetailsData.customerName}
          customerNumber={voidDetailsData.customerNumber || ''}
          phoneNumber={voidDetailsData.phoneNumber || ''}
          transactionDate={voidDetailsData.originalDate}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setSuccessMessage('');
          }}
          message={successMessage}
        />
      )}
    </div>
  );
};