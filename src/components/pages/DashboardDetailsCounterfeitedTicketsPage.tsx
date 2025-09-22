'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, ShieldAlert, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface CounterfeitTicket {
  id: number;
  scanId: string;
  scanDate: string;
  scanStatus: string;
  scanBy: string;
  scannedTicketInfo: string;
  ticketType: string;
  location: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

interface DashboardDetailsCounterfeitedTicketsPageProps {
  onNavigate?: (page: string) => void;
}

export const DashboardDetailsCounterfeitedTicketsPage: React.FC<DashboardDetailsCounterfeitedTicketsPageProps> = ({ onNavigate }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  // Counterfeited tickets data
  const ticketsData: CounterfeitTicket[] = [
    {
      id: 1,
      scanId: 'SC-2025-C001',
      scanDate: '18 Jan 2025 09:30 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'John Mensah',
      scannedTicketInfo: 'TK-FAKE-001 / Invalid QR Code',
      ticketType: 'Market',
      location: 'Central Market'
    },
    {
      id: 2,
      scanId: 'SC-2025-C002',
      scanDate: '18 Jan 2025 10:15 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Mary Asante',
      scannedTicketInfo: 'TK-DUP-234 / Duplicate Serial',
      ticketType: 'Lorry Park',
      location: 'Main Station'
    },
    {
      id: 3,
      scanId: 'SC-2025-C003',
      scanDate: '18 Jan 2025 11:45 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Samuel Osei',
      scannedTicketInfo: 'TK-INVALID-567 / Tampered Barcode',
      ticketType: 'Market',
      location: 'Nima Market'
    },
    {
      id: 4,
      scanId: 'SC-2025-C004',
      scanDate: '18 Jan 2025 02:20 PM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Patricia Bonsu',
      scannedTicketInfo: 'TK-COPY-890 / Photocopied Ticket',
      ticketType: 'Lorry Park',
      location: 'East Station'
    },
    {
      id: 5,
      scanId: 'SC-2025-C005',
      scanDate: '19 Jan 2025 08:30 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Emmanuel Boateng',
      scannedTicketInfo: 'TK-ALTERED-123 / Modified Date',
      ticketType: 'Market',
      location: 'Tema Market'
    },
    {
      id: 6,
      scanId: 'SC-2025-C006',
      scanDate: '19 Jan 2025 09:45 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Grace Mensah',
      scannedTicketInfo: 'TK-FAKE-456 / Invalid Watermark',
      ticketType: 'Lorry Park',
      location: 'Spintex Station'
    },
    {
      id: 7,
      scanId: 'SC-2025-C007',
      scanDate: '19 Jan 2025 10:30 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'John Mensah',
      scannedTicketInfo: 'TK-DUP-789 / Already Used',
      ticketType: 'Market',
      location: 'Kotobabi Market'
    },
    {
      id: 8,
      scanId: 'SC-2025-C008',
      scanDate: '19 Jan 2025 11:15 AM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Mary Asante',
      scannedTicketInfo: 'TK-INVALID-012 / Wrong Format',
      ticketType: 'Market',
      location: 'Dansoman Market'
    },
    {
      id: 9,
      scanId: 'SC-2025-C009',
      scanDate: '19 Jan 2025 02:00 PM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Samuel Osei',
      scannedTicketInfo: 'TK-FAKE-345 / Homemade Replica',
      ticketType: 'Lorry Park',
      location: 'Airport Station'
    },
    {
      id: 10,
      scanId: 'SC-2025-C010',
      scanDate: '19 Jan 2025 03:30 PM',
      scanStatus: 'Counterfeit Ticket',
      scanBy: 'Patricia Bonsu',
      scannedTicketInfo: 'TK-EXPIRED-678 / Reused Expired',
      ticketType: 'Market',
      location: 'Kaneshie Market'
    }
  ];

  const entriesOptions = [
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '200', label: '200' },
    { value: '500', label: '500' },
  ];

  const columns = [
    { key: 'scanId', label: 'Scan ID', sortable: true, width: '10%' },
    { key: 'scanDate', label: 'Scan Date', sortable: true, width: '15%' },
    { key: 'scanStatus', label: 'Scanned Ticket Status', sortable: true, width: '15%' },
    { key: 'scanBy', label: 'Scan By', sortable: true, width: '12%' },
    { key: 'scannedTicketInfo', label: 'Scanned Ticket Information', sortable: true, width: '20%' },
    { key: 'ticketType', label: 'Ticket Type', sortable: true, width: '13%' },
    { key: 'location', label: 'Location', sortable: true, width: '15%' }
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
    setExportStatus(`Exporting ${type}...`);
    
    setTimeout(() => {
      setExportStatus(`${type} completed!`);
      setTimeout(() => setExportStatus(''), 3000);
    }, 1000);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = ticketsData.filter(ticket => {
      const matchesSearch = 
        ticket.id.toString().includes(searchTerm) ||
        ticket.scanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.scanDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.scanStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.scanBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.scannedTicketInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof CounterfeitTicket];
        const bVal = b[sortConfig.key as keyof CounterfeitTicket];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig, ticketsData]);

  const totalEntries = filteredAndSortedData.length;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  return (
    <div className="space-y-4 w-full px-0">
      {/* Back Button */}
      <div className="flex justify-start">
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('debt');
            } else {
              window.history.back();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Summary Row - Only blue box, no red box */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-orange-100">Total Counterfeit Tickets</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Show entries */}
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
            {exportStatus && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-800 ml-4">
                <Check className="w-4 h-4" />
                <span className="text-sm">{exportStatus}</span>
              </div>
            )}
          </div>

          {/* Center - Export buttons */}
          <div className="flex items-center gap-2">
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

          {/* Right side - Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search counterfeit tickets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
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
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse min-w-[800px]">
            <thead className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-2 py-3 text-left text-xs font-bold text-white border-r border-slate-600 last:border-r-0 relative ${
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
                                <ArrowUp className="w-4 h-4 text-blue-300" />
                              ) : (
                                <ArrowDown className="w-4 h-4 text-blue-300" />
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
              {currentData.map((ticket, index) => (
                <tr key={ticket.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  {/* Scan ID */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-mono text-orange-600 font-semibold">
                      {ticket.scanId}
                    </div>
                  </td>
                  {/* Scan Date */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-800">
                      {ticket.scanDate}
                    </div>
                  </td>
                  {/* Scanned Ticket Status */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {ticket.scanStatus}
                    </span>
                  </td>
                  {/* Scan By */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-700">
                      {ticket.scanBy}
                    </div>
                  </td>
                  {/* Scanned Ticket Information */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-700">
                      <div className="font-semibold text-red-600">{ticket.scannedTicketInfo.split(' / ')[0]}</div>
                      <div className="text-xs text-gray-500">{ticket.scannedTicketInfo.split(' / ')[1]}</div>
                    </div>
                  </td>
                  {/* Ticket Type */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-medium text-slate-800">
                      {ticket.ticketType}
                    </div>
                  </td>
                  {/* Location */}
                  <td className="px-2 py-2 text-xs">
                    <div className="text-slate-700">
                      {ticket.location}
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

      {/* Card View - Mobile Only */}
      <div className="md:hidden space-y-4">
        {/* Mobile Sorting Controls */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {columns.filter(col => col.sortable).slice(0, 6).map((column) => (
              <button
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortConfig?.key === column.key
                    ? 'bg-orange-600 text-white border-orange-600'
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
        
        {currentData.map((ticket, index) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-600">{ticket.scanId}</h3>
                <p className="text-sm text-gray-600">{ticket.scanDate}</p>
              </div>
              <div>
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                  {ticket.scanStatus}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scan By</label>
                  <p className="text-sm text-gray-700">{ticket.scanBy}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scanned Ticket Information</label>
                  <p className="text-sm">
                    <span className="font-semibold text-red-600">{ticket.scannedTicketInfo.split(' / ')[0]}</span>
                    <br />
                    <span className="text-xs text-gray-500">{ticket.scannedTicketInfo.split(' / ')[1]}</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</label>
                  <p className="text-sm font-medium text-gray-900">{ticket.ticketType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="text-sm text-gray-700">{ticket.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="text-sm text-gray-600 text-center">
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};