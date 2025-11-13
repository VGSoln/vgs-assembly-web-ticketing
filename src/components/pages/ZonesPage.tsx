import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Plus, Edit, Eye } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { AddZonePage } from './AddZonePage';
import { EditZonePage } from './EditZonePage';
import {
  businessLevelOptions
} from '@/lib/data';
import { DateRange } from '@/types/dashboard';
import {
  copyToClipboard,
  printData,
  exportToExcel,
  exportToCSV,
  exportToPDF
} from '@/lib/exportUtils';
import { getZones } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ZonesPageProps {
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

interface Zone {
  id: string;
  'assembly-id': string;
  name: string;
  description?: string;
  'is-active': boolean;
  'created-at': string;
  'updated-at': string;
  'created-by': string;
  'updated-by': string;
}

export const ZonesPage: React.FC<ZonesPageProps> = ({
  selectedDateRange,
  displayDateRange,
  activePreset,
  dateRangeOpen,
  onDateRangeToggle,
  onPresetSelect,
  onDateRangeChange,
  onDateRangeApply
}) => {
  const { currentUser } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showAddZone, setShowAddZone] = useState(false);
  const [showEditZone, setShowEditZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Fetch zones data
  useEffect(() => {
    const fetchZones = async () => {
      if (!currentUser?.['assembly-id']) {
        setError('No assembly ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getZones({ 'assembly-id': currentUser['assembly-id'] });
        setZones(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching zones:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch zones');
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [currentUser]);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'id', label: 'Zone ID', sortable: true, width: '15%' },
    { key: 'name', label: 'Zone Name', sortable: true, width: '20%' },
    { key: 'description', label: 'Community', sortable: true, width: '15%' },
    { key: 'is-active', label: 'Status', sortable: true, width: '10%' },
    { key: 'created-at', label: 'Created Date', sortable: true, width: '13%' },
    { key: 'updated-at', label: 'Modified Date', sortable: true, width: '13%' },
    { key: 'actions', label: '', sortable: false, width: '4%' }
  ];

  // Export headers
  const exportHeaders = ['Zone ID', 'Zone Name', 'Community', 'Status', 'Created Date', 'Modified Date'];

  // Transform data for export
  const transformForExport = (zone: Zone) => ({
    'Zone ID': zone.id,
    'Zone Name': zone.name,
    'Community': zone.description || '-',
    'Status': zone['is-active'] ? 'Active' : 'Inactive',
    'Created Date': new Date(zone['created-at']).toLocaleString(),
    'Modified Date': new Date(zone['updated-at']).toLocaleString()
  });

  // Navigation handlers
  const handleAddZone = () => {
    setShowAddZone(true);
  };

  const handleBackFromAdd = () => {
    setShowAddZone(false);
  };

  const handleSaveZone = (zoneData: any) => {
    console.log('Saving zone:', zoneData);
    setShowAddZone(false);
  };

  const handleEditZone = (zone: Zone) => {
    setSelectedZone(zone);
    setShowEditZone(true);
  };

  const handleBackFromEdit = () => {
    setShowEditZone(false);
    setSelectedZone(null);
  };

  const handleSaveEdit = (zoneData: any) => {
    console.log('Saving edited zone:', zoneData);
    setShowEditZone(false);
    setSelectedZone(null);
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
    const exportData = filteredAndSortedData.map(transformForExport);
    setExportStatus(`Exporting ${type}...`);

    try {
      switch (type) {
        case 'copy':
          const success = await copyToClipboard(exportData, exportHeaders);
          setExportStatus(success ? 'Copied to clipboard!' : 'Failed to copy');
          break;
        case 'print':
          printData(exportData, exportHeaders, 'Zones Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, exportHeaders, 'zones');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'zones');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'zones');
          setExportStatus('PDF file downloaded');
          break;
      }
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = zones.filter(zone =>
      zone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Sort
    if (sortConfig) {
      filtered.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [zones, searchTerm, sortConfig]);

  // Pagination
  const totalEntries = filteredAndSortedData.length;
  const entriesPerPageNum = parseInt(entriesPerPage);
  const totalPages = Math.ceil(totalEntries / entriesPerPageNum);
  const startIndex = (currentPage - 1) * entriesPerPageNum;
  const endIndex = Math.min(startIndex + entriesPerPageNum, totalEntries);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Show Add Zone page if state is true
  if (showAddZone) {
    return (
      <AddZonePage 
        onSave={handleSaveZone}
      />
    );
  }

  // Show Edit Zone page if state is true
  if (showEditZone && selectedZone) {
    return (
      <EditZonePage
        zoneId={selectedZone.id}
        onBack={handleBackFromEdit}
        onSave={handleSaveEdit}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading zones...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading zones</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
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
          onClick={handleAddZone}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 text-white">
          <div className="text-lg font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Zones</div>
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
              placeholder="Search zones..."
            />
          </div>
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
                    } ${column.key === 'zoneId' ? 'rounded-tl-xl' : ''} ${column.key === 'actions' ? 'rounded-tr-xl' : ''}`}
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
                {currentData.map((zone, index) => (
                  <tr key={zone.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px font-semibold">
                        {zone.id}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="break-words leading-tight group-hover:text-slate-900 text-blue-600 hover:text-blue-800 text-10px">
                        {zone.name}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <span className="text-10px">
                        {zone.description || '-'}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-10px border-r border-gray-100 text-center">
                      <span className={`px-2 py-1 text-10px font-semibold rounded-full ${
                        zone['is-active']
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {zone['is-active'] ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px">
                        {new Date(zone['created-at']).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px">
                        {new Date(zone['updated-at']).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-center">
                      <button
                        onClick={() => handleEditZone(zone)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title="Edit Zone"
                      >
                        <Edit className="w-3 h-3 text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            
            {/* Desktop Table Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
                </div>
                {totalPages > 1 && (
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors duration-200`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {currentData.map((zone) => (
            <div key={zone.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-gray-500">ID:</span>
                  <span className="text-sm font-semibold ml-1">{zone.id}</span>
                </div>
                <button
                  onClick={() => handleEditZone(zone)}
                  className="bg-blue-500 p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit Zone"
                >
                  <Edit className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="text-sm text-blue-600 font-semibold mb-1">{zone.name}</div>
              <div className="text-sm text-gray-600 mb-1">Community: {zone.description || '-'}</div>
              <div className="mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full ${
                  zone['is-active']
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {zone['is-active'] ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1">{new Date(zone['created-at']).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Modified:</span>
                  <span className="ml-1">{new Date(zone['updated-at']).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Footer */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
        </div>
      </div>
    </div>
  );
};