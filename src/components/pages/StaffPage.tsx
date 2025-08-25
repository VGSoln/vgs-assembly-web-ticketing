import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronUp, User, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Plus, Eye } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { 
  staffData
} from '@/lib/data';
import { 
  copyToClipboard, 
  printData, 
  exportToExcel, 
  exportToCSV, 
  exportToPDF, 
  formatDataForExport, 
  exportHeaders 
} from '@/lib/exportUtils';

interface StaffPageProps {
  onStaffSelect?: (staffId: string) => void;
  onAddStaff?: () => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const StaffPage: React.FC<StaffPageProps> = ({ onStaffSelect, onAddStaff }) => {
  const [entriesPerPage, setEntriesPerPage] = useState('10');
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
    { key: 'name', label: 'Name', sortable: true, width: '15%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '12%' },
    { key: 'email', label: 'Email', sortable: true, width: '16%' },
    { key: 'assignedZones', label: 'Zones', sortable: true, width: '7%' },
    { key: 'role', label: 'Role', sortable: true, width: '15%' },
    { key: 'position', label: 'Position', sortable: true, width: '15%' },
    { key: 'created', label: 'Created', sortable: true, width: '10%' },
    { key: 'modified', label: 'Modified', sortable: true, width: '10%' },
    { key: 'status', label: 'Status', sortable: false, width: '10%' }
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
          printData(exportData, exportHeaders, 'Staff Members Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, exportHeaders, 'staff-members');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, exportHeaders, 'staff-members');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, exportHeaders, 'staff-members');
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
    let filtered = staffData.filter(staff =>
      staff.id.toString().includes(searchTerm) ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.includes(searchTerm) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.assignedZones.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.created.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.modified.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.status.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Top Controls Row */}
      <div className="flex justify-end items-center mb-4">
        <button 
          onClick={onAddStaff}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Show</span>
            <ModernSelect
              placeholder="10"
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
            placeholder="Search staff..."
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
            <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-3 py-4 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-600 transition-all duration-300 hover:shadow-lg' : ''
                    }`}
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
              {currentData.map((staff, index) => (
                <tr key={staff.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <button 
                        onClick={() => onStaffSelect?.(staff.id.toString())}
                        className="break-words leading-tight group-hover:text-slate-900 font-medium overflow-hidden text-ellipsis min-w-0 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer text-left w-full" 
                        title={staff.name}
                      >
                        {staff.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight font-mono text-11px bg-slate-100 px-2 py-1 rounded">
                      {staff.phone}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight text-blue-600 hover:text-blue-800">
                      {staff.email}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                    <span className="text-11px font-semibold text-slate-800">
                      {staff.assignedZones}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100">
                    <div className="break-words leading-tight text-11px font-medium text-slate-800">
                      {staff.role}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-700 border-r border-gray-100">
                    <div className="break-words leading-tight">
                      {staff.position}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                    <div className="leading-tight">
                      <div className="break-words font-semibold text-11px">{staff.created.split(',')[0]}</div>
                      <div className="text-10px text-slate-500 break-words mt-0.5 font-semibold">{staff.created.split(',')[1]}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-slate-800 border-r border-gray-100 text-center">
                    <div className="leading-tight">
                      <div className="break-words">
                        <span className="font-semibold">{staff.modified.split(' ').slice(0, 3).join(' ')}</span>
                        {staff.modified.split(' ').length > 3 && (
                          <span className="text-11px text-slate-500 ml-1">{staff.modified.split(' ').slice(3).join(' ')}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-11px text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'Inactive' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {staff.status}
                      </span>
                      <button 
                        onClick={() => onStaffSelect?.(staff.id.toString())}
                        className={`p-2 rounded-full shadow-sm group-hover:shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                          staff.status === 'Inactive'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                            : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                        }`}
                        title="View Staff Details"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          
          {/* Desktop Table Footer */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 px-6 py-4">
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

      {/* Card View - Mobile/Tablet */}
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
        
        {currentData.map((staff, index) => (
          <div key={staff.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <button 
                    onClick={() => onStaffSelect?.(staff.id.toString())}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer text-left"
                  >
                    {staff.name}
                  </button>
                  <p className="text-blue-600 font-medium text-sm">{staff.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                staff.status === 'Inactive' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {staff.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                  <p className="text-sm text-gray-700 font-mono">{staff.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                  <p className="text-sm text-gray-900">{staff.role}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</label>
                  <p className="text-sm text-gray-700">{staff.position}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Zones</label>
                  <p className="text-sm font-semibold text-gray-900">{staff.assignedZones}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</label>
                  <p className="text-sm text-gray-700">{staff.created}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modified</label>
                  <p className="text-sm text-gray-700">{staff.modified}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-center">
                <button 
                  onClick={() => onStaffSelect?.(staff.id.toString())}
                  className={`p-2 rounded-full shadow-sm group-hover:shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    staff.status === 'Inactive'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                  }`}
                  title="View Staff Details"
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
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
    </div>
  );
};