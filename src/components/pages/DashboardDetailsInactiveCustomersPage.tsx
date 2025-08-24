'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Plus, ArrowLeft } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { AddCustomerPage } from './AddCustomerPage';
import { CustomerDetailsPage } from './CustomerDetailsPage';
import { CustomerLocationModal } from '../ui/CustomerLocationModal';
import { ReactivationModal } from '../ui/ReactivationModal';
import { 
  businessLevelOptions, 
  zoneOptions
} from '@/lib/data';

interface Customer {
  id: number;
  customerNumber: string;
  customerName: string;
  customerPhone: string;
  customerType: 'Domestic' | 'Non-Residential';
  meterType: 'Manual' | 'Digital';
  meterNumber: string;
  city: string;
  zone: string;
  lastPaymentDate: string;
  amountDue: number;
  created: string;
  status: 'Active' | 'Inactive';
  inactiveReason: string;
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
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [selectedReactivationCustomer, setSelectedReactivationCustomer] = useState<Customer | null>(null);
  
  // Update document title and body attribute based on view
  useEffect(() => {
    if (showCustomerDetails) {
      document.title = 'CWSA - Customer Detail Information';
      document.body.setAttribute('data-customer-view', 'details');
    } else {
      document.title = 'CWSA - Customer List';
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

  const handleReactivateCustomer = (customer: Customer) => {
    setSelectedReactivationCustomer(customer);
    setShowReactivationModal(true);
  };

  const handleConfirmReactivation = (reason: string) => {
    console.log('Reactivating customer:', selectedReactivationCustomer?.customerNumber);
    console.log('Reason:', reason);
    // Here you would typically send the reactivation request to your API
    // After successful reactivation, you could refresh the list or remove the customer
    setShowReactivationModal(false);
    setSelectedReactivationCustomer(null);
  };

  const [selectedBusinessLevel, setSelectedBusinessLevel] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsSincePayment, setSelectedMonthsSincePayment] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  // Inactive customers data
  const customersData: Customer[] = [
    {
      id: 1,
      customerNumber: '0512-03-00892',
      customerName: 'KWAME ASANTE MENSAH',
      customerPhone: '0249876543',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '200405612',
      city: 'MADINA',
      zone: 'ZONE 3',
      lastPaymentDate: '15 Mar 2024',
      amountDue: 2456.78,
      created: '10 Jan 2025 09:30 AM',
      status: 'Inactive',
      inactiveReason: 'Non-payment for 10 months'
    },
    {
      id: 2,
      customerNumber: '0487-02-00145',
      customerName: 'PATRICIA OSEI BONSU',
      customerPhone: '0551234567',
      customerType: 'Non-Residential',
      meterType: 'Digital',
      meterNumber: '220178934',
      city: 'ACHIMOTA',
      zone: 'ZONE 2',
      lastPaymentDate: '28 Feb 2024',
      amountDue: 5678.90,
      created: '05 Jan 2025 02:15 PM',
      status: 'Inactive',
      inactiveReason: 'Business closed down'
    },
    {
      id: 3,
      customerNumber: '0512-04-00456',
      customerName: 'FATIMA ABDUL RAHMAN',
      customerPhone: '0244567890',
      customerType: 'Domestic',
      meterType: 'Digital',
      meterNumber: '200789012',
      city: 'NIMA',
      zone: 'ZONE 4',
      lastPaymentDate: '12 Apr 2024',
      amountDue: 1245.50,
      created: '08 Jan 2025 11:45 AM',
      status: 'Inactive',
      inactiveReason: 'Non-payment for 8 months'
    },
    {
      id: 4,
      customerNumber: '0489-01-00321',
      customerName: 'EMMANUEL KWAKU BOATENG',
      customerPhone: '0509876543',
      customerType: 'Non-Residential',
      meterType: 'Manual',
      meterNumber: '180456789',
      city: 'EAST LEGON',
      zone: 'ZONE 1',
      lastPaymentDate: '18 Jan 2024',
      amountDue: 3456.78,
      created: '12 Jan 2025 03:20 PM',
      status: 'Inactive',
      inactiveReason: 'Property demolished'
    },
    {
      id: 5,
      customerNumber: '0523-02-00789',
      customerName: 'GRACE AKOSUA MENSAH',
      customerPhone: '0277654321',
      customerType: 'Domestic',
      meterType: 'Digital',
      meterNumber: '210987654',
      city: 'TEMA',
      zone: 'ZONE 2',
      lastPaymentDate: '05 Sep 2024',
      amountDue: 892.45,
      created: '15 Jan 2025 08:30 AM',
      status: 'Inactive',
      inactiveReason: 'Customer relocated'
    },
    {
      id: 6,
      customerNumber: '0567-03-01234',
      customerName: 'SAMUEL NANA OPOKU',
      customerPhone: '0201234567',
      customerType: 'Non-Residential',
      meterType: 'Manual',
      meterNumber: '190234567',
      city: 'SPINTEX',
      zone: 'ZONE 3',
      lastPaymentDate: '22 Jun 2024',
      amountDue: 5678.90,
      created: '18 Jan 2025 01:15 PM',
      status: 'Inactive',
      inactiveReason: 'Meter tampering detected'
    },
    {
      id: 7,
      customerNumber: '0434-01-00987',
      customerName: 'MARY ADWOA FRIMPONG',
      customerPhone: '0551987654',
      customerType: 'Domestic',
      meterType: 'Digital',
      meterNumber: '200567891',
      city: 'KOTOBABI',
      zone: 'ZONE 1',
      lastPaymentDate: '14 Mar 2024',
      amountDue: 1567.33,
      created: '22 Jan 2025 10:00 AM',
      status: 'Inactive',
      inactiveReason: 'Service disconnection requested'
    },
    {
      id: 8,
      customerNumber: '0445-02-00654',
      customerName: 'JOSEPH KWABENA ASANTE',
      customerPhone: '0266543210',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '180345678',
      city: 'DANSOMAN',
      zone: 'ZONE 2',
      lastPaymentDate: '28 May 2024',
      amountDue: 2890.67,
      created: '25 Jan 2025 04:45 PM',
      status: 'Inactive',
      inactiveReason: 'Account dormant'
    },
    {
      id: 9,
      customerNumber: '0398-04-00112',
      customerName: 'REBECCA YABA ANSAH',
      customerPhone: '0245678901',
      customerType: 'Non-Residential',
      meterType: 'Digital',
      meterNumber: '220678901',
      city: 'AIRPORT',
      zone: 'ZONE 4',
      lastPaymentDate: '30 Nov 2024',
      amountDue: 4567.89,
      created: '28 Jan 2025 09:20 AM',
      status: 'Inactive',
      inactiveReason: 'Building under renovation'
    },
    {
      id: 10,
      customerNumber: '0512-01-00888',
      customerName: 'AKWASI OSEI TUTU',
      customerPhone: '0203456789',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '190123456',
      city: 'KANESHIE',
      zone: 'ZONE 1',
      lastPaymentDate: '16 Feb 2024',
      amountDue: 7234.12,
      created: '30 Jan 2025 07:10 AM',
      status: 'Inactive',
      inactiveReason: 'Non-payment for 11 months'
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
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '11%' },
    { key: 'customerName', label: 'Name', sortable: true, width: '13%' },
    { key: 'customerPhone', label: 'Phone', sortable: true, width: '9%' },
    { key: 'customerType', label: 'Type', sortable: true, width: '7%' },
    { key: 'meterNumber', label: 'Meter #', sortable: true, width: '9%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '6%' },
    { key: 'lastPaymentDate', label: 'Last Payment', sortable: true, width: '10%' },
    { key: 'amountDue', label: 'Amount Due', sortable: true, width: '8%' },
    { key: 'created', label: 'Inactive Date', sortable: true, width: '9%' },
    { key: 'inactiveReason', label: 'Inactive Reason', sortable: true, width: '10%' },
    { key: 'status', label: 'Status', sortable: false, width: '5%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '5%' }
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
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerPhone.includes(searchTerm) ||
        customer.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastPaymentDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.amountDue.toString().includes(searchTerm) ||
        customer.created.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.inactiveReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesZone = !selectedZone || customer.zone === selectedZone;
      
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
  const totalOwed = filteredAndSortedData.reduce((sum, customer) => sum + customer.amountDue, 0);
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  const formatCurrency = (amount: number) => {
    const prefix = amount < 0 ? 'GHS -' : 'GHS ';
    return prefix + Math.abs(amount).toFixed(2);
  };

  const getAmountColor = (amount: number) => {
    if (amount < 0) return 'text-green-600';
    if (amount > 0) return 'text-red-600';
    return 'text-gray-900';
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
          <div className="text-xs text-blue-100">Total Customers</div>
        </div>
        <div className="lg:col-start-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white text-right">
          <div className="text-xl font-bold">GHS {totalOwed.toLocaleString()}</div>
          <div className="text-xs text-red-100">Total Owed</div>
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
                <tr key={customer.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <button 
                      onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerName)}
                      className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline text-left"
                    >
                      {customer.customerNumber}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <button 
                      onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerName)}
                      className="text-blue-600 hover:text-blue-800 break-words leading-tight transition-colors duration-200 hover:underline group-hover:text-blue-800 text-left"
                    >
                      {customer.customerName}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight font-mono text-10px bg-slate-100 px-1 py-0.5 rounded text-center">
                      {customer.customerPhone}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer.customerType}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight font-mono text-10px bg-slate-100 px-1 py-0.5 rounded text-center">
                      {customer.meterNumber}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="text-xs font-semibold text-slate-800">
                      {customer.zone.replace('ZONE ', '')}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100">
                    <div className="leading-tight text-center break-words font-semibold">
                      {customer.lastPaymentDate}
                    </div>
                  </td>
                  <td className={`px-2 py-2 text-xs border-r border-gray-100 text-center font-bold ${getAmountColor(customer.amountDue)}`}>
                    {formatCurrency(customer.amountDue)}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-600 border-r border-gray-100">
                    <div className="leading-tight text-center break-words">
                      <div className="font-bold text-slate-800">{customer.created.split(' ').slice(0, 3).join(' ')}</div>
                      <div className="text-xs text-slate-500">{customer.created.split(' ').slice(3).join(' ')}</div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-xs text-slate-700 break-words px-1">
                      {customer.inactiveReason}
                    </div>
                  </td>
                  <td className="px-2 py-2 border-r border-gray-100">
                    <div className="flex justify-center">
                      <span className="inline-flex px-1 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {customer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button 
                      type="button"
                      onClick={() => handleReactivateCustomer(customer)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      title={`Reactivate ${customer.customerName}`}
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                    </button>
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
                <h3 className="text-lg font-semibold text-gray-900">{customer.customerName}</h3>
                <button 
                  onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerName)}
                  className="text-blue-600 hover:text-blue-800 underline font-medium text-sm text-left"
                >
                  {customer.customerNumber}
                </button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleReactivateCustomer(customer)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`Reactivate ${customer.customerName}`}
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.customerPhone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer.customerType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter Number</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.meterNumber}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.zone}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Payment Date</label>
                  <p className="text-sm font-medium text-gray-900">{customer.lastPaymentDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Due</label>
                  <p className={`text-sm font-bold ${getAmountColor(customer.amountDue)}`}>
                    {formatCurrency(customer.amountDue)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inactive Date</label>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{customer.created.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-xs text-gray-500">{customer.created.split(' ').slice(3).join(' ')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inactive Reason</label>
                  <p className="text-sm text-gray-700">{customer.inactiveReason}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {customer.status}
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

      {/* Reactivation Modal */}
      {showReactivationModal && selectedReactivationCustomer && (
        <ReactivationModal
          isOpen={showReactivationModal}
          onClose={() => {
            setShowReactivationModal(false);
            setSelectedReactivationCustomer(null);
          }}
          customerNumber={selectedReactivationCustomer.customerNumber}
          customerName={selectedReactivationCustomer.customerName}
          customerPhone={selectedReactivationCustomer.customerPhone}
          meterNumber={selectedReactivationCustomer.meterNumber}
          onConfirm={handleConfirmReactivation}
        />
      )}
    </div>
  );
};