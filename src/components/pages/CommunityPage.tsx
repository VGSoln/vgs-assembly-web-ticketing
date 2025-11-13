import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Plus, Edit, Eye } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { AddCommunityPage } from './AddCommunityPage';
import { EditCommunityPage } from './EditCommunityPage';
import { 
  communitiesData, 
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

interface CommunityPageProps {
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

export const CommunityPage: React.FC<CommunityPageProps> = ({
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
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [showEditCommunity, setShowEditCommunity] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'communityId', label: 'ID', sortable: true, width: '10%' },
    { key: 'communityName', label: 'Community', sortable: true, width: '15%' },
    { key: 'numberOfZones', label: 'Zones', sortable: true, width: '7%' },
    { key: 'status', label: 'Status', sortable: true, width: '8%' },
    { key: 'createdDate', label: 'Created', sortable: true, width: '12%' },
    { key: 'createdBy', label: 'Created By', sortable: true, width: '12%' },
    { key: 'modifiedDate', label: 'Modified', sortable: true, width: '12%' },
    { key: 'modifiedBy', label: 'Modified By', sortable: true, width: '12%' },
    { key: 'actions', label: '', sortable: false, width: '4%' }
  ];

  // Navigation handlers
  const handleAddCommunity = () => {
    setShowAddCommunity(true);
  };

  const handleBackFromAdd = () => {
    setShowAddCommunity(false);
  };

  const handleSaveCommunity = (communityData: any) => {
    console.log('Saving community:', communityData);
    setShowAddCommunity(false);
  };

  const handleEditCommunity = (community: any) => {
    setSelectedCommunity(community);
    setShowEditCommunity(true);
  };

  const handleBackFromEdit = () => {
    setShowEditCommunity(false);
    setSelectedCommunity(null);
  };

  const handleSaveEdit = (communityData: any) => {
    console.log('Saving edited community:', communityData);
    setShowEditCommunity(false);
    setSelectedCommunity(null);
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
          printData(exportData, exportHeaders, 'Communities Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, exportHeaders, 'communities');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'communities');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'communities');
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
    let filtered = communitiesData.filter(community =>
      community.communityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.communityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.modifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, sortConfig]);

  // Pagination
  const totalEntries = filteredAndSortedData.length;
  const entriesPerPageNum = parseInt(entriesPerPage);
  const totalPages = Math.ceil(totalEntries / entriesPerPageNum);
  const startIndex = (currentPage - 1) * entriesPerPageNum;
  const endIndex = Math.min(startIndex + entriesPerPageNum, totalEntries);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Show Add Community page if state is true
  if (showAddCommunity) {
    return (
      <AddCommunityPage 
        onSave={handleSaveCommunity}
      />
    );
  }

  // Show Edit Community page if state is true
  if (showEditCommunity && selectedCommunity) {
    return (
      <EditCommunityPage 
        communityId={selectedCommunity.communityId}
        onBack={handleBackFromEdit}
        onSave={handleSaveEdit}
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
          onClick={handleAddCommunity}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Community
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 text-white">
          <div className="text-lg font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Communities</div>
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
              placeholder="Search communities..."
            />
          </div>
        </div>
      </div>

      {/* Data Table - Desktop & Tablet View */}
      <div className="hidden md:block bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border-0 overflow-hidden backdrop-blur-sm p-1">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full table-fixed border-collapse min-w-[700px]">
              <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-t-xl">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-2 py-3 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-600 transition-all duration-300 hover:shadow-lg' : ''
                    } ${column.key === 'communityId' ? 'rounded-tl-xl' : ''} ${column.key === 'actions' ? 'rounded-tr-xl' : ''}`}
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
                {currentData.map((community, index) => (
                  <tr key={community.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px font-semibold">
                        {community.communityId}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="break-words leading-tight group-hover:text-slate-900 text-blue-600 hover:text-blue-800 text-10px">
                        {community.communityName}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-10px font-bold text-blue-800 bg-blue-100 rounded-full">
                        {community.numberOfZones || 0}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-10px border-r border-gray-100 text-center">
                      <span className={`px-2 py-1 text-10px font-semibold rounded-full ${
                        community.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {community.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px">
                        {community.createdDate}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <span className="text-10px">
                        {community.createdBy}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <div className="text-10px">
                        {community.modifiedDate}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-10px text-slate-800 border-r border-gray-100">
                      <span className="text-10px">
                        {community.modifiedBy}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-center">
                      <button 
                        onClick={() => handleEditCommunity(community)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title="Edit Community"
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
          {currentData.map((community) => (
            <div key={community.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-gray-500">ID:</span>
                  <span className="text-sm font-semibold ml-1">{community.communityId}</span>
                </div>
                <button 
                  onClick={() => handleEditCommunity(community)}
                  className="bg-blue-500 p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit Community"
                >
                  <Edit className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="text-sm text-blue-600 font-semibold mb-1">{community.communityName}</div>
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">
                  {community.numberOfZones || 0} Zones
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1">{community.createdDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">By:</span>
                  <span className="ml-1">{community.createdBy}</span>
                </div>
                <div>
                  <span className="text-gray-500">Modified:</span>
                  <span className="ml-1">{community.modifiedDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">By:</span>
                  <span className="ml-1">{community.modifiedBy}</span>
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