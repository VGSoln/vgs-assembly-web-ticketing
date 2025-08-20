import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Plus, Edit, Eye } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { AddStorageTankPage } from './AddStorageTankPage';
import { StorageTankDetailsPage } from './StorageTankDetailsPage';
import { EditStorageTankPage } from './EditStorageTankPage';
import { 
  storageTanksData, 
  businessLevelOptions
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

interface StorageTanksPageProps {
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

export const StorageTanksPage: React.FC<StorageTanksPageProps> = ({
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
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showAddStorageTank, setShowAddStorageTank] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedTank, setSelectedTank] = useState<any>(null);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'storageTankNumber', label: 'Tank #', sortable: true, width: '8%' },
    { key: 'waterSystemName', label: 'Water System', sortable: true, width: '18%' },
    { key: 'storageTankName', label: 'Tank Name', sortable: true, width: '18%' },
    { key: 'throughput', label: 'Flow', sortable: true, width: '8%' },
    { key: 'meterNumber', label: 'Meter #', sortable: true, width: '12%' },
    { key: 'lastReadingDate', label: 'Last Read', sortable: true, width: '10%' },
    { key: 'daysSinceLastReading', label: 'Days', sortable: true, width: '7%' },
    { key: 'lastReading', label: 'Reading', sortable: true, width: '11%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '8%' }
  ];

  // Navigation handlers
  const handleAddStorageTank = () => {
    setShowAddStorageTank(true);
  };

  const handleBackFromAdd = () => {
    setShowAddStorageTank(false);
  };

  const handleSaveStorageTank = (storageTankData: any) => {
    console.log('Saving storage tank:', storageTankData);
    // Here you would implement the actual save logic
    // For now, we'll just log the data
  };

  // Details handler
  const handleViewDetails = (tank: any) => {
    setSelectedTank(tank);
    setShowDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedTank(null);
  };

  const handleEditFromDetails = () => {
    setShowDetails(false);
    setShowEdit(true);
  };

  const handleBackFromEdit = () => {
    setShowEdit(false);
    setShowDetails(true);
  };

  const handleSaveEdit = (storageTankData: any) => {
    console.log('Saving edited storage tank:', storageTankData);
    // Here you would implement the actual save logic
    setShowEdit(false);
    setShowDetails(false);
    setSelectedTank(null);
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
          printData(exportData, exportHeaders, 'Storage Tanks Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, exportHeaders, 'storage-tanks');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'storage-tanks');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'storage-tanks');
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
    let filtered = storageTanksData.filter(tank =>
      tank.waterSystemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.storageTankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.meterNumber.includes(searchTerm) ||
      tank.location.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Calculate average days since last reading
  const averageDaysSinceLastReading = Math.round(
    storageTanksData.reduce((sum, tank) => sum + tank.daysSinceLastReading, 0) / storageTanksData.length
  );

  // Show Add Storage Tank page if state is true
  if (showAddStorageTank) {
    return (
      <AddStorageTankPage 
        onBack={handleBackFromAdd}
        onSave={handleSaveStorageTank}
      />
    );
  }

  // Show Edit page if state is true
  if (showEdit && selectedTank) {
    return (
      <EditStorageTankPage 
        storageTankData={selectedTank}
        onBack={handleBackFromEdit}
        onSave={handleSaveEdit}
      />
    );
  }

  // Show Details page if state is true
  if (showDetails && selectedTank) {
    return (
      <StorageTankDetailsPage 
        storageTankData={selectedTank}
        onBack={handleBackFromDetails}
        onEdit={handleEditFromDetails}
      />
    );
  }

  return (
    <div className="space-y-2">
      {/* Business Level Dropdown and Add Button Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
        <ModernSelect
          value={selectedBusinessLevel}
          onChange={setSelectedBusinessLevel}
          placeholder="Select Business Level"
          options={businessLevelOptions}
          className="md:w-64"
        />
        <button 
          onClick={handleAddStorageTank}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Storage Tank
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 text-white">
          <div className="text-lg font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Storage Tanks</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2 text-white text-right">
          <div className="text-lg font-bold">{averageDaysSinceLastReading}</div>
          <div className="text-xs text-green-100">Average Days Since Last Reading</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
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
              placeholder="Search storage tanks..."
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
              <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-t-xl">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-2 py-3 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-600 transition-all duration-300 hover:shadow-lg' : ''
                    } ${column.key === 'storageTankNumber' ? 'rounded-tl-xl' : ''} ${column.key === 'actions' ? 'rounded-tr-xl' : ''}`}
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
                {currentData.map((tank, index) => (
                  <tr key={tank.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100 text-center group-hover:text-slate-900">
                      <div className="text-11px">
                        {tank.storageTankNumber}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100">
                      <div className="break-words leading-tight group-hover:text-slate-900">
                        {tank.waterSystemName}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100">
                      <div 
                        className="break-words leading-tight group-hover:text-slate-900 cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                        onClick={() => handleViewDetails(tank)}
                      >
                        {tank.storageTankName}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100 text-center">
                      <span className="text-11px font-semibold text-slate-800">
                        {tank.throughput}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-700 border-r border-gray-100">
                      <div className="break-all leading-tight font-mono text-10px bg-slate-100 px-1 py-0.5 rounded text-center">
                        {tank.meterNumber}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100">
                      <div className="leading-tight text-center">
                        <div className="break-words font-semibold text-10px">{tank.lastReadingDate}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100 text-center">
                      <span className="text-11px font-semibold text-slate-800">
                        {tank.daysSinceLastReading}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-11px text-slate-800 border-r border-gray-100 text-center">
                      <span className="text-10px font-semibold text-slate-800">
                        {tank.lastReading.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-11px text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <button 
                          onClick={() => handleViewDetails(tank)}
                          className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        {tank.gps && (
                          <button 
                            onClick={() => console.log('GPS clicked for storage tank:', tank.storageTankName)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer" 
                            title="View GPS Location"
                          >
                            <MapPin className="w-4 h-4 text-white" />
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
            <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 px-4 py-3 rounded-b-xl">
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
        
        {currentData.map((tank, index) => (
          <div key={tank.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tank.storageTankNumber}</h3>
                <p 
                  className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 hover:underline transition-colors duration-200"
                  onClick={() => handleViewDetails(tank)}
                >
                  {tank.storageTankName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tank.gps && (
                  <button 
                    onClick={() => console.log('GPS clicked for storage tank:', tank.storageTankName)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs font-medium">GPS</span>
                  </button>
                )}
                <button 
                  onClick={() => handleViewDetails(tank)}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Water System Name</label>
                  <p className="text-sm text-gray-900">{tank.waterSystemName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Throughput</label>
                  <p className="text-sm font-semibold text-gray-900">{tank.throughput}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter #</label>
                  <p className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">{tank.meterNumber}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Reading Date</label>
                  <p className="text-sm font-medium text-gray-900">{tank.lastReadingDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Since Last Reading</label>
                  <p className="text-sm font-semibold text-gray-900">{tank.daysSinceLastReading}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Reading</label>
                  <p className="text-sm font-semibold text-gray-900">{tank.lastReading.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100" style={{ marginTop: '4px', marginBottom: '2px' }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3" style={{ marginTop: '1px', marginBottom: '1px' }}>
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