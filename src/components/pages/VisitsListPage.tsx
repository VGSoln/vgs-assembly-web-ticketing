import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Camera, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { 
  visitsTransactionsData, 
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

interface VisitsListPageProps {
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

export const VisitsListPage: React.FC<VisitsListPageProps> = ({
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
    { key: 'id', label: 'ID', sortable: true, width: '5%' },
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '10%' },
    { key: 'customerName', label: 'Name', sortable: true, width: '12%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '9%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '6%' },
    { key: 'staffName', label: 'Staff', sortable: true, width: '10%' },
    { key: 'visitDate', label: 'Visit Date', sortable: true, width: '9%' },
    { key: 'visitOutcome', label: 'Outcome', sortable: true, width: '9%' },
    { key: 'customerComments', label: 'Customer Comments', sortable: true, width: '12%' },
    { key: 'staffComments', label: 'Staff Comments', sortable: true, width: '12%' },
    { key: 'created', label: 'Created', sortable: true, width: '9%' },
    { key: 'gps', label: 'GPS', sortable: false, width: '6%' }
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
          printData(exportData, exportHeaders, 'Customer Visits Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          exportToExcel(exportData, exportHeaders, 'customer-visits');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'customer-visits');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'customer-visits');
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
    let filtered = visitsTransactionsData.filter(visit =>
      visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.phone.includes(searchTerm) ||
      visit.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visit.customerComments && visit.customerComments.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visit.staffComments && visit.staffComments.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-green-100">Total Visits</div>
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
              placeholder="Search visits, customers, comments..."
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
            {currentData.map((visit, index) => (
              <tr key={visit.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}>
                <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center group-hover:text-slate-900">
                  <div className="text-xs">
                    {visit.id}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs border-r border-gray-100">
                  <a href="#" className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline">
                    {visit.customerNumber}
                  </a>
                </td>
                <td className="px-2 py-2 text-xs border-r border-gray-100">
                  <a href="#" className="text-blue-600 hover:text-blue-800 break-words leading-tight transition-colors duration-200 hover:underline group-hover:text-blue-800">
                    {visit.customerName}
                  </a>
                </td>
                <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                  <div className="break-all leading-tight font-mono text-xs bg-slate-100 px-1 py-1 rounded">
                    {visit.phone}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                  <span className="text-xs font-semibold text-slate-800">
                    {visit.zone.replace('ZONE ', '')}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100 font-medium">
                  <div className="break-words leading-tight group-hover:text-slate-800">
                    {visit.staffName}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100">
                  <div className="leading-tight text-center">
                    <div className="break-words font-semibold">{visit.visitDate}</div>
                    <div className="text-xs text-slate-500 break-words mt-0.5">{visit.visitTime}</div>
                  </div>
                </td>
                <td className="px-2 py-2 text-xs border-r border-gray-100">
                  <span className="text-xs font-semibold text-slate-800">
                    {visit.visitOutcome}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                  <div className="break-words leading-tight text-xs bg-slate-50 p-1 rounded border-l-2 border-blue-200">
                    {visit.customerComments || <span className="text-slate-400 italic">No comments</span>}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                  <div className="break-words leading-tight text-xs bg-slate-50 p-1 rounded border-l-2 border-green-200">
                    {visit.staffComments || <span className="text-slate-400 italic">No comments</span>}
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100">
                  <div className="leading-tight text-center">
                    <div className="break-words font-semibold">{visit.created.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="text-xs text-slate-500 break-words mt-0.5">{visit.created.split(' ').slice(3).join(' ')}</div>
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  <div className="flex flex-col items-center gap-1">
                    {visit.gps && (
                      <button 
                        onClick={() => console.log('GPS clicked for visit:', visit.id, 'Customer:', visit.customerName)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                        title="View GPS Location"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </button>
                    )}
                    {visit.photo && (
                      <button 
                        onClick={() => console.log('Photo clicked for visit:', visit.id, 'Customer:', visit.customerName)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                        title="View Photo"
                      >
                        <Camera className="w-4 h-4 text-white" />
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
                    onClick={() => console.log('GPS clicked for visit:', visit.id, 'Customer:', visit.customerName)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    title="View GPS Location"
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </button>
                )}
                {visit.photo && (
                  <button 
                    onClick={() => console.log('Photo clicked for visit:', visit.id, 'Customer:', visit.customerName)}
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Visit Date</label>
                  <div>
                    <p className="text-11px font-medium text-gray-900">{visit.visitDate}</p>
                    <p className="text-xs text-gray-500">{visit.visitTime}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Visit Outcome</label>
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