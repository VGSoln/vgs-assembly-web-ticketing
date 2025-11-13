'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Copy, FileText, Download, FileSpreadsheet, File, Printer, Check, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
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
  customerNumber: string;
  customerName: string;
  phone: string;
  zone: string;
  lastVisit: string;
  lastPaidDate: string;
  lastOutcome: string;
  lastPaidMonth: string;
  lastPaidAmount: string;
  monthsOwed: number;
  amountOwed: string;
  customerComments: string;
  staffNotes: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

interface CustomerPaymentStatusPaidCustomersPageProps {
  initialCustomerId?: string;
  initialShowDetails?: boolean;
  onNavigate?: (page: string) => void;
}

export const CustomerPaymentStatusPaidCustomersPage: React.FC<CustomerPaymentStatusPaidCustomersPageProps> = ({ initialCustomerId, initialShowDetails, onNavigate }) => {
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

  // Paid customers data
  const customersData: Customer[] = [
    {
      id: 1,
      customerNumber: '02-0002-000005',
      customerName: 'Sarah .K. Quartey Stand Pipe 3',
      phone: '202659200',
      zone: 'Stand Pipes',
      lastVisit: '2025-08-06T10:55:36',
      lastPaidDate: '2025-08-06T10:55:36',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 2,211.00',
      monthsOwed: 0,
      amountOwed: 'GHS 1,947.00',
      customerComments: 'Payment completed',
      staffNotes: 'Customer paid in full'
    },
    {
      id: 2,
      customerNumber: '02-0002-000005',
      customerName: 'Sarah .K. Quartey Stand Pipe 3',
      phone: '202659200',
      zone: 'Stand Pipes',
      lastVisit: '2025-08-06T10:55:36',
      lastPaidDate: '2025-08-06T10:55:36',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 2,211.00',
      monthsOwed: 0,
      amountOwed: 'GHS 1,947.00',
      customerComments: 'Will pay next month',
      staffNotes: 'Follow up required'
    },
    {
      id: 3,
      customerNumber: '02-0002-000005',
      customerName: 'Sarah .K. Quartey Stand Pipe 3',
      phone: '202659200',
      zone: 'Stand Pipes',
      lastVisit: '2025-08-06T10:55:36',
      lastPaidDate: '2025-08-06T10:55:36',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 2,211.00',
      monthsOwed: 0,
      amountOwed: 'GHS 1,947.00',
      customerComments: 'Regular payment',
      staffNotes: 'Good customer'
    },
    {
      id: 4,
      customerNumber: '02-0002-000005',
      customerName: 'Sarah .K. Quartey Stand Pipe 3',
      phone: '202659200',
      zone: 'Stand Pipes',
      lastVisit: '2025-08-06T10:55:36',
      lastPaidDate: '2025-08-06T10:55:36',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 2,211.00',
      monthsOwed: 0,
      amountOwed: 'GHS 1,947.00',
      customerComments: 'No issues',
      staffNotes: 'Payment processed'
    },
    {
      id: 5,
      customerNumber: '0525-07-01272',
      customerName: 'KWESI KANKAM .',
      phone: '0544266670',
      zone: 'ZONE 3',
      lastVisit: '2025-08-14T15:03:42',
      lastPaidDate: '2025-08-14T15:03:42',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 92.84',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Thank you',
      staffNotes: 'Account cleared'
    },
    {
      id: 6,
      customerNumber: '0525-07-01256',
      customerName: 'ELIZABETH C.K PARE 5 .',
      phone: '0241319672',
      zone: 'ZONE 3',
      lastVisit: '2025-08-01T08:47:58',
      lastPaidDate: '2025-08-01T08:47:58',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 8.00',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Satisfied with service',
      staffNotes: 'Small payment received'
    },
    {
      id: 7,
      customerNumber: '0525-07-01215',
      customerName: 'JANE ADEY 4 .',
      phone: '0265380178',
      zone: 'ZONE 3',
      lastVisit: '2025-08-19T11:17:52',
      lastPaidDate: '2025-08-19T11:17:52',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 112.96',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Payment made on time',
      staffNotes: 'Consistent payer'
    },
    {
      id: 8,
      customerNumber: '0525-07-01164',
      customerName: 'DOROTHY ANATI 3 .',
      phone: '0548169738',
      zone: 'ZONE 3',
      lastVisit: '2025-08-08T14:10:16',
      lastPaidDate: '2025-08-08T14:10:16',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 68.60',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'All good',
      staffNotes: 'No issues'
    },
    {
      id: 9,
      customerNumber: '0525-07-01108',
      customerName: 'SERWAH AGYEMANG .',
      phone: '0541193448',
      zone: 'ZONE 3',
      lastVisit: '2025-08-01T13:08:59',
      lastPaidDate: '2025-08-01T13:08:59',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 32.24',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Happy with service',
      staffNotes: 'Regular customer'
    },
    {
      id: 10,
      customerNumber: '0525-07-00998',
      customerName: 'JULIAN DANQUAH .',
      phone: '0208725516',
      zone: 'ZONE 7',
      lastVisit: '2025-08-01T10:10:20',
      lastPaidDate: '2025-08-01T10:10:20',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 117.08',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Prompt service',
      staffNotes: 'Good payment history'
    },
    {
      id: 11,
      customerNumber: '0525-07-00971',
      customerName: 'EUNICE GAKPEY .',
      phone: '0542352879',
      zone: 'ZONE 6',
      lastVisit: '2025-08-01T09:18:22',
      lastPaidDate: '2025-08-01T09:18:22',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 68.60',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Thank you for the service',
      staffNotes: 'Payment confirmed'
    },
    {
      id: 12,
      customerNumber: '0525-07-00962',
      customerName: 'SOLOMON ADJAPONG .',
      phone: '0202009056',
      zone: 'ZONE 6',
      lastVisit: '2025-08-18T11:52:39',
      lastPaidDate: '2025-08-18T11:52:39',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 92.84',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Satisfied',
      staffNotes: 'Account up to date'
    },
    {
      id: 13,
      customerNumber: '0525-07-00910',
      customerName: 'GABRIEL NIIQUAYE .',
      phone: '0545810564',
      zone: 'ZONE 6',
      lastVisit: '2025-08-01T13:45:53',
      lastPaidDate: '2025-08-01T13:45:53',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 161.44',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Good service',
      staffNotes: 'Large payment received'
    },
    {
      id: 14,
      customerNumber: '0525-07-00897',
      customerName: 'BENJAMIN OCANSEY .',
      phone: '0208164491',
      zone: 'ZONE 7',
      lastVisit: '2025-08-05T22:03:50',
      lastPaidDate: '2025-08-05T22:03:50',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 92.84',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Will continue payment',
      staffNotes: 'Evening payment'
    },
    {
      id: 15,
      customerNumber: '0525-07-00886',
      customerName: 'ISAAC DZOBORSHIE .',
      phone: '0249577341',
      zone: 'ZONE 6',
      lastVisit: '2025-08-07T11:47:05',
      lastPaidDate: '2025-08-07T11:47:05',
      lastOutcome: 'Paid',
      lastPaidMonth: '07/2025',
      lastPaidAmount: 'GHS 208.47',
      monthsOwed: 0,
      amountOwed: 'GHS 0.00',
      customerComments: 'Appreciate the service',
      staffNotes: 'Premium customer'
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
    { key: 'customerNumber', label: 'Customer #', sortable: true, width: '8%' },
    { key: 'customerName', label: 'Customer Name', sortable: true, width: '11%' },
    { key: 'phone', label: 'Phone', sortable: true, width: '8%' },
    { key: 'zone', label: 'Zone', sortable: true, width: '6%' },
    { key: 'lastVisit', label: 'Last Visit', sortable: true, width: '9%' },
    { key: 'lastPaidDate', label: 'Last Paid Date', sortable: true, width: '9%' },
    { key: 'lastOutcome', label: 'Last Outcome', sortable: true, width: '7%' },
    { key: 'lastPaidMonth', label: 'Last Paid Mth', sortable: true, width: '7%' },
    { key: 'lastPaidAmount', label: 'Last Paid Amt', sortable: true, width: '8%' },
    { key: 'monthsOwed', label: 'Months Owed', sortable: true, width: '7%' },
    { key: 'amountOwed', label: 'Amount Owed', sortable: true, width: '8%' },
    { key: 'customerComments', label: 'Customer Comments', sortable: false, width: '8%' },
    { key: 'staffNotes', label: 'Staff Notes', sortable: false, width: '8%' }
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
        customer.phone.includes(searchTerm) ||
        customer.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastVisit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastPaidDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastOutcome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastPaidMonth.includes(searchTerm) ||
        customer.lastPaidAmount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.monthsOwed.toString().includes(searchTerm) ||
        customer.amountOwed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerComments.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.staffNotes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesZone = !selectedZone || customer.zone.includes(selectedZone);
      
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
  const totalOwed = filteredAndSortedData.reduce((sum, customer) => {
    const amount = parseFloat(customer.amountOwed.replace('GHS ', '').replace(',', ''));
    return sum + amount;
  }, 0);
  const startEntry = (currentPage - 1) * parseInt(entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(entriesPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(entriesPerPage));
  const currentData = filteredAndSortedData.slice(startEntry - 1, endEntry);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  const formatMonth = (monthStr: string) => {
    // Convert format like "11/2024" to "Nov 2024"
    if (!monthStr || !monthStr.includes('/')) return monthStr;
    const [month, year] = monthStr.split('/');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }
    return monthStr;
  };

  const getAmountColor = (amount: string) => {
    if (amount === 'GHS 0.00') return 'text-green-600';
    return 'text-red-600';
  };

  // Show AddCustomerPage if showAddCustomer is true
  if (showAddCustomer) {
    return (
      <AddCustomerPage 
        onSave={handleSaveCustomer}
      />
    );
  }

  // Show CustomerDetailsPage if showCustomerDetails is true
  if (showCustomerDetails === true) {
    return (
      <CustomerDetailsPage
        customerId={selectedCustomerId}
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
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="text-xs font-semibold text-slate-800">
                      {customer.zone}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100">
                    <div className="leading-tight text-center break-words text-10px">
                      <span className="font-bold">{formatDateTime(customer.lastVisit).dateStr}</span>
                      <br />
                      <span>{formatDateTime(customer.lastVisit).timeStr}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100">
                    <div className="leading-tight text-center break-words text-10px">
                      <span className="font-bold">{formatDateTime(customer.lastPaidDate).dateStr}</span>
                      <br />
                      <span>{formatDateTime(customer.lastPaidDate).timeStr}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100 text-center">
                    <span className="inline-flex px-1 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {customer.lastOutcome}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    {formatMonth(customer.lastPaidMonth)}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center font-semibold">
                    {customer.lastPaidAmount}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-800 border-r border-gray-100 text-center">
                    <span className={`font-bold ${customer.monthsOwed === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {customer.monthsOwed}
                    </span>
                  </td>
                  <td className={`px-2 py-2 text-xs border-r border-gray-100 text-center font-bold ${getAmountColor(customer.amountOwed)}`}>
                    {customer.amountOwed}
                  </td>
                  <td className="px-2 py-2 text-xs border-r border-gray-100">
                    <div className="text-xs text-slate-700 break-words px-1">
                      {customer.customerComments}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <div className="text-xs text-slate-700 break-words px-1">
                      {customer.staffNotes}
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                  <p className="text-sm text-gray-700 font-mono bg-slate-100 px-2 py-1 rounded">{customer.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.zone}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Visit</label>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">{formatDateTime(customer.lastVisit).dateStr}</span>
                    <br />
                    <span className="font-normal">{formatDateTime(customer.lastVisit).timeStr}</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Paid Date</label>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">{formatDateTime(customer.lastPaidDate).dateStr}</span>
                    <br />
                    <span className="font-normal">{formatDateTime(customer.lastPaidDate).timeStr}</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Outcome</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {customer.lastOutcome}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Paid Month</label>
                  <p className="text-sm font-medium text-gray-900">{formatMonth(customer.lastPaidMonth)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Paid Amount</label>
                  <p className="text-sm font-bold text-gray-900">{customer.lastPaidAmount}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Months Owed</label>
                  <p className={`text-sm font-bold ${customer.monthsOwed === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.monthsOwed}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Owed</label>
                  <p className={`text-sm font-bold ${getAmountColor(customer.amountOwed)}`}>
                    {customer.amountOwed}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Comments</label>
                  <p className="text-sm text-gray-700">{customer.customerComments}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Notes</label>
                  <p className="text-sm text-gray-700">{customer.staffNotes}</p>
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