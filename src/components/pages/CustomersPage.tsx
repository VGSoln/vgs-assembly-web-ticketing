'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, Eye, MapPin, ArrowUpDown, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { AddCustomerPage } from './AddCustomerPage';
import { CustomerDetailsPage } from './CustomerDetailsPage';
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
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

interface CustomersPageProps {
  onDetailsView?: (isDetails: boolean) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onDetailsView }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  // Update parent when view changes
  useEffect(() => {
    onDetailsView?.(showCustomerDetails);
  }, [showCustomerDetails, onDetailsView]);
  
  // Navigation handler for customer details
  const handleViewCustomerDetails = (customerNumber: string, customerName: string) => {
    setSelectedCustomerId(customerNumber);
    setShowCustomerDetails(true);
  };

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

  // Mock data based on the screenshot
  const customersData: Customer[] = [
    {
      id: 1,
      customerNumber: '0525-07-00372',
      customerName: 'ABDALLAH IBRAHIM',
      customerPhone: '0244304995',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '200307953',
      city: 'DANFA',
      zone: 'ZONE 4',
      lastPaymentDate: '01 Aug 2025',
      amountDue: 0.00,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 2,
      customerNumber: '0504-07-001671',
      customerName: 'ABDALLAH MOHAMMED SAANI',
      customerPhone: '0243114560',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '200508606-A',
      city: 'HABITAT C',
      zone: 'ZONE 8',
      lastPaymentDate: '19 Jun 2025',
      amountDue: 337.34,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 3,
      customerNumber: '0504-07-001733',
      customerName: 'ABDUL HAMMED MUMIN AKANDE',
      customerPhone: '0553467420',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150737',
      city: 'NEW KWEIMAN',
      zone: 'ZONE 2',
      lastPaymentDate: '29 Jul 2025',
      amountDue: 388.65,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 4,
      customerNumber: '0504-07-001960',
      customerName: 'ABDUL KARIM IDRIS 1',
      customerPhone: '0532612960',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150287',
      city: 'NEW ADOTEIMAN',
      zone: 'ZONE 3',
      lastPaymentDate: '21 Jul 2025',
      amountDue: 674.08,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 5,
      customerNumber: '0504-07-001965',
      customerName: 'ABDUL KARIM IDRIS 2',
      customerPhone: '1111111111',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150456',
      city: 'NEW ADOTEIMAN',
      zone: 'ZONE 3',
      lastPaymentDate: '01 Nov 2024',
      amountDue: 93.80,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 6,
      customerNumber: '0504-07-001964',
      customerName: 'ABDUL KARIM IDRIS 3',
      customerPhone: '111111111',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150458',
      city: 'NEW ADOTEIMAN',
      zone: 'ZONE 3',
      lastPaymentDate: '01 Nov 2024',
      amountDue: -75.88,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 7,
      customerNumber: '0504-07-001958',
      customerName: 'ABDUL KARIM IDRIS 4',
      customerPhone: '0558682403',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150391',
      city: 'NEW ADOTEIMAN',
      zone: 'ZONE 3',
      lastPaymentDate: '30 Jan 2025',
      amountDue: 201.44,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 8,
      customerNumber: '0504-07-001980',
      customerName: 'ABDUL LATIF ABDULAI',
      customerPhone: '0203646915',
      customerType: 'Non-Residential',
      meterType: 'Manual',
      meterNumber: '220150462',
      city: 'DANFA',
      zone: 'ZONE 4',
      lastPaymentDate: '14 Aug 2025',
      amountDue: -10.52,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 9,
      customerNumber: '0525-07-01072',
      customerName: 'ABDUL RASHID MUSAH',
      customerPhone: '0240915672',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '170601106',
      city: 'NEW ADOTEIMAN',
      zone: 'ZONE 3',
      lastPaymentDate: '13 Aug 2025',
      amountDue: 0.20,
      created: '01 Nov 2024 12:00 AM',
      status: 'Active'
    },
    {
      id: 10,
      customerNumber: '0504-07-002044',
      customerName: 'ABDUL RAZAK FUSEINI MUSTAPHA',
      customerPhone: '0242911766',
      customerType: 'Domestic',
      meterType: 'Manual',
      meterNumber: '220150465',
      city: 'NEW KWEIMAN',
      zone: 'ZONE 2',
      lastPaymentDate: '07 Aug 2025',
      amountDue: -347.32,
      created: '06 Mar 2025 12:00 AM',
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
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '10%' },
    { key: 'customerName', label: 'Name', sortable: true, width: '15%' },
    { key: 'customerPhone', label: 'Phone', sortable: true, width: '10%' },
    { key: 'customerType', label: 'Type', sortable: true, width: '8%' },
    { key: 'meterType', label: 'Meter Type', sortable: true, width: '8%' },
    { key: 'meterNumber', label: 'Meter #', sortable: true, width: '10%' },
    { key: 'city', label: 'City', sortable: true, width: '8%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '6%' },
    { key: 'lastPaymentDate', label: 'Last Payment', sortable: true, width: '10%' },
    { key: 'amountDue', label: 'Amount Due', sortable: true, width: '8%' },
    { key: 'created', label: 'Created', sortable: true, width: '8%' },
    { key: 'status', label: 'Status', sortable: false, width: '6%' },
    { key: 'actions', label: 'Details', sortable: false, width: '8%' }
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
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerPhone.includes(searchTerm);
      
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
  if (showCustomerDetails) {
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
      {/* Top Action Row */}
      <div className="flex justify-end items-center mb-4">
        <button 
          onClick={handleAddCustomer}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

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
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    <span className="text-xs font-semibold">
                      {customer.meterType}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 border-r border-gray-100">
                    <div className="break-all leading-tight font-mono text-10px bg-slate-100 px-1 py-0.5 rounded text-center">
                      {customer.meterNumber}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 font-medium">
                    <div className="break-words leading-tight">
                      {customer.city}
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
                  <td className="px-2 py-2 border-r border-gray-100 text-center">
                    <span className="inline-flex px-1 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <button 
                        onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerName)}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View details for ${customer.customerName}`}
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={() => console.log('View location for:', customer.customerName)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        title={`View location for ${customer.customerName}`}
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
                  onClick={() => handleViewCustomerDetails(customer.customerNumber, customer.customerName)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View details for ${customer.customerName}`}
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => console.log('View location for:', customer.customerName)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm group-hover:shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  title={`View location for ${customer.customerName}`}
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Type</label>
                  <p className="text-sm font-medium text-gray-900">{customer.customerType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter Type</label>
                  <p className="text-sm text-gray-700">{customer.meterType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter Number</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.meterNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                  <p className="text-sm font-medium text-gray-900">{customer.city}</p>
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</label>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{customer.created.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-xs text-gray-500">{customer.created.split(' ').slice(3).join(' ')}</p>
                  </div>
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
    </div>
  );
};