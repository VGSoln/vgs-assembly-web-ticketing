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

interface Customer {
  id: number;
  customerNumber: string;
  customerPhone: string;
  customerType: 'Market' | 'Lorry Park';
  location: string;
  customerCategory: string; // Stall, Table-Top, Hawker for Market; Taxi, Trotro, Private for Lorry Park
  traderTypeOrPlate: string; // License plate for Lorry Park, Stall number for Market
  zone: string;
  community: string;
  ticketTransactions: number;
  lastTicketPaymentDate: string;
  monthsSinceLastPayment?: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
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
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(initialShowDetails || false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCustomerLocation, setSelectedCustomerLocation] = useState<any>(null);
  
  
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

  // Mock data for ticket customers
  const customersData: Customer[] = [
    {
      id: 1,
      customerNumber: 'MKT-001784',
      customerPhone: '0244304995',
      customerType: 'Market',
      location: 'Central Market',
      customerCategory: 'Stall',
      traderTypeOrPlate: 'S-124',
      zone: 'Zone A',
      community: 'Adum',
      ticketTransactions: 45,
      lastTicketPaymentDate: '25 Aug 2025 2:32 PM',
      monthsSinceLastPayment: 0,
      createdDate: '01 Nov 2024 9:15 AM',
      status: 'Active'
    },
    {
      id: 2,
      customerNumber: 'LPK-001876',
      customerPhone: '0243114560',
      customerType: 'Lorry Park',
      location: 'Main Station',
      customerCategory: 'Taxi',
      traderTypeOrPlate: 'AS-1234-21',
      zone: 'Zone B',
      community: 'Asafo',
      ticketTransactions: 28,
      lastTicketPaymentDate: '15 Jun 2025 10:15 AM',
      monthsSinceLastPayment: 2,
      createdDate: '01 Nov 2024 10:30 AM',
      status: 'Active'
    },
    {
      id: 3,
      customerNumber: 'MKT-001733',
      customerPhone: '0553467420',
      customerType: 'Market',
      location: 'Kejetia Market',
      customerCategory: 'Table-Top',
      traderTypeOrPlate: 'TT-087',
      zone: 'Zone A',
      community: 'Kejetia',
      ticketTransactions: 62,
      lastTicketPaymentDate: '24 Jul 2025 4:45 PM',
      monthsSinceLastPayment: 1,
      createdDate: '01 Nov 2024 11:20 AM',
      status: 'Active'
    },
    {
      id: 4,
      customerNumber: 'MKT-001892',
      customerPhone: '0208765432',
      customerType: 'Market',
      location: 'Adum Market',
      customerCategory: 'Hawker',
      traderTypeOrPlate: 'H-456',
      zone: 'Zone A',
      community: 'Adum',
      ticketTransactions: 25,
      lastTicketPaymentDate: '23 May 2025 9:23 AM',
      monthsSinceLastPayment: 3,
      createdDate: '15 Oct 2024 2:45 PM',
      status: 'Active'
    },
    {
      id: 5,
      customerNumber: 'LPK-002011',
      customerPhone: '0245678901',
      customerType: 'Lorry Park',
      location: 'Tech Junction',
      customerCategory: 'Trotro',
      traderTypeOrPlate: 'GE-4567-23',
      zone: 'Zone B',
      community: 'Tech',
      ticketTransactions: 48,
      lastTicketPaymentDate: '22 Aug 2025 11:56 AM',
      monthsSinceLastPayment: 0,
      createdDate: '10 Sep 2024 8:30 AM',
      status: 'Active'
    },
    {
      id: 6,
      customerNumber: 'MKT-001923',
      customerPhone: '0551234567',
      customerType: 'Market',
      location: 'Bantama Market',
      customerCategory: 'Stall',
      traderTypeOrPlate: 'S-089',
      zone: 'Zone C',
      community: 'Bantama',
      ticketTransactions: 38,
      lastTicketPaymentDate: '21 Mar 2025 3:12 PM',
      monthsSinceLastPayment: 5,
      createdDate: '05 Aug 2024 4:10 PM',
      status: 'Active'
    },
    {
      id: 7,
      customerNumber: 'LPK-001745',
      customerPhone: '0203456789',
      customerType: 'Lorry Park',
      location: 'Suame Station',
      customerCategory: 'Private',
      traderTypeOrPlate: 'GT-8765-24',
      zone: 'Zone D',
      community: 'Suame',
      ticketTransactions: 52,
      lastTicketPaymentDate: '20 Jun 2025 1:28 PM',
      monthsSinceLastPayment: 2,
      createdDate: '18 Jul 2024 12:25 PM',
      status: 'Active'
    },
    {
      id: 8,
      customerNumber: 'MKT-001856',
      customerPhone: '0249876543',
      customerType: 'Market',
      location: 'Roman Hill Market',
      customerCategory: 'Table-Top',
      traderTypeOrPlate: 'TT-234',
      zone: 'Zone E',
      community: 'Roman Hill',
      ticketTransactions: 19,
      lastTicketPaymentDate: '19 Jan 2025 10:45 AM',
      monthsSinceLastPayment: 7,
      createdDate: '25 Jun 2024 9:40 AM',
      status: 'Active'
    },
    {
      id: 9,
      customerNumber: 'MKT-001967',
      customerPhone: '0557654321',
      customerType: 'Market',
      location: 'Asafo Market',
      customerCategory: 'Hawker',
      traderTypeOrPlate: 'H-789',
      zone: 'Zone B',
      community: 'Asafo',
      ticketTransactions: 67,
      lastTicketPaymentDate: '18 Aug 2025 8:30 AM',
      monthsSinceLastPayment: 0,
      createdDate: '14 May 2024 3:55 PM',
      status: 'Active'
    },
    {
      id: 10,
      customerNumber: 'LPK-001812',
      customerPhone: '0202468135',
      customerType: 'Lorry Park',
      location: 'Tafo Terminal',
      customerCategory: 'Trotro',
      traderTypeOrPlate: 'AW-2345-23',
      zone: 'Zone F',
      community: 'Tafo',
      ticketTransactions: 44,
      lastTicketPaymentDate: '17 Apr 2025 2:15 PM',
      monthsSinceLastPayment: 4,
      createdDate: '30 Apr 2024 11:20 AM',
      status: 'Active'
    },
    {
      id: 11,
      customerNumber: 'MKT-002034',
      customerPhone: '0246789012',
      customerType: 'Market',
      location: 'Ayigya Market',
      traderTypeOrPlate: 'Stall',
      zone: 'Zone G',
      community: 'Ayigya',
      ticketTransactions: 31,
      lastTicketPaymentDate: '16 Jul 2025 12:40 PM',
      monthsSinceLastPayment: 1,
      createdDate: '12 Mar 2024 10:15 AM',
      status: 'Active'
    },
    {
      id: 12,
      customerNumber: 'LPK-001689',
      customerPhone: '0558901234',
      customerType: 'Lorry Park',
      location: 'Kejetia Terminal',
      traderTypeOrPlate: 'BA-9876-22',
      zone: 'Zone A',
      community: 'Kejetia',
      ticketTransactions: 89,
      lastTicketPaymentDate: '15 Feb 2025 9:55 AM',
      monthsSinceLastPayment: 6,
      createdDate: '22 Feb 2024 2:30 PM',
      status: 'Active'
    },
    {
      id: 13,
      customerNumber: 'MKT-002145',
      customerPhone: '0240987654',
      customerType: 'Market',
      location: 'Manhyia Market',
      traderTypeOrPlate: 'Table-Top',
      zone: 'Zone H',
      community: 'Manhyia',
      ticketTransactions: 23,
      lastTicketPaymentDate: '14 Aug 2025 4:20 PM',
      monthsSinceLastPayment: 0,
      createdDate: '10 Jan 2024 8:45 AM',
      status: 'Active'
    },
    {
      id: 14,
      customerNumber: 'LPK-001934',
      customerPhone: '0554567890',
      customerType: 'Lorry Park',
      location: 'Anloga Junction',
      traderTypeOrPlate: 'KT-5678-24',
      zone: 'Zone C',
      community: 'Anloga',
      ticketTransactions: 76,
      lastTicketPaymentDate: '13 Dec 2024 11:10 AM',
      monthsSinceLastPayment: 8,
      createdDate: '05 Dec 2023 1:25 PM',
      status: 'Active'
    },
    {
      id: 15,
      customerNumber: 'MKT-002267',
      customerPhone: '0201357902',
      customerType: 'Market',
      location: 'Oforikrom Market',
      traderTypeOrPlate: 'Hawker',
      zone: 'Zone I',
      community: 'Oforikrom',
      ticketTransactions: 41,
      lastTicketPaymentDate: '12 Nov 2024 1:45 PM',
      monthsSinceLastPayment: 9,
      createdDate: '20 Nov 2023 9:50 AM',
      status: 'Active'
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
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '7%' },
    { key: 'customerPhone', label: 'Phone #', sortable: true, width: '7%' },
    { key: 'customerType', label: 'Ticket Type', sortable: true, width: '7%' },
    { key: 'location', label: 'Location', sortable: true, width: '8%' },
    { key: 'customerCategory', label: 'Customer Type', sortable: true, width: '8%' },
    { key: 'traderTypeOrPlate', label: 'Identifier', sortable: true, width: '8%' },
    { key: 'community', label: 'Community', sortable: true, width: '7%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '6%' },
    { key: 'ticketTransactions', label: '# of Ticket Payments', sortable: true, width: '8%' },
    { key: 'lastTicketPaymentDate', label: 'Last Ticket Payment', sortable: true, width: '9%' },
    { key: 'monthsSinceLastPayment', label: 'Months Since Last Payment', sortable: true, width: '8%' },
    { key: 'createdDate', label: 'Created Date', sortable: true, width: '9%' },
    { key: 'status', label: 'Status', sortable: true, width: '6%' },
    { key: 'actions', label: 'Details', sortable: false, width: '6%' }
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
        customer.customerPhone.includes(searchTerm) ||
        customer.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.traderTypeOrPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ticketTransactions.toString().includes(searchTerm) ||
        customer.lastTicketPaymentDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.createdDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const twoMonthsNonPaymentCustomers = filteredAndSortedData.filter(customer => 
    customer.monthsSinceLastPayment !== undefined && customer.monthsSinceLastPayment >= 2
  ).length;
  const percentageNonPayment = totalEntries > 0 ? Math.round((twoMonthsNonPaymentCustomers / totalEntries) * 100) : 0;
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

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
                <tr key={customer.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <button 
                      onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerNumber)}
                      className="text-blue-600 hover:text-blue-800 break-all leading-tight transition-colors duration-200 hover:underline text-left"
                    >
                      {customer.customerNumber}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight">
                      {customer.customerPhone}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer.customerType}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer.location}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer.customerCategory}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight">
                      {customer.traderTypeOrPlate}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {customer.community || '-'}
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="text-xs font-semibold text-slate-800">
                      {customer.zone}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center font-semibold">
                    {customer.ticketTransactions}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {customer.lastTicketPaymentDate || '-'}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center font-semibold">
                    {customer.monthsSinceLastPayment !== undefined ? customer.monthsSinceLastPayment : '-'}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {customer.createdDate || '-'}
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <button 
                        type="button"
                        onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerNumber)}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View details for ${customer.customerNumber}`}
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedCustomerLocation({
                            customerNumber: customer.customerNumber,
                            customerPhone: customer.customerPhone,
                            traderTypeOrPlate: customer.traderTypeOrPlate,
                            customerType: customer.customerType,
                            location: customer.location,
                            lastTicketPaymentDate: customer.lastTicketPaymentDate,
                            lastPaidAmount: Math.floor(Math.random() * 50) + 10,
                            // Add some variation to coordinates for demo
                            latitude: 5.6037 + (Math.random() - 0.5) * 0.05,
                            longitude: -0.1870 + (Math.random() - 0.5) * 0.05
                          });
                          setShowLocationModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View location for ${customer.customerNumber}`}
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
          <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.customerNumber}</h3>
                <p className="text-sm text-gray-600">
                  {customer.location}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerNumber)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View details for ${customer.customerNumber}`}
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedCustomerLocation({
                      customerNumber: customer.customerNumber,
                      customerPhone: customer.customerPhone,
                      traderTypeOrPlate: customer.traderTypeOrPlate,
                      customerType: customer.customerType,
                      location: customer.location,
                      lastTicketPaymentDate: customer.lastTicketPaymentDate,
                      lastPaidAmount: Math.floor(Math.random() * 50) + 10,
                      // Add some variation to coordinates for demo
                      latitude: 5.6037 + (Math.random() - 0.5) * 0.05,
                      longitude: -0.1870 + (Math.random() - 0.5) * 0.05
                    });
                    setShowLocationModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View location for ${customer.customerNumber}`}
                >
                  <MapPin className="w-5 h-5 text-white" />
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer.customerType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Type</label>
                  <p className="text-sm text-gray-700">{customer.customerCategory}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identifier</label>
                  <p className="text-sm text-gray-700">{customer.traderTypeOrPlate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.ticketTransactions}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Community</label>
                  <p className="text-sm font-medium text-gray-900">{customer.community}</p>
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Ticket Payment</label>
                  <p className="text-sm font-medium text-gray-900">{customer.lastTicketPaymentDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="text-sm font-medium text-gray-900">{customer.location}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</label>
                  <p className="text-sm text-gray-700">{customer.createdDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
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