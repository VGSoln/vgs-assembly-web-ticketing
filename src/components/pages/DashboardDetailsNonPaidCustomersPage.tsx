import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Phone, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { CustomerLocationModal } from '../ui/CustomerLocationModal';
import { LogCustomerCallModal } from '../ui/LogCustomerCallModal';
import { nonPaidCustomersData } from '@/lib/nonPaidCustomersData';
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

interface DashboardDetailsNonPaidCustomersPageProps {
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  dateRangeOpen: boolean;
  onDateRangeToggle: () => void;
  onPresetSelect: (preset: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onDateRangeApply: () => void;
  onNavigateBack?: () => void;
  onCustomerClick?: (customerId: string) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

// Removed formatPaidMonth as it's not needed for this page

export const DashboardDetailsNonPaidCustomersPage: React.FC<DashboardDetailsNonPaidCustomersPageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply,
  onNavigateBack,
  onCustomerClick
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCustomerLocation, setSelectedCustomerLocation] = useState<any>(null);
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [logCallModalData, setLogCallModalData] = useState<any>(null);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '10%' },
    { key: 'customerName', label: 'Customer Name', sortable: true, width: '15%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '10%' },
    { key: 'meterNumber', label: 'Meter #', sortable: true, width: '10%' },
    { key: 'customerType', label: 'Customer Type', sortable: true, width: '8%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '7%' },
    { key: 'unpaidBills', label: '# of Unpaid Bills', sortable: true, width: '8%' },
    { key: 'totalAmountOwed', label: 'Total Amt Owed', sortable: true, width: '10%' },
    { key: 'createdDate', label: 'Created Date', sortable: true, width: '15%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '7%' }
  ];

  // Format date function
  const formatCreatedDate = (dateString: string) => {
    if (!dateString) return { date: 'N/A', time: '' };
    
    // Parse the date string regardless of format
    const dateObj = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return { date: dateString, time: '' };
    }
    
    const day = dateObj.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return {
      date: `${day} ${monthName} ${year}`,
      time: `${hours}:${minutes} ${period}`
    };
  };

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
          printData(exportData, exportHeaders, 'Non-Paid Customers Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, exportHeaders, 'non-paid-customers');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'non-paid-customers');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'non-paid-customers');
          setExportStatus('PDF export opened');
          break;
      }
    } catch (error) {
      setExportStatus('Export failed');
    }
    
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Use non-paid customers data
  const getDataByFilter = () => {
    return nonPaidCustomersData;
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const baseData = getDataByFilter();
    
    let filtered = baseData.filter(customer => {
      // Apply search filter
      return customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.unpaidBills.toString().includes(searchTerm) ||
        customer.totalAmountOwed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.createdDate.toLowerCase().includes(searchTerm.toLowerCase());
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
  }, [searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  // Calculate total debt amount (example calculation - you can adjust based on actual data)
  const totalDebtAmount = 396907; // This would be calculated from actual debt data

  return (
    <div className="space-y-3">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Customers</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GH₵ {totalDebtAmount.toLocaleString()}</div>
          <div className="text-xs text-red-100">Total Amount Owed</div>
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
              placeholder="Search debt, customers, comments..."
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
      <div className="hidden md:block bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border-0 overflow-hidden backdrop-blur-sm p-1">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full table-fixed border-collapse min-w-[800px]">
            <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-2 py-4 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
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
            {currentData.map((customer, index) => (
              <tr key={customer.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}>
                <td className="px-1 py-2 text-xs border-r border-gray-100">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onCustomerClick?.(customer.customerNumber);
                    }}
                    className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline text-xs">
                    {customer.customerNumber}
                  </a>
                </td>
                <td className="px-1 py-2 text-xs border-r border-gray-100">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onCustomerClick?.(customer.customerNumber);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 break-words leading-tight cursor-pointer hover:underline transition-colors duration-200">
                    {customer.customerName}
                  </a>
                </td>
                <td className="px-1 py-2 text-xs text-slate-700 border-r border-gray-100">
                  <div className="break-all leading-tight text-xs">
                    {customer.phone}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs text-slate-700 border-r border-gray-100">
                  <div className="text-xs break-all leading-tight">
                    {customer.meterNumber}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs text-slate-800">
                    {customer.customerType}
                  </span>
                </td>
                <td className="px-1 py-2 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold text-slate-800">
                    {customer.zone}
                  </span>
                </td>
                <td className="px-1 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold">
                    {customer.unpaidBills}
                  </span>
                </td>
                <td className="px-1 py-2 text-xs text-slate-800 border-r border-gray-100 text-right">
                  <div className="text-xs font-bold text-red-600">
                    {customer.totalAmountOwed}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs text-slate-800 border-r border-gray-100">
                  <div className="text-xs break-words leading-tight">
                    {(() => {
                      const formatted = formatCreatedDate(customer.createdDate);
                      return (
                        <>
                          <span className="font-bold">{formatted.date}</span>
                          {formatted.time && (
                            <span className="ml-1">{formatted.time}</span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </td>
                <td className="px-1 py-2 text-xs text-center">
                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={() => {
                        setSelectedCustomerLocation({
                          customerName: customer.customerName,
                          customerNumber: customer.customerNumber,
                          customerPhone: customer.phone,
                          city: customer.zone,
                          meterNumber: customer.meterNumber,
                          lastPaymentDate: customer.createdDate,
                          amountDue: parseFloat(customer.totalAmountOwed.replace(/[^0-9.-]+/g, "")),
                          // Add some variation to coordinates for demo
                          latitude: 5.6037 + (Math.random() - 0.5) * 0.05,
                          longitude: -0.1870 + (Math.random() - 0.5) * 0.05
                        });
                        setShowLocationModal(true);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                      title="View GPS Location"
                    >
                      <MapPin className="w-3 h-3 text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setLogCallModalData({
                          customerName: customer.customerName,
                          customerNumber: customer.customerNumber,
                          staffName: ''
                        });
                        setShowLogCallModal(true);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 p-1.5 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                      title="Log Customer Call"
                    >
                      <Phone className="w-3 h-3 text-white" />
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
        
        {currentData.map((customer, index) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ID: {customer.id}</h3>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onCustomerClick?.(customer.customerNumber);
                  }}
                  className="text-blue-600 hover:text-blue-800 underline font-medium">
                  {customer.customerNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedCustomerLocation({
                      customerName: customer.customerName,
                      customerNumber: customer.customerNumber,
                      customerPhone: customer.phone,
                      city: customer.zone,
                      meterNumber: customer.meterNumber,
                      lastPaymentDate: customer.createdDate,
                      amountDue: parseFloat(customer.totalAmountOwed.replace(/[^0-9.-]+/g, "")),
                      // Add some variation to coordinates for demo
                      latitude: 5.6037 + (Math.random() - 0.5) * 0.05,
                      longitude: -0.1870 + (Math.random() - 0.5) * 0.05
                    });
                    setShowLocationModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title="View GPS Location"
                >
                  <MapPin className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => {
                    setLogCallModalData({
                      customerName: customer.customerName,
                      customerNumber: customer.customerNumber,
                      staffName: ''
                    });
                    setShowLogCallModal(true);
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title="Log Customer Call"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</label>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onCustomerClick?.(customer.customerNumber);
                    }}
                    className="text-11px font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200 block">
                    {customer.customerName}
                  </a>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-11px text-gray-700">{customer.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.zone}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Paid Amount</label>
                  <p className="text-11px text-gray-700">{customer.totalAmountOwed}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</label>
                  <div>
                    <p className="text-11px text-gray-900">
                      {(() => {
                        const formatted = formatCreatedDate(customer.createdDate);
                        return (
                          <>
                            <span className="font-bold">{formatted.date}</span>
                            {formatted.time && (
                              <span className="ml-1 font-normal">{formatted.time}</span>
                            )}
                          </>
                        );
                      })()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unpaid Bills</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {customer.unpaidBills} bills
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount Owed</label>
                  <p className="text-11px font-bold text-red-600">{customer.totalAmountOwed}</p>
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

      {/* Customer Location Modal */}
      {showLocationModal && selectedCustomerLocation && (
        <CustomerLocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setSelectedCustomerLocation(null);
          }}
          customerName={selectedCustomerLocation.customerName}
          customerNumber={selectedCustomerLocation.customerNumber}
          customerPhone={selectedCustomerLocation.customerPhone}
          city={selectedCustomerLocation.city}
          meterNumber={selectedCustomerLocation.meterNumber}
          lastPaymentDate={selectedCustomerLocation.lastPaymentDate}
          amountDue={selectedCustomerLocation.amountDue}
          latitude={selectedCustomerLocation.latitude}
          longitude={selectedCustomerLocation.longitude}
        />
      )}

      {/* Log Customer Call Modal */}
      {showLogCallModal && logCallModalData && (
        <LogCustomerCallModal
          isOpen={showLogCallModal}
          onClose={() => {
            setShowLogCallModal(false);
            setLogCallModalData(null);
          }}
          customerName={logCallModalData.customerName}
          customerNumber={logCallModalData.customerNumber}
        />
      )}
    </div>
  );
};