'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Plus, ArrowLeft } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { AddCustomerPage } from './AddCustomerPage';
import { CustomerDetailsPage } from './CustomerDetailsPage';
import { CustomerLocationModal } from '../ui/CustomerLocationModal';
import { 
  businessLevelOptions, 
  zoneOptions
} from '@/lib/data';

interface Customer {
  id: number;
  scanId: string;
  scanDate: string;
  scanStatus: 'Expired' | 'Active';
  daysExpired: number;
  scanBy: string;
  ticketType: string;
  location: string;
  customerPhone: string;
  customerType: string;
  identifier: string;
  ticketId: string;
  ticketDate: string;
  ticketAmount: number;
  revenueOfficer: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

interface DashboardDetailsInactiveCustomersPageProps {
  initialCustomerId?: string;
  initialShowDetails?: boolean;
  onNavigate?: (page: string) => void;
}

export const DashboardDetailsInactiveCustomersPage: React.FC<DashboardDetailsInactiveCustomersPageProps> = ({ initialCustomerId, initialShowDetails, onNavigate }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(initialShowDetails || false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCustomerLocation, setSelectedCustomerLocation] = useState<any>(null);
  
  // Update document title and body attribute based on view
  useEffect(() => {
    if (showCustomerDetails) {
      document.title = 'AEDA Admin - Customer Detail Information';
      document.body.setAttribute('data-customer-view', 'details');
    } else {
      document.title = 'AEDA Admin - Customer List';
      document.body.setAttribute('data-customer-view', 'list');
    }
    
    // Cleanup
    return () => {
      document.body.removeAttribute('data-customer-view');
    };
  }, [showCustomerDetails]);
  
  // Navigation handler for customer details
  const handleViewCustomerDetails = React.useCallback((scanId: string) => {
    setSelectedCustomerId(scanId);
    setShowCustomerDetails(true);
  }, []);

  // Add customer handlers
  const handleAddCustomer = () => {
    setShowAddCustomer(true);
  };

  const handleBackFromAdd = () => {
    setShowAddCustomer(false);
  };

  const handleBackFromDetails = () => {
    setShowCustomerDetails(false);
    setSelectedCustomerId('');
  };

  const handleEditCustomer = (customerId: string) => {
    // Handle edit customer - this would navigate to edit page
    console.log('Edit customer:', customerId);
  };

  const handleSaveCustomer = (customerData: any) => {
    // Here you would typically send the data to your API
    console.log('Saving customer:', customerData);
    // After successful save, go back to the main customers page
    setShowAddCustomer(false);
  };

  const handleViewTicketDetails = (customer: Customer) => {
    // View ticket details functionality
    console.log('View ticket details:', customer.ticketId);
  };


  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsSincePayment, setSelectedMonthsSincePayment] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  // Scanned tickets data
  const customersData: Customer[] = [
    {
      id: 1,
      scanId: 'SC-2025-001',
      scanDate: '15 Jan 2025 09:30 AM',
      scanStatus: 'Expired',
      daysExpired: 5,
      scanBy: 'John Mensah',
      ticketType: 'Market',
      location: 'Central Market',
      customerPhone: '0249876543',
      customerType: 'Trader',
      identifier: 'MKT-A-101',
      ticketId: 'TK-2024-8892',
      ticketDate: '10 Jan 2025',
      ticketAmount: 50.00,
      revenueOfficer: 'Samuel Osei'
    },
    {
      id: 2,
      scanId: 'SC-2025-002',
      scanDate: '15 Jan 2025 10:15 AM',
      scanStatus: 'Active',
      daysExpired: 0,
      scanBy: 'Mary Asante',
      ticketType: 'Lorry Park',
      location: 'Main Lorry Park',
      customerPhone: '0551234567',
      customerType: 'Driver',
      identifier: 'LP-B-045',
      ticketId: 'TK-2025-0145',
      ticketDate: '15 Jan 2025',
      ticketAmount: 20.00,
      revenueOfficer: 'Patricia Bonsu'
    },
    {
      id: 3,
      scanId: 'SC-2025-003',
      scanDate: '15 Jan 2025 11:45 AM',
      scanStatus: 'Expired',
      daysExpired: 2,
      scanBy: 'John Mensah',
      ticketType: 'Market',
      location: 'Nima Market',
      customerPhone: '0244567890',
      customerType: 'Vendor',
      identifier: 'NM-C-234',
      ticketId: 'TK-2025-0456',
      ticketDate: '13 Jan 2025',
      ticketAmount: 30.00,
      revenueOfficer: 'Fatima Rahman'
    },
    {
      id: 4,
      scanId: 'SC-2025-004',
      scanDate: '15 Jan 2025 02:20 PM',
      scanStatus: 'Expired',
      daysExpired: 10,
      scanBy: 'Mary Asante',
      ticketType: 'Lorry Park',
      location: 'East Station',
      customerPhone: '0509876543',
      customerType: 'Driver',
      identifier: 'ES-D-321',
      ticketId: 'TK-2025-0321',
      ticketDate: '05 Jan 2025',
      ticketAmount: 25.00,
      revenueOfficer: 'Emmanuel Boateng'
    },
    {
      id: 5,
      scanId: 'SC-2025-005',
      scanDate: '15 Jan 2025 03:45 PM',
      scanStatus: 'Active',
      daysExpired: 0,
      scanBy: 'John Mensah',
      ticketType: 'Market',
      location: 'Tema Market',
      customerPhone: '0277654321',
      customerType: 'Trader',
      identifier: 'TM-E-789',
      ticketId: 'TK-2025-0789',
      ticketDate: '15 Jan 2025',
      ticketAmount: 45.00,
      revenueOfficer: 'Grace Mensah'
    },
    {
      id: 6,
      scanId: 'SC-2025-006',
      scanDate: '16 Jan 2025 08:30 AM',
      scanStatus: 'Expired',
      daysExpired: 7,
      scanBy: 'Mary Asante',
      ticketType: 'Lorry Park',
      location: 'Spintex Station',
      customerPhone: '0201234567',
      customerType: 'Driver',
      identifier: 'SP-F-234',
      ticketId: 'TK-2025-1234',
      ticketDate: '09 Jan 2025',
      ticketAmount: 35.00,
      revenueOfficer: 'Samuel Opoku'
    },
    {
      id: 7,
      scanId: 'SC-2025-007',
      scanDate: '16 Jan 2025 10:00 AM',
      scanStatus: 'Active',
      daysExpired: 0,
      scanBy: 'John Mensah',
      ticketType: 'Market',
      location: 'Kotobabi Market',
      customerPhone: '0551987654',
      customerType: 'Vendor',
      identifier: 'KB-G-987',
      ticketId: 'TK-2025-0987',
      ticketDate: '16 Jan 2025',
      ticketAmount: 40.00,
      revenueOfficer: 'Mary Frimpong'
    },
    {
      id: 8,
      scanId: 'SC-2025-008',
      scanDate: '16 Jan 2025 02:45 PM',
      scanStatus: 'Expired',
      daysExpired: 3,
      scanBy: 'Mary Asante',
      ticketType: 'Market',
      location: 'Dansoman Market',
      customerPhone: '0266543210',
      customerType: 'Trader',
      identifier: 'DM-H-654',
      ticketId: 'TK-2025-0654',
      ticketDate: '13 Jan 2025',
      ticketAmount: 55.00,
      revenueOfficer: 'Joseph Asante'
    },
    {
      id: 9,
      scanId: 'SC-2025-009',
      scanDate: '17 Jan 2025 09:20 AM',
      scanStatus: 'Expired',
      daysExpired: 15,
      scanBy: 'John Mensah',
      ticketType: 'Lorry Park',
      location: 'Airport Station',
      customerPhone: '0245678901',
      customerType: 'Driver',
      identifier: 'AP-I-112',
      ticketId: 'TK-2025-0112',
      ticketDate: '02 Jan 2025',
      ticketAmount: 30.00,
      revenueOfficer: 'Rebecca Ansah'
    },
    {
      id: 10,
      scanId: 'SC-2025-010',
      scanDate: '17 Jan 2025 11:10 AM',
      scanStatus: 'Active',
      daysExpired: 0,
      scanBy: 'Mary Asante',
      ticketType: 'Market',
      location: 'Kaneshie Market',
      customerPhone: '0203456789',
      customerType: 'Vendor',
      identifier: 'KM-J-888',
      ticketId: 'TK-2025-0888',
      ticketDate: '17 Jan 2025',
      ticketAmount: 60.00,
      revenueOfficer: 'Akwasi Tutu'
    }
  ];

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  const monthsSincePaymentOptions = [
    { value: '0', label: 'Current' },
    { value: '1', label: '1 Month' },
    { value: '2', label: '2 Months' },
    { value: '3', label: '3 Months' },
    { value: '4+', label: '4+ Months' }
  ];

  const columns = [
    { key: 'scanId', label: 'Scan ID', sortable: true, width: '7%' },
    { key: 'scanDate', label: 'Scan Date', sortable: true, width: '8%' },
    { key: 'scanStatus', label: 'Scanned Ticket Status', sortable: true, width: '10%' },
    { key: 'daysExpired', label: '# of Days Expired', sortable: true, width: '8%' },
    { key: 'scanBy', label: 'Scan By', sortable: true, width: '7%' },
    { key: 'ticketType', label: 'Ticket Type', sortable: true, width: '7%' },
    { key: 'location', label: 'Location', sortable: true, width: '7%' },
    { key: 'customerPhone', label: 'Customer Phone', sortable: true, width: '8%' },
    { key: 'customerType', label: 'Customer Type', sortable: true, width: '8%' },
    { key: 'identifier', label: 'Identifier', sortable: true, width: '7%' },
    { key: 'ticketId', label: 'Ticket ID', sortable: true, width: '7%' },
    { key: 'ticketDate', label: 'Ticket Date', sortable: true, width: '8%' },
    { key: 'ticketAmount', label: 'Ticket Amount', sortable: true, width: '8%' },
    { key: 'revenueOfficer', label: 'Revenue Officer', sortable: true, width: '8%' }
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
    let filtered = customersData.filter(customer => {
      const matchesSearch = 
        customer.id.toString().includes(searchTerm) ||
        customer.scanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.scanDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.scanStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.scanBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ticketType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerPhone.includes(searchTerm) ||
        customer.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ticketDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ticketAmount.toString().includes(searchTerm) ||
        customer.revenueOfficer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesZone = !selectedZone || true; // Remove zone filter for now
      
      return matchesSearch && matchesZone;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof Customer];
        const bVal = b[sortConfig.key as keyof Customer];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, selectedZone, sortConfig, customersData]);

  const totalEntries = filteredAndSortedData.length;
  const totalOwed = filteredAndSortedData.reduce((sum, customer) => sum + customer.ticketAmount, 0);
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  const formatCurrency = (amount: number) => {
    const prefix = amount < 0 ? 'GHS -' : 'GHS ';
    return prefix + Math.abs(amount).toFixed(2);
  };

  const getAmountColor = (amount: number) => {
    return 'text-green-600';
  };

  // Show AddCustomerPage if showAddCustomer is true
  if (showAddCustomer) {
    return (
      <AddCustomerPage 
        onBack={handleBackFromAdd}
        onSave={handleSaveCustomer}
      />
    );
  }

  // Show CustomerDetailsPage if showCustomerDetails is true
  if (showCustomerDetails === true) {
    return (
      <CustomerDetailsPage
        customerId={selectedCustomerId}
        onBack={handleBackFromDetails}
        onEdit={handleEditCustomer}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={() => onNavigate && onNavigate('debt')}
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
          <div className="text-xs text-blue-100">Scanned Tickets</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GHS {totalOwed.toLocaleString()}</div>
          <div className="text-xs text-red-100">Total Ticket Amount</div>
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
              placeholder="Search tickets, scans"
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
                  {/* Scan ID */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-mono text-blue-600 font-semibold">
                      {customer.scanId}
                    </div>
                  </td>
                  {/* Scan Date */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-800">
                      {customer.scanDate}
                    </div>
                  </td>
                  {/* Scanned Ticket Status */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      customer.scanStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.scanStatus}
                    </span>
                  </td>
                  {/* # of Days Expired */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className={`font-semibold ${
                      customer.daysExpired === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {customer.daysExpired}
                    </span>
                  </td>
                  {/* Scan By */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-700">
                      {customer.scanBy}
                    </div>
                  </td>
                  {/* Ticket Type */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-medium text-slate-800">
                      {customer.ticketType}
                    </div>
                  </td>
                  {/* Location */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-700">
                      {customer.location}
                    </div>
                  </td>
                  {/* Customer Phone */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-mono text-10px bg-slate-100 px-1 py-0.5 rounded text-center">
                      {customer.customerPhone}
                    </div>
                  </td>
                  {/* Customer Type */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-800">
                      {customer.customerType}
                    </div>
                  </td>
                  {/* Identifier */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-mono text-10px bg-blue-50 px-1 py-0.5 rounded text-center">
                      {customer.identifier}
                    </div>
                  </td>
                  {/* Ticket ID */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="font-mono text-blue-600">
                      {customer.ticketId}
                    </div>
                  </td>
                  {/* Ticket Date */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-slate-700">
                      {customer.ticketDate}
                    </div>
                  </td>
                  {/* Ticket Amount */}
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <div className="font-bold text-green-600">
                      {formatCurrency(customer.ticketAmount)}
                    </div>
                  </td>
                  {/* Revenue Officer */}
                  <td className="px-2 py-2 text-xs">
                    <div className="text-slate-700">
                      {customer.revenueOfficer}
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
                <h3 className="text-lg font-semibold text-gray-900">{customer.scanId}</h3>
                <p className="text-sm text-gray-600">{customer.scanDate}</p>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  customer.scanStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {customer.scanStatus}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Expired</label>
                  <p className={`text-sm font-bold ${
                    customer.daysExpired === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>{customer.daysExpired} days</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scan By</label>
                  <p className="text-sm text-gray-700">{customer.scanBy}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer.ticketType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="text-sm text-gray-700">{customer.location}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Phone</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.customerPhone}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer.customerType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identifier</label>
                  <p className="text-sm font-mono bg-blue-50 px-2 py-1 rounded">{customer.identifier}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</label>
                  <p className="text-sm font-mono text-blue-600">{customer.ticketId}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Date</label>
                  <p className="text-sm text-gray-700">{customer.ticketDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Amount</label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(customer.ticketAmount)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue Officer</label>
                  <p className="text-sm text-gray-700">{customer.revenueOfficer}</p>
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
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};