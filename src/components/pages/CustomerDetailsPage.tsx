'use client'
import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageSquare, DollarSign, Edit, User, MapPin, Mail, Home, ChevronLeft, Briefcase, Calendar, Clock, Hash, CreditCard, Droplets, Gauge, FileSpreadsheet, File, Copy, Printer, FileText, Receipt, Eye, Edit2, Trash2, FileDown } from 'lucide-react';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface CustomerDetailsPageProps {
  customerId?: string;
  onBack?: () => void;
  onEdit?: (customerId: string) => void;
}

export const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({ 
  customerId = '0525-07-00372',
  onBack,
  onEdit 
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'rates' | 'payments' | 'bills'>('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Bills state
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [billSortColumn, setBillSortColumn] = useState<string | null>(null);
  const [billSortDirection, setBillSortDirection] = useState<'asc' | 'desc'>('asc');
  const [billModalOpen, setBillModalOpen] = useState(false);

  // Mock customer data - in a real app, this would come from an API
  const customerData = {
    customerNumber: '0525-07-00372',
    name: 'ABDALLAH IBRAHIM',
    phone: '0244304995',
    customerType: 'Domestic',
    meterNumber: '200307953',
    meterType: 'Manual',
    zone: 'ZONE 4',
    username: '0525-07-00372',
    email: 'abdallah.ibrahim@example.com',
    address: 'BF131 Endive St. Damfa, Accra',
    longitude: '-0.16486985',
    latitude: '5.78441568',
    created: '2024-11-01',
    createdBy: 'CWSA Admin',
    lastModified: '2025-06-11',
    lastModifiedBy: 'MARY SERWAA',
    status: 'ACTIVE',
    billingCycle: 'Monthly',
    accountBalance: '245.50',
    lastPaymentDate: '2025-05-15',
    lastPaymentAmount: '120.00'
  };

  // Payment data
  const paymentData = [
    { id: '0525-07-00372-mdslme2v', collector: 'CWSA Admin', type: 'ePayment', date: 'Fri, 01 Aug 2025, 09:08 am', amount: 165.56, created: 'Fri, 01 Aug 2025, 09:08 am', status: 'Paid' },
    { id: '0525-07-00372-mcka1wva', collector: 'CWSA Admin', type: 'ePayment', date: 'Tue, 01 Jul 2025, 08:40 am', amount: 117.08, created: 'Tue, 01 Jul 2025, 08:40 am', status: 'Paid' },
    { id: '0525-07-00372-mbdikl8o', collector: 'CWSA Admin', type: 'ePayment', date: 'Sun, 01 Jun 2025, 10:24 am', amount: 141.32, created: 'Sun, 01 Jun 2025, 10:24 am', status: 'Paid' },
    { id: '0525-07-00372-ma5bw33p', collector: 'CWSA Admin', type: 'ePayment', date: 'Thu, 01 May 2025, 12:16 pm', amount: 189.76, created: 'Thu, 01 May 2025, 12:16 pm', status: 'Paid' },
    { id: '0525-07-00372-m8ytjkzr', collector: 'CWSA Admin', type: 'ePayment', date: 'Tue, 01 Apr 2025, 06:17 pm', amount: 105.00, created: 'Tue, 01 Apr 2025, 06:17 pm', status: 'Paid' },
    { id: '0525-07-00372-m84agtg3', collector: 'CWSA Admin', type: 'ePayment', date: 'Tue, 11 Mar 2025, 09:29 am', amount: 189.01, created: 'Tue, 11 Mar 2025, 09:29 am', status: 'Paid' },
    { id: '019-32LPKD58', collector: 'Rapheal Kwabena Aboagye', type: 'Cash', date: 'Fri, 21 Feb 2025, 11:58 am', amount: 450.00, created: 'Fri, 21 Feb 2025, 11:58 am', status: 'Paid' },
    { id: '7ff05772-a9fb-406b-b9a1-ac263dbe0718', collector: 'CWSA Admin', type: 'Cash', date: 'Thu, 30 Jan 2025, 12:00 am', amount: 297.00, created: 'Thu, 30 Jan 2025, 12:00 am', status: 'Paid' }
  ];

  // Bill data
  const billData = [
    { period: '202507', description: 'Bill (July 2025)', currentBill: 389.72, status: 'Paid', amountPaid: 251.00, amountDue: 389.48 },
    { period: '202506', description: 'Bill (June 2025)', currentBill: 280.64, status: 'Paid', amountPaid: 400.00, amountDue: 250.76 },
    { period: '202505', description: 'Bill (May 2025)', currentBill: 377.60, status: 'Paid', amountPaid: 300.00, amountDue: 370.12 },
    { period: '202504', description: 'Bill (April 2025)', currentBill: 353.36, status: 'Paid', amountPaid: 600.00, amountDue: 292.52 },
    { period: '202503', description: 'Bill (March 2025)', currentBill: 510.92, status: 'Paid', amountPaid: 1000.00, amountDue: 539.16 },
    { period: '202502', description: 'Bill (February 2025)', currentBill: 1032.08, status: 'Paid', amountPaid: 690.00, amountDue: 1028.24 },
    { period: '202501', description: 'Bill (January 2025)', currentBill: 680.60, status: 'Not Paid', amountPaid: 0.00, amountDue: 686.16 },
    { period: '202412', description: 'Bill (December 2024)', currentBill: 165.56, status: 'Not Paid', amountPaid: 160.00, amountDue: 5.56 },
    { period: '202411', description: 'Bill (November 2024)', currentBill: 0.00, status: 'Paid', amountPaid: 0.00, amountDue: 0.00 }
  ];

  // Filter payments based on search term
  const filteredPayments = paymentData.filter(payment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.collector.toLowerCase().includes(searchLower) ||
      payment.type.toLowerCase().includes(searchLower) ||
      payment.date.toLowerCase().includes(searchLower) ||
      payment.amount.toString().includes(searchLower) ||
      payment.created.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower)
    );
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aVal: any = a[sortColumn as keyof typeof a];
    let bVal: any = b[sortColumn as keyof typeof b];
    
    if (sortColumn === 'amount') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter bills based on search term
  const filteredBills = billData.filter(bill => {
    if (!billSearchTerm) return true;
    const searchLower = billSearchTerm.toLowerCase();
    return (
      bill.period.toLowerCase().includes(searchLower) ||
      bill.description.toLowerCase().includes(searchLower) ||
      bill.currentBill.toString().includes(searchLower) ||
      bill.status.toLowerCase().includes(searchLower) ||
      bill.amountPaid.toString().includes(searchLower) ||
      bill.amountDue.toString().includes(searchLower)
    );
  });

  // Sort bills
  const sortedBills = [...filteredBills].sort((a, b) => {
    if (!billSortColumn) return 0;
    
    let aVal: any = a[billSortColumn as keyof typeof a];
    let bVal: any = b[billSortColumn as keyof typeof b];
    
    if (billSortColumn === 'currentBill' || billSortColumn === 'amountPaid' || billSortColumn === 'amountDue') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (aVal < bVal) return billSortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return billSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle bill sort
  const handleBillSort = (column: string) => {
    if (billSortColumn === column) {
      setBillSortDirection(billSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setBillSortColumn(column);
      setBillSortDirection('asc');
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Transaction #', 'Collector', 'Payment Type', 'Payment Date', 'Amount', 'Created', 'Status'];
    const rows = sortedPayments.map(p => [p.id, p.collector, p.type, p.date, `GH₵ ${p.amount}`, p.created, p.status]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    const content = `
PAYMENT HISTORY REPORT
Generated: ${new Date().toLocaleDateString()}

${sortedPayments.map(p => `
Transaction #: ${p.id}
Collector: ${p.collector}
Payment Type: ${p.type}
Payment Date: ${p.date}
Amount: GH₵ ${p.amount}
Created: ${p.created}
Status: ${p.status}
----------------------------`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleCopy = () => {
    const text = sortedPayments.map(p => 
      `${p.id}\t${p.collector}\t${p.type}\t${p.date}\tGH₵ ${p.amount}\t${p.created}\t${p.status}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Payment data copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate initials for avatar
  const initials = customerData.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Bill Export functions
  const exportBillsToCSV = () => {
    const headers = ['Period', 'Description', 'Current Bill', 'Bill Status', 'Amount Paid', 'Amount Due'];
    const rows = sortedBills.map(b => [b.period, b.description, `GH₵ ${b.currentBill.toFixed(2)}`, b.status, `GH₵ ${b.amountPaid.toFixed(2)}`, `GH₵ ${b.amountDue.toFixed(2)}`]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportBillsToPDF = () => {
    const content = `
BILLS HISTORY REPORT
Generated: ${new Date().toLocaleDateString()}

${sortedBills.map(b => `
Period: ${b.period}
Description: ${b.description}
Current Bill: GH₵ ${b.currentBill.toFixed(2)}
Bill Status: ${b.status}
Amount Paid: GH₵ ${b.amountPaid.toFixed(2)}
Amount Due: GH₵ ${b.amountDue.toFixed(2)}
----------------------------`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleBillCopy = () => {
    const text = sortedBills.map(b => 
      `${b.period}\t${b.description}\tGH₵ ${b.currentBill.toFixed(2)}\t${b.status}\tGH₵ ${b.amountPaid.toFixed(2)}\tGH₵ ${b.amountDue.toFixed(2)}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Bill data copied to clipboard!');
  };

  const handleBillPrint = () => {
    window.print();
  };

  const handleLogCall = () => {
    // Handle log customer call
    console.log('Logging customer call');
  };

  const handleNotifyViaText = () => {
    setNotificationModalOpen(true);
  };

  const handleReceivePayment = () => {
    setPaymentModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm text-gray-600">Customer ID: #{customerData.customerNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {customerData.status}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(customerData.customerNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Customer
                </button>
                <button 
                  onClick={handleLogCall}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Log Customer Call
                </button>
                <button 
                  onClick={handleNotifyViaText}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Notify via Text
                </button>
                <button 
                  onClick={handleReceivePayment}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="text-sm font-medium">₵</span>
                  Receive Payment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Header */}
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Customer Profile
              </button>
              <button 
                onClick={() => setActiveTab('rates')}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'rates'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm mr-1">₵</span>
                Rates
              </button>
              <button 
                onClick={() => setActiveTab('payments')}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'payments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                Payments
              </button>
              <button 
                onClick={() => setActiveTab('bills')}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'bills'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 mr-1.5" />
                Bills
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' ? (
              <>
                {/* Personal Information Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Name with Avatar */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Name</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{customerData.name}</p>
                          <p className="text-xs text-gray-500">@{customerData.username}</p>
                        </div>
                      </div>
                    </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Phone</label>
                  <p className="text-sm font-medium text-gray-900">{customerData.phone}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Email</label>
                  <p className="text-sm font-medium text-gray-900 break-all">{customerData.email}</p>
                </div>

                {/* Customer Type */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Customer Type</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                    {customerData.customerType}
                  </p>
                </div>
              </div>

              {/* Address and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Address</label>
                  <p className="text-sm font-medium text-gray-900">{customerData.address}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">GPS Coordinates</label>
                  <p className="text-sm font-medium text-gray-900 font-mono text-xs">
                    Lat: {customerData.latitude} | Long: {customerData.longitude}
                  </p>
                </div>
                  </div>
                </div>

                {/* Account Information Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Number */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Customer Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.customerNumber}</p>
                </div>

                {/* Zone */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Zone
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.zone}</p>
                </div>

                {/* Billing Cycle */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Billing Cycle
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.billingCycle}</p>
                </div>
              </div>
            </div>

            {/* Meter Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-teal-500" />
                Meter Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Meter Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.meterNumber}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Meter Type
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.meterType}</p>
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Balance</span>
                  <span className="text-sm font-medium text-gray-900">₵{customerData.accountBalance}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</span>
                  <span className="text-sm font-medium text-gray-900">₵{customerData.lastPaymentAmount}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</span>
                  <span className="text-sm font-medium text-gray-900">{customerData.lastPaymentDate}</span>
                </div>
              </div>
            </div>

            {/* Audit Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Audit Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Created
                      </label>
                      <p className="text-sm font-medium text-gray-900">{customerData.created}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Created By
                      </label>
                      <p className="text-sm font-medium text-gray-900">{customerData.createdBy}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Last Modified
                      </label>
                      <p className="text-sm font-medium text-gray-900">{customerData.lastModified}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Last Modified By
                      </label>
                      <p className="text-sm font-medium text-gray-900">{customerData.lastModifiedBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </>
            ) : activeTab === 'rates' ? (
              <>
                {/* Rates Content */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-lg">₵</span>
                    Rate Information
                  </h3>
                  
                  {/* Rates Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Frequency</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Rate Type</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Tariff Type</th>
                          <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Fixed</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Service Charge</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">₵8.00 per month</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Uniform</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Water Charge</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">₵12.00 per cubic meter</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Percentage</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Fire Fighting</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">1.00% of total</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Additional Rate Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Billing Cycle
                      </label>
                      <p className="text-sm font-medium text-gray-900">Monthly</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Rate Class
                      </label>
                      <p className="text-sm font-medium text-gray-900">Domestic</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Last Rate Update
                      </label>
                      <p className="text-sm font-medium text-gray-900">01 Jan 2025</p>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'payments' ? (
              <>
                {/* Payments Content */}
                <div className="space-y-5">
                  {/* Search and Export Controls */}
                  <div className="bg-white px-4 py-3 border border-gray-200 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show</span>
                        <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                          <option value="50">50</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="100">100</option>
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleCopy}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                            <Copy className="w-4 h-4" />
                            Copy
                          </button>
                          <button 
                            onClick={handlePrint}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                          <button 
                            onClick={exportToCSV}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1.5 transition-colors">
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                          </button>
                          <button 
                            onClick={exportToCSV}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1.5 transition-colors">
                            <File className="w-4 h-4" />
                            CSV
                          </button>
                          <button 
                            onClick={exportToPDF}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1.5 transition-colors">
                            <FileText className="w-4 h-4" />
                            PDF
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search payments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 bg-white"
                        />
                        <svg className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payments Table */}
                  <div className="overflow-hidden border border-gray-200 border-t-0 rounded-b-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-700">
                          <th 
                            className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('id')}
                          >
                            <div className="flex items-center gap-1">
                              Transaction #
                              {sortColumn === 'id' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('collector')}
                          >
                            <div className="flex items-center gap-1">
                              Collector
                              {sortColumn === 'collector' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('type')}
                          >
                            <div className="flex items-center gap-1">
                              Payment Type
                              {sortColumn === 'type' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('date')}
                          >
                            <div className="flex items-center gap-1">
                              Payment Date
                              {sortColumn === 'date' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-right py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('amount')}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Amount
                              {sortColumn === 'amount' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('created')}
                          >
                            <div className="flex items-center gap-1">
                              Created
                              {sortColumn === 'created' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-center py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Status
                              {sortColumn === 'status' && (
                                <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPayments.map((payment, index) => (
                          <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.id}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.collector}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.type}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.date}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">GH₵ {payment.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.created}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded hover:bg-orange-600">
                                  Rcpt
                                </button>
                                <button className="p-1 text-blue-600 hover:text-blue-800">
                                  <MapPin className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Table Footer */}
                    <div className="bg-slate-700 text-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedPayments.length}</span> of <span className="font-medium">{sortedPayments.length}</span> entries
                        </div>
                        {sortColumn && (
                          <div className="text-sm text-gray-300">
                            Sorted by <span className="font-semibold text-white">
                              {sortColumn === 'id' ? 'Transaction #' :
                               sortColumn === 'collector' ? 'Collector' :
                               sortColumn === 'type' ? 'Payment Type' :
                               sortColumn === 'date' ? 'Payment Date' :
                               sortColumn === 'amount' ? 'Amount' :
                               sortColumn === 'created' ? 'Created' :
                               sortColumn === 'status' ? 'Status' : sortColumn}
                            </span>
                            <span className="ml-1 text-gray-300">
                              ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing 1 to {sortedPayments.length} of {sortedPayments.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
                        ← Previous
                      </button>
                      <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        1
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'bills' ? (
              <>
                {/* Bills Content */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Receipt className="w-8 h-8 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Customer Bills</h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      View and manage all bills for customer {customerData.name}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white rounded-lg px-4 py-2 border border-yellow-200">
                        <p className="text-sm text-gray-500 mb-1">Total Bills</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 border border-yellow-200">
                        <p className="text-sm text-gray-500 mb-1">Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">GH₵ 450.00</p>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 border border-yellow-200">
                        <p className="text-sm text-gray-500 mb-1">Last Bill Date</p>
                        <p className="text-2xl font-bold text-gray-900">Nov 2024</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Bills Table */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 px-6 pt-6 pb-4">Recent Bills</h4>
                    
                    {/* Search and Export Controls */}
                    <div className="px-6 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Show</span>
                          <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                          </select>
                          <span className="text-sm text-gray-600">entries</span>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={handleBillCopy}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                            <button 
                              onClick={handleBillPrint}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                              <Printer className="w-4 h-4" />
                              Print
                            </button>
                            <button 
                              onClick={exportBillsToCSV}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1.5 transition-colors">
                              <FileSpreadsheet className="w-4 h-4" />
                              Excel
                            </button>
                            <button 
                              onClick={exportBillsToCSV}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1.5 transition-colors">
                              <File className="w-4 h-4" />
                              CSV
                            </button>
                            <button 
                              onClick={exportBillsToPDF}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1.5 transition-colors">
                              <FileText className="w-4 h-4" />
                              PDF
                            </button>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search bills..."
                            value={billSearchTerm}
                            onChange={(e) => setBillSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 bg-white"
                          />
                          <svg className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bills Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-700">
                            <th 
                              className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('period')}
                            >
                              <div className="flex items-center gap-1">
                                Period
                                {billSortColumn === 'period' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-left py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('description')}
                            >
                              <div className="flex items-center gap-1">
                                Description
                                {billSortColumn === 'description' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-right py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('currentBill')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Current Bill
                                {billSortColumn === 'currentBill' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-center py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('status')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Bill Status
                                {billSortColumn === 'status' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-right py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('amountPaid')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Amount Paid
                                {billSortColumn === 'amountPaid' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-right py-3 px-4 text-sm font-medium text-white border-r border-slate-600 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleBillSort('amountDue')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Amount Due
                                {billSortColumn === 'amountDue' && (
                                  <span className="text-xs">{billSortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                              </div>
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-white">Download</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedBills.map((bill, index) => (
                            <tr key={bill.period} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-900">{bill.period}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{bill.description}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">GH₵ {bill.currentBill.toFixed(2)}</td>
                              <td className="py-3 px-4 text-sm text-center">
                                <span className={`px-2 py-1 text-xs font-medium ${
                                  bill.status === 'Paid'
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'
                                }`}>
                                  {bill.status} {bill.status === 'Paid' ? '✓' : '✗'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">GH₵ {bill.amountPaid.toFixed(2)}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">GH₵ {bill.amountDue.toFixed(2)}</td>
                              <td className="py-3 px-4 text-sm text-center">
                                <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm font-medium">
                                  Bill Issued
                                  <FileText className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Table Footer */}
                    <div className="bg-slate-700 text-white px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedBills.length}</span> of <span className="font-medium">{sortedBills.length}</span> entries
                        </div>
                        {billSortColumn && (
                          <div className="text-sm text-gray-300">
                            Sorted by <span className="font-semibold text-white">{
                              billSortColumn === 'period' ? 'Period' :
                              billSortColumn === 'description' ? 'Description' :
                              billSortColumn === 'currentBill' ? 'Current Bill' :
                              billSortColumn === 'status' ? 'Bill Status' :
                              billSortColumn === 'amountPaid' ? 'Amount Paid' :
                              billSortColumn === 'amountDue' ? 'Amount Due' : billSortColumn
                            }</span>
                            <span className="ml-1 text-gray-300">
                              ({billSortDirection === 'asc' ? 'Ascending' : 'Descending'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Showing 1 to {sortedBills.length} of {sortedBills.length} results
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
                          ← Previous
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                          1
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={() => {
          console.log('Payment received');
          setPaymentModalOpen(false);
        }}
        title="Receive Payment"
        message="Are you sure you want to record a payment for this customer?"
        confirmText="Confirm Payment"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        onConfirm={() => {
          console.log('Notification sent');
          setNotificationModalOpen(false);
        }}
        title="Send Text Notification"
        message="Are you sure you want to send a text notification to this customer?"
        confirmText="Send Notification"
        confirmButtonClass="bg-purple-600 hover:bg-purple-700"
      />

      <ConfirmationModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onConfirm={() => {
          console.log('Bill deleted');
          setBillModalOpen(false);
        }}
        title="Delete Bill"
        message="Are you sure you want to delete this bill?"
        confirmText="Delete Bill"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

