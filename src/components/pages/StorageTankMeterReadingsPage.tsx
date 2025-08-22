import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, Camera, MapPin, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { StorageTankLocationModal } from '../ui/StorageTankLocationModal';
import { 
  storageTankMeterReadingsData, 
  businessLevelOptions,
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

interface StorageTankMeterReadingsPageProps {
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

export const StorageTankMeterReadingsPage: React.FC<StorageTankMeterReadingsPageProps> = ({
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
  const [selectedCollector, setSelectedCollector] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalData, setLocationModalData] = useState<any>(null);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '5%' },
    { key: 'storageTankMeterNumber', label: 'Meter #', sortable: true, width: '11%' },
    { key: 'storageTankName', label: 'Tank Name', sortable: true, width: '16%' },
    { key: 'meterType', label: 'Type', sortable: true, width: '8%' },
    { key: 'system', label: 'System', sortable: true, width: '10%' },
    { key: 'staffName', label: 'Staff', sortable: true, width: '12%' },
    { key: 'readingDate', label: 'Read Date', sortable: true, width: '9%' },
    { key: 'serverDate', label: 'Server Date', sortable: true, width: '9%' },
    { key: 'reading', label: 'Reading', sortable: true, width: '8%' },
    { key: 'fieldReading', label: 'Field Read', sortable: true, width: '8%' },
    { key: 'picture', label: 'Picture', sortable: false, width: '8%' }
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
          printData(exportData, exportHeaders, 'Storage Tank Meter Readings Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, exportHeaders, 'storage-tank-meter-readings');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'storage-tank-meter-readings');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'storage-tank-meter-readings');
          setExportStatus('PDF export initiated');
          break;
      }
    } catch (error) {
      setExportStatus('Export failed');
    }
    
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = storageTankMeterReadingsData.filter(reading =>
      reading.storageTankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.storageTankMeterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.meterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.system.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  return (
    <div className="space-y-3">
      {/* Top Dropdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
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
          value={selectedBusinessLevel}
          onChange={setSelectedBusinessLevel}
          placeholder="Select Business Level"
          options={businessLevelOptions}
          className="w-full"
        />
        <ModernSelect
          value={selectedCollector}
          onChange={setSelectedCollector}
          placeholder="Select Staff Name"
          options={collectorOptions}
          className="w-full"
        />
      </div>

      {/* Stats Cards Row */}
      <div className="flex gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-5 py-3 text-white flex-shrink-0" style={{ width: '320px' }}>
          <div className="text-2xl font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100 mt-0.5">Storage Tanks</div>
        </div>
        <div className="flex-grow"></div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg px-5 py-3 text-white text-right flex-shrink-0" style={{ width: '320px' }}>
          <div className="text-2xl font-bold">{totalEntries}</div>
          <div className="text-xs text-green-100 mt-0.5">Readings</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Show</span>
            <ModernSelect
              placeholder="50"
              options={entriesOptions}
              value={entriesPerPage}
              onChange={setEntriesPerPage}
              className="w-20"
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
            placeholder="Search readings..."
          />
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
              <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-t-xl">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-3 py-4 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-600 transition-all duration-300 hover:shadow-lg' : ''
                    } ${column.key === 'id' ? 'rounded-tl-xl' : ''} ${column.key === 'picture' ? 'rounded-tr-xl' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span className="leading-tight font-bold text-white drop-shadow-sm">{column.label}</span>
                      {column.sortable && (
                        <div className="flex items-center">
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
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  currentData.map((reading, index) => (
                    <tr key={reading.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center group-hover:text-slate-900">
                        {reading.id}
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100">
                        <div className="break-all leading-tight font-mono text-11px bg-slate-100 px-2 py-1 rounded">
                          {reading.storageTankMeterNumber}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100">
                        <div className="break-words leading-tight group-hover:text-slate-900">
                          {reading.storageTankName}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <span className="text-11px font-medium text-slate-800">
                          {reading.meterType}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <span className="text-11px font-medium text-slate-800">
                          {reading.system}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100">
                        <div className="break-words leading-tight group-hover:text-slate-900">
                          {reading.staffName}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <div className="leading-tight">
                          <div className="break-words font-semibold">{reading.readingDate}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <div className="leading-tight">
                          <div className="break-words font-semibold">{reading.serverDate}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <span className="text-11px font-semibold text-slate-800">
                          {reading.reading.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                        <span className="text-11px font-semibold text-slate-800">
                          {reading.fieldReading.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-11px text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button 
                            onClick={() => {
                              setLocationModalData({
                                readingId: reading.id.toString(),
                                transactionId: reading.id.toString(),
                                tankName: reading.storageTankName,
                                tankNumber: reading.storageTankMeterNumber,
                                meterNumber: reading.storageTankMeterNumber,
                                meterType: reading.meterType,
                                capacity: 10000, // Default capacity
                                reading: reading.reading,
                                readingDate: reading.readingDate,
                                staffName: reading.staffName,
                                location: reading.system,
                                city: reading.system
                              });
                              setShowLocationModal(true);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                            title="View Location"
                          >
                            <MapPin className="w-4 h-4 text-white" />
                          </button>
                          {reading.picture && (
                            <button 
                              onClick={() => console.log('Picture clicked for storage tank:', reading.storageTankName)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                              title="View Picture"
                            >
                              <Camera className="w-4 h-4 text-white" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

      {/* Card View - Mobile */}
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
        
        {currentData.map((reading, index) => (
          <div key={reading.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ID: {reading.id}</h3>
                <p className="text-blue-600 font-medium">{reading.storageTankMeterNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setLocationModalData({
                      readingId: reading.id.toString(),
                      transactionId: reading.id.toString(),
                      tankName: reading.storageTankName,
                      tankNumber: reading.storageTankMeterNumber,
                      meterNumber: reading.storageTankMeterNumber,
                      meterType: reading.meterType,
                      capacity: 10000, // Default capacity
                      reading: reading.reading,
                      readingDate: reading.readingDate,
                      staffName: reading.staffName,
                      location: reading.system,
                      city: reading.system
                    });
                    setShowLocationModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title="View Location"
                >
                  <MapPin className="w-5 h-5 text-white" />
                </button>
                {reading.picture && (
                  <button 
                    onClick={() => console.log('Picture clicked for storage tank:', reading.storageTankName)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    title="View Picture"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Storage Tank Name</label>
                  <p className="text-sm font-medium text-blue-600">{reading.storageTankName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter Type</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {reading.meterType}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">System</label>
                  <p className="text-sm text-gray-700">{reading.system}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Name</label>
                  <p className="text-sm text-gray-700">{reading.staffName}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reading Date</label>
                  <p className="text-sm font-medium text-gray-900">{reading.readingDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Server Date</label>
                  <p className="text-sm text-gray-700">{reading.serverDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reading</label>
                  <p className="text-sm font-semibold text-gray-900">{reading.reading.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Reading</label>
                  <p className="text-sm font-semibold text-gray-900">{reading.fieldReading.toLocaleString()}</p>
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

      {/* Storage Tank Location Modal */}
      {showLocationModal && locationModalData && (
        <StorageTankLocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setLocationModalData(null);
          }}
          readingId={locationModalData.readingId}
          transactionId={locationModalData.transactionId}
          tankName={locationModalData.tankName}
          tankNumber={locationModalData.tankNumber}
          meterNumber={locationModalData.meterNumber}
          meterType={locationModalData.meterType}
          capacity={locationModalData.capacity}
          reading={locationModalData.reading}
          readingDate={locationModalData.readingDate}
          staffName={locationModalData.staffName}
          location={locationModalData.location}
          city={locationModalData.city}
        />
      )}
    </div>
  );
};