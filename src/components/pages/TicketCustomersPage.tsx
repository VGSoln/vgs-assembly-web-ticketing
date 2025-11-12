'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, Eye, MapPin, ArrowUpDown, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { AddCustomerPage } from './AddCustomerPage';
import { TicketCustomerDetailsPage } from './TicketCustomerDetailsPage';
import { CustomerLocationModal } from '../ui/CustomerLocationModal';
import {
  businessLevelOptions,
  zoneOptions
} from '@/lib/data';
import { getCustomers } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Customer {
  'customer-id': string;
  'customer-number': string;
  phone: string;
  'alt-phone'?: string;
  'ticket-type-name': string;
  'location-name': string;
  'customer-type-name': string;
  identifier?: string;
  'zone-name'?: string;
  'transaction-count': number;
  'last-payment-date'?: string;
  'created-at': string;
  'is-active': boolean;
  'gps-latitude'?: number;
  'gps-longitude'?: number;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

interface CustomersPageProps {
  initialCustomerId?: string;
  initialShowDetails?: boolean;
}

export const TicketCustomersPage: React.FC<CustomersPageProps> = ({ initialCustomerId, initialShowDetails }) => {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(initialShowDetails || false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCustomerLocation, setSelectedCustomerLocation] = useState<any>(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!currentUser?.['assembly-id']) {
        setError('No assembly ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCustomers({
          'assembly-id': currentUser['assembly-id'],
          'active-only': true
        });
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentUser]);

  // Update document title and body attribute based on view
  useEffect(() => {
    if (showCustomerDetails) {
      document.title = 'AEDA Admin - Ticket Customer Detail Information';
      document.body.setAttribute('data-customer-view', 'details');
    } else {
      document.title = 'AEDA Admin - Ticket Customer List';
      document.body.setAttribute('data-customer-view', 'list');
    }

    // Cleanup
    return () => {
      document.body.removeAttribute('data-customer-view');
    };
  }, [showCustomerDetails]);
  
  // Navigation handler for customer details
  const handleViewCustomerDetails = React.useCallback((customerNumber: string, customerName: string) => {
    setSelectedCustomerId(customerNumber);
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

  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsSincePayment, setSelectedMonthsSincePayment] = useState('');
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

  const monthsSincePaymentOptions = [
    { value: '0', label: 'Current' },
    { value: '1', label: '1 Month' },
    { value: '2', label: '2 Months' },
    { value: '3', label: '3 Months' },
    { value: '4+', label: '4+ Months' }
  ];

  const columns = [
    { key: 'customer-number', label: 'Customer #', sortable: true, width: '7%' },
    { key: 'phone', label: 'Phone #', sortable: true, width: '7%' },
    { key: 'ticket-type-name', label: 'Ticket Type', sortable: true, width: '7%' },
    { key: 'location-name', label: 'Location', sortable: true, width: '8%' },
    { key: 'customer-type-name', label: 'Customer Type', sortable: true, width: '8%' },
    { key: 'identifier', label: 'Identifier', sortable: true, width: '8%' },
    { key: 'zone-name', label: 'Zone', sortable: true, width: '6%' },
    { key: 'transaction-count', label: '# of Ticket Payments', sortable: true, width: '8%' },
    { key: 'last-payment-date', label: 'Last Ticket Payment', sortable: true, width: '9%' },
    { key: 'created-at', label: 'Created Date', sortable: true, width: '9%' },
    { key: 'is-active', label: 'Status', sortable: true, width: '6%' },
    { key: 'actions', label: 'Details', sortable: false, width: '6%' }
  ];

  // Export headers for customers
  const exportHeaders = [
    'Customer Number',
    'Phone',
    'Alt Phone',
    'Ticket Type',
    'Location',
    'Customer Type',
    'Identifier',
    'Zone',
    'Transaction Count',
    'Last Payment Date',
    'Created Date',
    'Status'
  ];

  // Transform data for export
  const transformForExport = (customer: Customer) => [
    customer['customer-number'],
    customer.phone,
    customer['alt-phone'] || '',
    customer['ticket-type-name'],
    customer['location-name'],
    customer['customer-type-name'],
    customer.identifier || '',
    customer['zone-name'] || '',
    customer['transaction-count'],
    customer['last-payment-date'] || '',
    new Date(customer['created-at']).toLocaleString(),
    customer['is-active'] ? 'Active' : 'Inactive'
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
    let filtered = customers.filter(customer => {
      const matchesSearch =
        customer['customer-number'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer['ticket-type-name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer['location-name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer['customer-type-name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.identifier?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (customer['zone-name']?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        customer['transaction-count'].toString().includes(searchTerm) ||
        (customer['last-payment-date']?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesZone = !selectedZone || customer['zone-name'] === selectedZone;

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
  }, [searchTerm, selectedZone, sortConfig, customers]);

  const totalEntries = filteredAndSortedData.length;
  const twoMonthsNonPaymentCustomers = 0; // TODO: Calculate based on last-payment-date
  const percentageNonPayment = totalEntries > 0 ? Math.round((twoMonthsNonPaymentCustomers / totalEntries) * 100) : 0;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading customers</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
      <TicketCustomerDetailsPage
        customerId={selectedCustomerId}
        onBack={handleBackFromDetails}
        onEdit={handleEditCustomer}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
        <ModernSelect
          placeholder="Select Business Center"
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
          placeholder="Months Since Last Payment"
          options={monthsSincePaymentOptions}
          value={selectedMonthsSincePayment}
          onChange={setSelectedMonthsSincePayment}
        />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-xl font-bold">{totalEntries}</div>
          <div className="text-xs text-blue-100">Total Customers</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl">
            <span className="font-bold">{twoMonthsNonPaymentCustomers}</span>
            <span className="font-normal text-base"> ({percentageNonPayment}%)</span>
          </div>
          <div className="text-xs text-red-100">2+ Months Non-Paid Customers</div>
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
              placeholder="Search visits, customers"
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
                <tr key={customer['customer-id']} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <button
                      onClick={() => handleViewCustomerDetails(customer['customer-number'], customer['customer-number'])}
                      className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline text-left"
                    >
                      {customer['customer-number']}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer['ticket-type-name']}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer['location-name']}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer['customer-type-name']}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight">
                      {customer.identifier || '-'}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="text-xs font-semibold text-slate-800">
                      {customer['zone-name'] || '-'}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center font-semibold">
                    {customer['transaction-count']}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {customer['last-payment-date'] ? new Date(customer['last-payment-date']).toLocaleString() : '-'}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {new Date(customer['created-at']).toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer['is-active']
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer['is-active'] ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleViewCustomerDetails(customer['customer-number'], customer['customer-number'])}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View details for ${customer['customer-number']}`}
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomerLocation({
                            customerNumber: customer['customer-number'],
                            customerPhone: customer.phone,
                            traderTypeOrPlate: customer.identifier || '',
                            customerType: customer['ticket-type-name'],
                            location: customer['location-name'],
                            lastTicketPaymentDate: customer['last-payment-date'] || '',
                            lastPaidAmount: 0,
                            latitude: customer['gps-latitude'] || 5.6037,
                            longitude: customer['gps-longitude'] || -0.1870
                          });
                          setShowLocationModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View location for ${customer['customer-number']}`}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </button>
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
          <div key={customer['customer-id']} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer['customer-number']}</h3>
                <p className="text-sm text-gray-600">
                  {customer['location-name']}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleViewCustomerDetails(customer['customer-number'], customer['customer-number'])}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View details for ${customer['customer-number']}`}
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCustomerLocation({
                      customerNumber: customer['customer-number'],
                      customerPhone: customer.phone,
                      traderTypeOrPlate: customer.identifier || '',
                      customerType: customer['ticket-type-name'],
                      location: customer['location-name'],
                      lastTicketPaymentDate: customer['last-payment-date'] || '',
                      lastPaidAmount: 0,
                      latitude: customer['gps-latitude'] || 5.6037,
                      longitude: customer['gps-longitude'] || -0.1870
                    });
                    setShowLocationModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View location for ${customer['customer-number']}`}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer['ticket-type-name']}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Type</label>
                  <p className="text-sm text-gray-700">{customer['customer-type-name']}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identifier</label>
                  <p className="text-sm text-gray-700">{customer.identifier || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer['transaction-count']}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer['zone-name'] || '-'}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Ticket Payment</label>
                  <p className="text-sm font-medium text-gray-900">{customer['last-payment-date'] ? new Date(customer['last-payment-date']).toLocaleString() : '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="text-sm font-medium text-gray-900">{customer['location-name']}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</label>
                  <p className="text-sm text-gray-700">{new Date(customer['created-at']).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    customer['is-active'] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer['is-active'] ? 'Active' : 'Inactive'}
                  </span>
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

      {/* Customer Location Modal */}
      {showLocationModal && selectedCustomerLocation && (
        <CustomerLocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setSelectedCustomerLocation(null);
          }}
          customerNumber={selectedCustomerLocation.customerNumber}
          customerName={selectedCustomerLocation.location}
          customerPhone={selectedCustomerLocation.customerPhone}
          customerType={selectedCustomerLocation.customerType}
          meterNumber={selectedCustomerLocation.traderTypeOrPlate}
          lastPaymentDate={selectedCustomerLocation.lastTicketPaymentDate}
          amountDue={selectedCustomerLocation.lastPaidAmount}
          city={selectedCustomerLocation.customerType}
          latitude={selectedCustomerLocation.latitude}
          longitude={selectedCustomerLocation.longitude}
          customerNameLabel="Location"
          customerPhoneLabel="Phone #"
          customerTypeLabel="Customer Type"
          meterNumberLabel="Identifier"
          lastPaymentDateLabel="Last Payment Date"
          locationCityLabel="Ticket Type"
          amountDueLabel="Last Paid Amount"
          amountColorClass="text-green-600"
          modalTitle="Ticket Customer Location"
        />
      )}
    </div>
  );
};