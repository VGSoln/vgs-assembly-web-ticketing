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

// Payment transactions data
const paymentsTransactionsData = [
  {
    id: 1,
    transId: '0504-07-001784-mekbqkl0',
    customerName: 'MICHAEL NIIBII AMPATI 4',
    customerNumber: '0504-07-001784',
    phone: '055-918-5237',
    amount: 163.01,
    collector: 'CWSA Admin',
    type: 'ePayment',
    zone: 'ZONE 7',
    periodEnd: '01 Aug 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 06:47 PM',
    created: '20 Aug 2025 06:47 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 2,
    transId: '019-36SVKE01',
    customerName: 'JULIANA AYENSU',
    customerNumber: '0504-07-001876',
    phone: '050-608-2996',
    amount: 170,
    collector: 'Rapheal Kwabena Aboagye',
    type: 'Cheque',
    zone: 'ZONE 3',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 05:02 PM',
    created: '20 Aug 2025 05:02 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 3,
    transId: '019-07SVKE00',
    customerName: 'DANIEL NIIQUAYE AMARSAH II',
    customerNumber: '0525-07-00200',
    phone: '020-818-3923',
    amount: 30,
    collector: 'Rapheal Kwabena Aboagye',
    type: 'Cheque',
    zone: 'ZONE 4',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 05:00 PM',
    created: '20 Aug 2025 05:00 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 4,
    transId: '019-21RVKE59',
    customerName: 'SALOMEY AMASSAH',
    customerNumber: '0525-07-00409',
    phone: '024-444-7699',
    amount: 580,
    collector: 'Rapheal Kwabena Aboagye',
    type: 'Cash',
    zone: 'ZONE 4',
    periodEnd: '01 Aug 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 04:59 PM',
    created: '20 Aug 2025 04:59 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 5,
    transId: '018-35RVKE48',
    customerName: 'DOROTHY ANATI 4',
    customerNumber: '0525-07-01165',
    phone: '025-717-3250',
    amount: 100,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 04:48 PM',
    created: '20 Aug 2025 04:48 PM',
    status: 'Voided',
    voidReason: 'Duplicate payment - customer already paid for this period',
    voidedDate: '21 Aug 2025 10:30 AM',
    voidedBy: 'CWSA Admin',
    receipt: true,
    gps: true
  },
  {
    id: 6,
    transId: '018-51RVKE19',
    customerName: 'MR. FORD ATTIPOE',
    customerNumber: '0525-07-01268',
    phone: '024-632-9772',
    amount: 30,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Aug 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 04:20 PM',
    created: '20 Aug 2025 04:20 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 7,
    transId: '018-47RVKE02',
    customerName: 'PAUL KONDE 8',
    customerNumber: '0525-07-01193',
    phone: '024-783-5368',
    amount: 45,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Aug 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 04:02 PM',
    created: '20 Aug 2025 04:02 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 8,
    transId: '018-49QVKE52',
    customerName: 'MUSA SANNIE OSMANU',
    customerNumber: '0525-07-01116',
    phone: '024-200-1365',
    amount: 178,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Aug 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 03:53 PM',
    created: '20 Aug 2025 03:53 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 9,
    transId: '018-13QVKE29',
    customerName: 'ENOCH ATITSOGBUI',
    customerNumber: '0525-07-01235',
    phone: '024-323-8613',
    amount: 215,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 03:29 PM',
    created: '20 Aug 2025 03:29 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 10,
    transId: '019-00QVKE27',
    customerName: 'KPORMEGBE JOYLAND',
    customerNumber: '0504-07-001896',
    phone: '054-072-6058',
    amount: 300,
    collector: 'Rapheal Kwabena Aboagye',
    type: 'Cash',
    zone: 'ZONE 4',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 03:27 PM',
    created: '20 Aug 2025 03:27 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  },
  {
    id: 11,
    transId: '018-39QVKE09',
    customerName: 'JOHN KENNEDY AMEVEANKU',
    customerNumber: '0525-07-01207',
    phone: '054-958-3762',
    amount: 100,
    collector: 'Francis Seguri',
    type: 'Cash',
    zone: 'ZONE 3',
    periodEnd: '01 Jul 2025',
    customerType: 'Domestic',
    dateTime: '20 Aug 2025 03:09 PM',
    created: '20 Aug 2025 03:09 PM',
    status: 'Paid',
    receipt: true,
    gps: true
  }
];

interface PaymentsListPageProps {
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

export const PaymentsListPage: React.FC<PaymentsListPageProps> = ({
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
    { key: 'transId', label: 'Trans ID', sortable: true, width: '11%' },
    { key: 'customerName', label: 'Customer Name', sortable: true, width: '11%' },
    { key: 'customerNumber', label: 'Cust #', sortable: true, width: '8%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '7%' },
    { key: 'amount', label: 'Amt', sortable: true, width: '6%' },
    { key: 'collector', label: 'Collector', sortable: true, width: '9%' },
    { key: 'type', label: 'Type', sortable: true, width: '5%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '4%' },
    { key: 'periodEnd', label: 'Period End', sortable: true, width: '6%' },
    { key: 'customerType', label: 'Customer Type', sortable: true, width: '6%' },
    { key: 'dateTime', label: 'Date & Time', sortable: true, width: '9%' },
    { key: 'created', label: 'Created', sortable: true, width: '9%' },
    { key: 'status', label: 'Status', sortable: true, width: '4%' },
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
          printData(exportData, exportHeaders, 'Customer Payments Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, exportHeaders, 'customer-payments');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'customer-payments');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'customer-payments');
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
    let filtered = paymentsTransactionsData.filter(payment =>
      payment.id.toString().includes(searchTerm) ||
      payment.transId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phone.includes(searchTerm) ||
      payment.amount.toString().includes(searchTerm) ||
      payment.collector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.periodEnd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dateTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.created.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="text-xs text-blue-100">Total Customers</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GH₵ {(totalEntries * 250).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-green-100">Total Payments</div>
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
              placeholder="Search payments, customers, comments..."
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
                    {payment.transId}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100">
                  <a href="#" onClick={() => onCustomerClick?.(payment.customerNumber)} className="text-blue-600 hover:text-blue-800 block transition-colors duration-200 hover:underline">
                    {payment.customerName}
                  </a>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100">
                  <a href="#" onClick={() => onCustomerClick?.(payment.customerNumber)} className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline text-xs font-mono">
                    {payment.customerNumber}
                  </a>
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div className="font-mono text-xs">
                    {payment.phone}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-right font-semibold">
                  {payment.amount.toFixed(2)}
                </td>
                <td className="px-1 py-1 text-xs text-slate-700 border-r border-gray-100">
                  <div>
                    {payment.collector}
                  </div>
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  {payment.type === 'Cheque' ? (
                    <button
                      onClick={() => {
                        setChequeModalData({
                          customerName: payment.customerName,
                          customerNumber: payment.customerNumber,
                          phoneNumber: payment.phone,
                          transactionId: payment.transId,
                          amount: payment.amount,
                          date: payment.dateTime
                        });
                        setShowChequeModal(true);
                      }}
                      className="text-xs font-medium text-purple-600 hover:text-purple-800 underline cursor-pointer"
                    >
                      {payment.type}
                    </button>
                  ) : (
                    <span className={`text-xs font-medium ${
                      payment.type === 'ePayment' ? 'text-blue-600' : 'text-slate-800'
                    }`}>
                      {payment.type}
                    </span>
                  )}
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold text-slate-800">
                    {payment.zone.replace('ZONE ', '')}
                  </span>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100 text-center">
                  {payment.periodEnd || '-'}
                </td>
                <td className="px-1 py-1 text-xs border-r border-gray-100 text-center">
                  {payment.customerType}
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{payment.dateTime.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {payment.dateTime.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs">
                    <span className="font-semibold">{payment.created.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="font-normal"> {payment.created.split(' ').slice(3).join(' ')}</span>
                  </div>
                </td>
                <td className="px-1 py-1 text-xs text-center border-r border-gray-100">
                  {payment.status === 'Voided' ? (
                    <button
                      onClick={() => {
                        setVoidDetailsData({
                          transactionId: payment.transId,
                          customerName: payment.customerName,
                          customerNumber: payment.customerNumber,
                          phoneNumber: payment.phone,
                          transactionDate: payment.dateTime,
                          amount: payment.amount,
                          voidReason: (payment as any).voidReason || 'Reason not available',
                          voidedDate: (payment as any).voidedDate || 'Date not available',
                          voidedBy: (payment as any).voidedBy || 'User not available'
                        });
                        setShowVoidDetailsModal(true);
                      }}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      {payment.status}
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                      {payment.status}
                    </span>
                  )}
                </td>
                <td className="px-1 py-2 text-xs text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    {payment.receipt && (
                      <button 
                        onClick={() => {
                          if (payment.type === 'ePayment') return;
                          setReceiptModalData({
                            customerName: payment.customerName,
                            customerNumber: payment.customerNumber,
                            phoneNumber: payment.phone,
                            transactionId: payment.transId,
                            amount: payment.amount,
                            date: payment.dateTime,
                            receiptImage: '/images/reciept1.jpg'
                          });
                          setShowReceiptModal(true);
                        }}
                        className={`px-1.5 py-0.5 rounded text-xs font-medium w-10 transition-colors ${
                          payment.type === 'ePayment' 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                        title={payment.type === 'ePayment' ? 'Disabled for ePayment' : 'View Receipt'}
                        disabled={payment.type === 'ePayment'}
                      >
                        Rcpt
                      </button>
                    )}
                    {payment.gps && (
                      <button 
                        onClick={() => {
                          if (payment.type === 'ePayment') return;
                          setLocationModalData({
                            customerName: payment.customerName,
                            customerNumber: payment.customerNumber,
                            phoneNumber: payment.phone,
                            transactionId: payment.transId,
                            amount: payment.amount,
                            date: payment.dateTime,
                            latitude: 5.6037 + (Math.random() - 0.5) * 0.02,
                            longitude: -0.1870 + (Math.random() - 0.5) * 0.02
                          });
                          setShowLocationModal(true);
                        }}
                        className={`p-1 rounded-full transition-all duration-200 ${
                          payment.type === 'ePayment' 
                            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        title={payment.type === 'ePayment' ? 'Disabled for ePayment' : 'View GPS Location'}
                        disabled={payment.type === 'ePayment'}
                      >
                        <MapPin className={`w-4 h-4 ${payment.type === 'ePayment' ? 'text-gray-500' : 'text-white'}`} />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (payment.type === 'ePayment') return;
                        
                        if (payment.status === 'Voided') {
                          // Show read-only void details modal for already voided payments
                          setVoidDetailsData({
                            transactionId: payment.transId,
                            customerName: payment.customerName,
                            customerNumber: payment.customerNumber,
                            phoneNumber: payment.phone,
                            transactionDate: payment.dateTime,
                            amount: payment.amount,
                            voidReason: (payment as any).voidReason || 'Reason not available',
                            voidedDate: (payment as any).voidedDate || 'Date not available',
                            voidedBy: (payment as any).voidedBy || 'User not available'
                          });
                          setShowVoidDetailsModal(true);
                        } else {
                          // Show void confirmation modal for active payments
                          setVoidModalData({
                            transactionId: payment.transId,
                            customerName: payment.customerName,
                            customerNumber: payment.customerNumber,
                            phoneNumber: payment.phone,
                            transactionDate: payment.dateTime,
                            amount: payment.amount
                          });
                          setShowVoidModal(true);
                        }
                      }}
                      className={`p-0.5 rounded-full transition-all duration-200 ${
                        payment.type === 'ePayment' 
                          ? 'cursor-not-allowed opacity-30' 
                          : payment.status === 'Voided'
                          ? 'hover:bg-red-50 cursor-pointer'
                          : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                      title={
                        payment.type === 'ePayment' 
                          ? 'Disabled for ePayment' 
                          : payment.status === 'Voided'
                          ? 'View Void Details'
                          : 'Void Transaction'
                      }
                      disabled={payment.type === 'ePayment'}
                    >
                      <div className="relative">
                        <div className={`rounded-full ${
                          payment.type === 'ePayment' 
                            ? 'w-5 h-5 bg-gray-200' 
                            : payment.status === 'Voided'
                            ? 'w-5 h-5 bg-red-100'
                            : 'w-5 h-5 bg-gray-100'
                        }`}></div>
                        <Ban className={`absolute inset-0 ${
                          payment.type === 'ePayment' 
                            ? 'w-5 h-5 text-gray-400 opacity-50' 
                            : payment.status === 'Voided'
                            ? 'w-5 h-5 text-red-600'
                            : 'w-5 h-5 text-gray-300 opacity-50'
                        }`} strokeWidth={1.5} />
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
        
        {currentData.map((payment, index) => (
          <div key={payment.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trans ID: {payment.transId}</h3>
                <a href="#" onClick={() => onCustomerClick?.(payment.customerNumber)} className="text-blue-600 hover:text-blue-800 underline font-medium">
                  {payment.customerNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                {payment.status === 'Voided' ? (
                  <button
                    onClick={() => {
                      setVoidDetailsData({
                        transactionId: payment.transId,
                        customerName: payment.customerName,
                        customerNumber: payment.customerNumber,
                        phoneNumber: payment.phone,
                        transactionDate: payment.dateTime,
                        amount: payment.amount,
                        voidReason: (payment as any).voidReason || 'Reason not available',
                        voidedDate: (payment as any).voidedDate || 'Date not available',
                        voidedBy: (payment as any).voidedBy || 'User not available'
                      });
                      setShowVoidDetailsModal(true);
                    }}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    {payment.status}
                  </button>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                )}
                {payment.gps && (
                  <button 
                    onClick={() => {
                      if (payment.type === 'ePayment') return;
                      setLocationModalData({
                        customerName: payment.customerName,
                        customerNumber: payment.customerNumber,
                        phoneNumber: payment.phone,
                        transactionId: payment.transId,
                        amount: payment.amount,
                        date: payment.dateTime,
                        latitude: 5.6037 + (Math.random() - 0.5) * 0.02,
                        longitude: -0.1870 + (Math.random() - 0.5) * 0.02
                      });
                      setShowLocationModal(true);
                    }}
                    className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                      payment.type === 'ePayment'
                        ? 'bg-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 cursor-pointer'
                    }`}
                    title={payment.type === 'ePayment' ? 'Disabled for ePayment' : 'View GPS Location'}
                    disabled={payment.type === 'ePayment'}
                  >
                    <MapPin className={`w-5 h-5 ${payment.type === 'ePayment' ? 'text-gray-500' : 'text-white'}`} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</label>
                  <a href="#" onClick={() => onCustomerClick?.(payment.customerNumber)} className="text-sm text-blue-600 hover:text-blue-800 break-words leading-tight cursor-pointer hover:underline transition-colors duration-200 font-medium">{payment.customerName}</a>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-sm text-gray-700">{payment.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
                  <p className="text-lg font-bold text-green-600">GH₵ {payment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                  {payment.type === 'Cheque' ? (
                    <button
                      onClick={() => {
                        setChequeModalData({
                          customerName: payment.customerName,
                          customerNumber: payment.customerNumber,
                          phoneNumber: payment.phone,
                          transactionId: payment.transId,
                          amount: payment.amount,
                          date: payment.dateTime
                        });
                        setShowChequeModal(true);
                      }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                    >
                      {payment.type}
                    </button>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.type === 'ePayment' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.type}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collector</label>
                  <p className="text-sm text-gray-700">{payment.collector}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {payment.zone}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</label>
                  <p className="text-sm text-gray-700">{payment.periodStart}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</label>
                  <p className="text-sm text-gray-700">{payment.dateTime}</p>
                </div>
              </div>
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
          transactionId={locationModalData.transactionId}
          amount={locationModalData.amount}
          date={locationModalData.date}
          latitude={locationModalData.latitude}
          longitude={locationModalData.longitude}
        />
      )}

      {/* Cheque Modal */}
      {showChequeModal && chequeModalData && (
        <ChequeModal
          isOpen={showChequeModal}
          onClose={() => {
            setShowChequeModal(false);
            setChequeModalData(null);
          }}
          customerName={chequeModalData.customerName}
          customerNumber={chequeModalData.customerNumber}
          phoneNumber={chequeModalData.phoneNumber}
          transactionId={chequeModalData.transactionId}
          amount={chequeModalData.amount}
          date={chequeModalData.date}
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
            console.log('Voiding payment:', voidModalData.transactionId, 'Reason:', reason);
            // Here you would typically make an API call to void the payment
            
            // Close void modal
            setShowVoidModal(false);
            
            // Show success modal
            setSuccessMessage(`Payment transaction #${voidModalData.transactionId} has been successfully voided.`);
            setShowSuccessModal(true);
            
            // Clear void modal data
            setVoidModalData(null);
          }}
          transactionId={voidModalData.transactionId}
          customerName={voidModalData.customerName}
          customerNumber={voidModalData.customerNumber}
          phoneNumber={voidModalData.phoneNumber}
          transactionDate={voidModalData.transactionDate}
          amount={voidModalData.amount}
        />
      )}

      {/* Void Details Modal (for already voided payments) */}
      {showVoidDetailsModal && voidDetailsData && (
        <VoidDetailsModal
          isOpen={showVoidDetailsModal}
          onClose={() => {
            setShowVoidDetailsModal(false);
            setVoidDetailsData(null);
          }}
          transactionId={voidDetailsData.transactionId}
          customerName={voidDetailsData.customerName}
          customerNumber={voidDetailsData.customerNumber}
          phoneNumber={voidDetailsData.phoneNumber}
          transactionDate={voidDetailsData.transactionDate}
          amount={voidDetailsData.amount}
          voidReason={voidDetailsData.voidReason}
          voidedDate={voidDetailsData.voidedDate}
          voidedBy={voidDetailsData.voidedBy}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
        }}
        title="Payment Voided"
        message={successMessage}
        details="The payment has been permanently voided and cannot be reversed."
      />
    </div>
  );
};