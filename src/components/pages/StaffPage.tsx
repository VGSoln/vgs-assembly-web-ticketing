import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, User, Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown, Plus, Eye } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers } from '@/lib/api';
import {
  copyToClipboard,
  printData,
  exportToExcel,
  exportToCSV,
  exportToPDF
} from '@/lib/exportUtils';

interface StaffPageProps {
  onStaffSelect?: (staffId: string) => void;
  onAddStaff?: () => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

type User = {
  id: string;
  'first-name': string;
  'last-name': string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  'zone-id'?: string;
  'is-active': boolean;
  'created-at': string;
  'updated-at'?: string;
};

export const StaffPage: React.FC<StaffPageProps> = ({ onStaffSelect, onAddStaff }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  // Fetch users from API
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getUsers({
        'assembly-id': currentUser['assembly-id']
      })
        .then((data) => {
          setUsers(data);
          setError(null);
        })
        .catch((err) => {
          console.error('Failed to fetch users:', err);
          setError('Failed to load staff. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUser]);

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true, width: '18%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '15%' },
    { key: 'email', label: 'Email', sortable: true, width: '18%' },
    { key: 'role', label: 'Role', sortable: true, width: '15%' },
    { key: 'created-at', label: 'Created', sortable: true, width: '15%' },
    { key: 'updated-at', label: 'Modified', sortable: true, width: '15%' },
    { key: 'is-active', label: 'Status', sortable: false, width: '10%' }
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

  // Staff-specific export headers
  const staffExportHeaders = ['ID', 'Name', 'Phone', 'Email', 'Role', 'Created', 'Modified', 'Status'];

  // Transform API data to export format
  const transformForExport = (users: User[]) => {
    return users.map(user => ({
      'ID': user.id,
      'Name': user.name,
      'Phone': user.phone,
      'Email': user.email || '',
      'Role': user.role,
      'Created': formatDate(user['created-at']),
      'Modified': formatDate(user['updated-at']),
      'Status': user['is-active'] ? 'Active' : 'Inactive'
    }));
  };

  // Export functions
  const handleExport = async (type: string) => {
    // Transform data directly - don't use formatDataForExport (it's for visits data)
    const exportData = transformForExport(filteredAndSortedData);
    setExportStatus(`Exporting ${type}...`);

    try {
      switch (type) {
        case 'copy':
          const success = await copyToClipboard(exportData, staffExportHeaders);
          setExportStatus(success ? 'Copied to clipboard!' : 'Failed to copy');
          break;
        case 'print':
          printData(exportData, staffExportHeaders, 'Staff Members Report');
          setExportStatus('Print dialog opened');
          break;
        case 'excel':
          await exportToExcel(exportData, staffExportHeaders, 'staff-members');
          setExportStatus('Excel file downloaded');
          break;
        case 'csv':
          exportToCSV(exportData, staffExportHeaders, 'staff-members');
          setExportStatus('CSV file downloaded');
          break;
        case 'pdf':
          await exportToPDF(exportData, staffExportHeaders, 'staff-members');
          setExportStatus('PDF export initiated');
          break;
      }
    } catch (error) {
      setExportStatus('Export failed');
    }

    setTimeout(() => setExportStatus(''), 3000);
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = users.filter(user =>
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

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
  }, [users, searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));

  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading staff members...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error Loading Staff</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Table - Desktop & Tablet View */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border-0 overflow-hidden backdrop-blur-sm p-1">
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
                  <th className="px-3 py-4 text-left text-xs font-bold text-white">
                    <span className="leading-tight font-bold text-white drop-shadow-sm">Actions</span>
                  </th>
                </tr>
              </thead>
            <tbody className="bg-white">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                currentData.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                    <td className="px-3 py-3 text-sm text-slate-800 border-r border-gray-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <button
                          onClick={() => onStaffSelect?.(user.id)}
                          className="break-words leading-tight group-hover:text-slate-900 font-medium overflow-hidden text-ellipsis min-w-0 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer text-left w-full"
                          title={user.name}
                        >
                          {user.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 border-r border-gray-100">
                      <div className="break-all leading-tight font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 border-r border-gray-100">
                      <div className="break-all leading-tight text-blue-600 hover:text-blue-800">
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-800 border-r border-gray-100">
                      <div className="break-words leading-tight font-medium text-slate-800">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-800 border-r border-gray-100 text-center">
                      <div className="leading-tight text-xs">
                        {formatDate(user['created-at'])}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-800 border-r border-gray-100 text-center">
                      <div className="leading-tight text-xs">
                        {formatDate(user['updated-at'])}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          !user['is-active']
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user['is-active'] ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => onStaffSelect?.(user.id)}
                          className={`p-2 rounded-full shadow-sm group-hover:shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                            !user['is-active']
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{totalEntries > 0 ? startEntry : 0}</span> to{' '}
            <span className="font-medium">{endEntry}</span> of{' '}
            <span className="font-medium">{totalEntries}</span> entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm border rounded transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
