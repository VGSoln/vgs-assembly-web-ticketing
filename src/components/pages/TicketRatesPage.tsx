'use client';
import React, { useState } from 'react';
import { DollarSign, Building2, Bus, Plus, Search, FileSpreadsheet, File, Printer, Copy, Calendar, Clock, AlertCircle } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface TicketRate {
  id: number;
  rateId: string;
  ticketType: 'Market' | 'Lorry Park';
  customerType: 'Hawker' | 'Table-Top' | 'Stall' | 'Taxi' | 'Trotro' | 'Private';
  location: string;
  frequency: string;
  rateType: string;
  amount: number;
  unit: string;
  effectiveDate: string;
  expiryDate: string | null;
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
}

export const TicketRatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Market' | 'Lorry Park'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<'Market' | 'Lorry Park' | ''>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TicketRate | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  
  // Form state for Add New Rate modal
  const [formCustomerType, setFormCustomerType] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRateType, setFormRateType] = useState('');
  const [formFrequency, setFormFrequency] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formEffectiveDate, setFormEffectiveDate] = useState('');
  
  // Form state for Bulk Add modal
  const [bulkLocation, setBulkLocation] = useState('');
  const [bulkRateType, setBulkRateType] = useState('');
  const [bulkFrequency, setBulkFrequency] = useState('');
  const [bulkUnit, setBulkUnit] = useState('');
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState('');
  
  // Checkbox states for bulk modal
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<string[]>([]);
  const [allLocationsChecked, setAllLocationsChecked] = useState(false);
  const [allCustomerTypesChecked, setAllCustomerTypesChecked] = useState(false);
  
  const itemsPerPage = 10;

  // Format date helper
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format date for input display (dd/mm/yyyy)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get available locations based on ticket type
  const getAvailableLocations = () => {
    if (selectedTicketType === 'Market') {
      return ['Central Market', 'Kejetia Market', 'Bantama Market', 'Asafo Market', 'Suame Magazine'];
    } else if (selectedTicketType === 'Lorry Park') {
      return ['Kejetia Lorry Park', 'Asafo Lorry Park', 'Tech Junction Station', 'Adum Station', 'Atonsu Station'];
    }
    return [];
  };

  // Get available customer types based on ticket type
  const getAvailableCustomerTypes = () => {
    if (selectedTicketType === 'Market') {
      return ['Hawker', 'Table-Top', 'Stall'];
    } else if (selectedTicketType === 'Lorry Park') {
      return ['Taxi', 'Trotro', 'Private'];
    }
    return [];
  };

  // Handle select all locations
  const handleSelectAllLocations = (checked: boolean) => {
    setAllLocationsChecked(checked);
    if (checked) {
      setSelectedLocations(getAvailableLocations());
    } else {
      setSelectedLocations([]);
    }
  };

  // Handle individual location selection
  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, location]);
      // Check if all locations are now selected
      if (selectedLocations.length + 1 === getAvailableLocations().length) {
        setAllLocationsChecked(true);
      }
    } else {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
      setAllLocationsChecked(false);
    }
  };

  // Handle select all customer types
  const handleSelectAllCustomerTypes = (checked: boolean) => {
    setAllCustomerTypesChecked(checked);
    if (checked) {
      setSelectedCustomerTypes(getAvailableCustomerTypes());
    } else {
      setSelectedCustomerTypes([]);
    }
  };

  // Handle individual customer type selection
  const handleCustomerTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomerTypes([...selectedCustomerTypes, type]);
      // Check if all types are now selected
      if (selectedCustomerTypes.length + 1 === getAvailableCustomerTypes().length) {
        setAllCustomerTypesChecked(true);
      }
    } else {
      setSelectedCustomerTypes(selectedCustomerTypes.filter(t => t !== type));
      setAllCustomerTypesChecked(false);
    }
  };

  // Sample ticket rates data with Customer Type
  const [ticketRatesData, setTicketRatesData] = useState<TicketRate[]>([
    {
      id: 1,
      rateId: 'RATE-001',
      ticketType: 'Market',
      customerType: 'Hawker',
      location: 'Central Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 2.00,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 2,
      rateId: 'RATE-002',
      ticketType: 'Market',
      customerType: 'Table-Top',
      location: 'Central Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 3.00,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 3,
      rateId: 'RATE-003',
      ticketType: 'Market',
      customerType: 'Stall',
      location: 'Central Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 5.00,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 4,
      rateId: 'RATE-004',
      ticketType: 'Market',
      customerType: 'Hawker',
      location: 'Kejetia Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 2.50,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 5,
      rateId: 'RATE-005',
      ticketType: 'Market',
      customerType: 'Table-Top',
      location: 'Kejetia Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 3.50,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 6,
      rateId: 'RATE-006',
      ticketType: 'Market',
      customerType: 'Stall',
      location: 'Kejetia Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 6.00,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'MARY SERWAA',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 7,
      rateId: 'RATE-007',
      ticketType: 'Lorry Park',
      customerType: 'Taxi',
      location: 'Kejetia Lorry Park',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 2.00,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 8,
      rateId: 'RATE-008',
      ticketType: 'Lorry Park',
      customerType: 'Trotro',
      location: 'Asafo Lorry Park',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 1.50,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '25 Jun 2025 10:30 AM'
    },
    {
      id: 9,
      rateId: 'RATE-009',
      ticketType: 'Lorry Park',
      customerType: 'Private',
      location: 'Tech Junction Station',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 2.50,
      unit: 'per day',
      effectiveDate: '01 Jul 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'JOHN DOE',
      createdDate: '28 Jul 2025 2:45 PM'
    },
    {
      id: 10,
      rateId: 'RATE-010',
      ticketType: 'Market',
      customerType: 'Hawker',
      location: 'Central Market',
      frequency: 'Daily',
      rateType: 'Fixed',
      amount: 1.50,
      unit: 'per day',
      effectiveDate: '01 Jan 2025',
      expiryDate: '30 Jun 2025',
      status: 'Inactive',
      createdBy: 'AEDA Admin',
      createdDate: '15 Dec 2024 9:15 AM'
    },
    {
      id: 11,
      rateId: 'RATE-011',
      ticketType: 'Market',
      customerType: 'Stall',
      location: 'Bantama Market',
      frequency: 'Weekly',
      rateType: 'Fixed',
      amount: 30.00,
      unit: 'per week',
      effectiveDate: '01 Aug 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'MARY SERWAA',
      createdDate: '20 Jul 2025 3:20 PM'
    },
    {
      id: 12,
      rateId: 'RATE-012',
      ticketType: 'Lorry Park',
      customerType: 'Trotro',
      location: 'Atonsu Station',
      frequency: 'Daily',
      rateType: 'Variable',
      amount: 3.00,
      unit: 'Spot Charge',
      effectiveDate: '01 Sep 2025',
      expiryDate: null,
      status: 'Active',
      createdBy: 'AEDA Admin',
      createdDate: '20 Aug 2025 11:00 AM'
    },
  ]);

  // Sort function
  const handleSort = (key: keyof TicketRate) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and search logic
  const filteredRates = ticketRatesData.filter(rate => {
    const matchesSearch = searchTerm === '' || 
      rate.rateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || rate.ticketType === filterType;
    const matchesStatus = filterStatus === 'All' || rate.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Sort filtered data
  const sortedRates = [...filteredRates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedRates.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRates = sortedRates.slice(startIdx, startIdx + itemsPerPage);

  const handleExport = (format: string) => {
    console.log(`Exporting to ${format}`);
    // Implement export functionality
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'Hawker':
        return 'bg-yellow-100 text-yellow-800';
      case 'Table-Top':
        return 'bg-blue-100 text-blue-800';
      case 'Stall':
        return 'bg-purple-100 text-purple-800';
      case 'Taxi':
        return 'bg-orange-100 text-orange-800';
      case 'Trotro':
        return 'bg-green-100 text-green-800';
      case 'Private':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRate = (newRate: Partial<TicketRate>) => {
    // Check for existing active rate with same Customer Type, Ticket Type, Location, and Amount
    const existingRate = ticketRatesData.find(rate => 
      rate.status === 'Active' &&
      rate.customerType === newRate.customerType &&
      rate.ticketType === newRate.ticketType &&
      rate.location === newRate.location
    );

    if (existingRate) {
      // Update existing rate to inactive with expiry date
      const updatedRates = ticketRatesData.map(rate => {
        if (rate.id === existingRate.id) {
          return {
            ...rate,
            expiryDate: new Date().toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }).replace(',', '').replace(/^(\d{1})\s/, '0$1 '),
            status: 'Inactive' as const
          };
        }
        return rate;
      });

      // Add new rate
      const newRateEntry: TicketRate = {
        id: Math.max(...ticketRatesData.map(r => r.id)) + 1,
        rateId: `RATE-${String(Math.max(...ticketRatesData.map(r => r.id)) + 1).padStart(3, '0')}`,
        ticketType: newRate.ticketType as 'Market' | 'Lorry Park',
        customerType: newRate.customerType as any,
        location: newRate.location || '',
        frequency: newRate.frequency || 'Daily',
        rateType: newRate.rateType || 'Fixed',
        amount: newRate.amount || 0,
        unit: newRate.unit || 'per day',
        effectiveDate: new Date().toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).replace(',', '').replace(/^(\d{1})\s/, '0$1 '),
        expiryDate: null,
        status: 'Active',
        createdBy: 'Current User',
        createdDate: new Date().toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).replace(',', '').replace(/^(\d{1})\s/, '0$1 ') + ' ' + new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
      };

      setTicketRatesData([...updatedRates, newRateEntry]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ticket Rates Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage ticketing rates for markets and lorry parks by customer type</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddRateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Rate
            </button>
            <button 
              onClick={() => setShowBulkAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Add Rates
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Rates</p>
                <p className="text-2xl font-bold mt-1">
                  {ticketRatesData.filter(r => r.status === 'Active').length}
                </p>
              </div>
              <div className="text-green-200 text-3xl font-bold">GHS</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Rates</p>
                <p className="text-2xl font-bold mt-1">
                  {ticketRatesData.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Markets</p>
                <p className="text-2xl font-bold mt-1">
                  {new Set(ticketRatesData.filter(r => r.ticketType === 'Market').map(r => r.location)).size}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Lorry Parks</p>
                <p className="text-2xl font-bold mt-1">
                  {new Set(ticketRatesData.filter(r => r.ticketType === 'Lorry Park').map(r => r.location)).size}
                </p>
              </div>
              <Bus className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search rates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <ModernSelect
                placeholder="All Types"
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'Market', label: 'Markets Only' },
                  { value: 'Lorry Park', label: 'Lorry Parks Only' }
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value as any)}
                className="w-48"
                showClear={false}
              />

              <ModernSelect
                placeholder="All Status"
                options={[
                  { value: 'All', label: 'All Status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as any)}
                className="w-40"
                showClear={false}
              />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('copy')}
              className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <File className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Automatic Rate Management</p>
            <p className="mt-1">When a new rate is created for an existing Customer Type, Location, and Ticket Type combination, the previous rate is automatically expired and marked as inactive.</p>
          </div>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[70px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rateId')}
                >
                  <div className="flex items-center gap-1">
                    Rate ID
                    {sortConfig.key === 'rateId' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ticketType')}
                >
                  <div className="flex items-center gap-1">
                    Ticket Type
                    {sortConfig.key === 'ticketType' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center gap-1">
                    Location
                    {sortConfig.key === 'location' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[90px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerType')}
                >
                  <div className="flex items-center gap-1">
                    Customer Type
                    {sortConfig.key === 'customerType' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[70px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('frequency')}
                >
                  <div className="flex items-center gap-1">
                    Frequency
                    {sortConfig.key === 'frequency' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[70px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rateType')}
                >
                  <div className="flex items-center gap-1">
                    Rate Type
                    {sortConfig.key === 'rateType' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[60px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    {sortConfig.key === 'amount' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('unit')}
                >
                  <div className="flex items-center gap-1">
                    Unit
                    {sortConfig.key === 'unit' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[90px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('effectiveDate')}
                >
                  <div className="flex items-center gap-1">
                    Effective Date
                    {sortConfig.key === 'effectiveDate' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[90px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('expiryDate')}
                >
                  <div className="flex items-center gap-1">
                    Expiry Date
                    {sortConfig.key === 'expiryDate' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[60px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortConfig.key === 'status' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdBy')}
                >
                  <div className="flex items-center gap-1">
                    Created By
                    {sortConfig.key === 'createdBy' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] max-w-[80px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdDate')}
                >
                  <div className="flex items-center gap-1">
                    Created Date
                    {sortConfig.key === 'createdDate' && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <span className="text-xs font-medium text-gray-900">{rate.rateId}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                      rate.ticketType === 'Market' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rate.ticketType === 'Market' ? (
                        <Building2 className="w-3 h-3" />
                      ) : (
                        <Bus className="w-3 h-3" />
                      )}
                      {rate.ticketType}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-900 break-words max-w-[120px]">{rate.location}</div>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCustomerTypeColor(rate.customerType)}`}>
                      {rate.customerType}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-xs text-gray-900">{rate.frequency}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-xs text-gray-900">{rate.rateType}</span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs font-semibold text-gray-900">
                      {rate.unit === 'Spot Charge' ? (
                        '-'
                      ) : (
                        <>GHS {rate.amount.toFixed(2)}</>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-xs text-gray-500 break-words">{rate.unit}</span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-900 break-words">{rate.effectiveDate}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-900 break-words">{rate.expiryDate || '-'}</div>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(rate.status)}`}>
                      {rate.status === 'Active' && <Clock className="w-2 h-2 mr-0.5" />}
                      {rate.status}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-900 break-words max-w-[100px]">{rate.createdBy}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-gray-900 break-words max-w-[80px]">{rate.createdDate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, sortedRates.length)} of{' '}
              {sortedRates.length} rates
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Rate Modal */}
      {showAddRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Rate</h3>
              <button
                onClick={() => {
                  setShowAddRateModal(false);
                  setSelectedTicketType('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select Ticket Type"
                  options={[
                    { value: 'Market', label: 'Market' },
                    { value: 'Lorry Park', label: 'Lorry Park' }
                  ]}
                  value={selectedTicketType}
                  onChange={(value) => {
                    setSelectedTicketType(value as 'Market' | 'Lorry Park' | '');
                    setFormCustomerType('');
                    setFormLocation('');
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select Customer Type"
                  options={
                    selectedTicketType === 'Market' ? [
                      { value: 'Hawker', label: 'Hawker' },
                      { value: 'Table-Top', label: 'Table-Top' },
                      { value: 'Stall', label: 'Stall' }
                    ] : selectedTicketType === 'Lorry Park' ? [
                      { value: 'Taxi', label: 'Taxi' },
                      { value: 'Trotro', label: 'Trotro' },
                      { value: 'Private', label: 'Private' }
                    ] : []
                  }
                  value={formCustomerType}
                  onChange={setFormCustomerType}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select Location"
                  options={
                    selectedTicketType === 'Market' ? [
                      { value: 'Central Market', label: 'Central Market' },
                      { value: 'Kejetia Market', label: 'Kejetia Market' },
                      { value: 'Bantama Market', label: 'Bantama Market' },
                      { value: 'Asafo Market', label: 'Asafo Market' },
                      { value: 'Suame Magazine', label: 'Suame Magazine' }
                    ] : selectedTicketType === 'Lorry Park' ? [
                      { value: 'Kejetia Lorry Park', label: 'Kejetia Lorry Park' },
                      { value: 'Asafo Lorry Park', label: 'Asafo Lorry Park' },
                      { value: 'Tech Junction Station', label: 'Tech Junction Station' },
                      { value: 'Adum Station', label: 'Adum Station' },
                      { value: 'Atonsu Station', label: 'Atonsu Station' }
                    ] : []
                  }
                  value={formLocation}
                  onChange={setFormLocation}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Rate Type"
                    options={[
                      { value: 'Fixed', label: 'Fixed' },
                      { value: 'Variable', label: 'Variable' }
                    ]}
                    value={formRateType}
                    onChange={setFormRateType}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Frequency"
                    options={[
                      { value: 'Daily', label: 'Daily' },
                      { value: 'Weekly', label: 'Weekly' },
                      { value: 'Monthly', label: 'Monthly' }
                    ]}
                    value={formFrequency}
                    onChange={setFormFrequency}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (GHS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Unit"
                    options={[
                      { value: 'per day', label: 'Per Day' },
                      { value: 'per week', label: 'Per Week' },
                      { value: 'per month', label: 'Per Month' },
                      { value: 'spot charge', label: 'Spot Charge' }
                    ]}
                    value={formUnit}
                    onChange={setFormUnit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formEffectiveDate}
                      onChange={(e) => setFormEffectiveDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 shadow-sm cursor-pointer"
                      placeholder="dd/mm/yyyy"
                    />
                    {formEffectiveDate && (
                      <div className="mt-1 text-sm text-gray-600">
                        Selected: {formatDateDisplay(formEffectiveDate)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
                    disabled
                    placeholder="Auto-set when replaced"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Auto-set when replaced
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> If a rate already exists for this Customer Type, Location, and Ticket Type combination, the existing rate will be automatically expired and marked as inactive.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddRateModal(false);
                    setSelectedTicketType('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Rate
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Rates Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bulk Add Rates</h3>
              <button
                onClick={() => {
                  setShowBulkAddModal(false);
                  setSelectedTicketType('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Select a location and multiple customer types to apply the same rate settings to all of them at once.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select Ticket Type"
                  options={[
                    { value: 'Market', label: 'Market' },
                    { value: 'Lorry Park', label: 'Lorry Park' }
                  ]}
                  value={selectedTicketType}
                  onChange={(value) => {
                    setSelectedTicketType(value as 'Market' | 'Lorry Park' | '');
                    // Reset selections when ticket type changes
                    setSelectedLocations([]);
                    setSelectedCustomerTypes([]);
                    setAllLocationsChecked(false);
                    setAllCustomerTypesChecked(false);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Locations <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-3 space-y-1 max-h-48 overflow-y-auto bg-gray-50">
                  {selectedTicketType && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded font-semibold border-b border-gray-200 mb-2 bg-white">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={allLocationsChecked}
                        onChange={(e) => handleSelectAllLocations(e.target.checked)}
                      />
                      <span className="text-sm text-blue-700">All Locations</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        ({selectedLocations.length}/{getAvailableLocations().length} selected)
                      </span>
                    </label>
                  )}
                  {selectedTicketType && getAvailableLocations().map((location) => (
                    <label 
                      key={location}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 pl-8 rounded transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => handleLocationChange(location, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                  {!selectedTicketType && (
                    <p className="text-sm text-gray-500 italic p-2">Select a ticket type first</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer Types <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto bg-gray-50">
                  {selectedTicketType && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded font-semibold border-b border-gray-200 mb-2 bg-white">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={allCustomerTypesChecked}
                        onChange={(e) => handleSelectAllCustomerTypes(e.target.checked)}
                      />
                      <span className="text-sm text-blue-700">All Customer Types</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        ({selectedCustomerTypes.length}/{getAvailableCustomerTypes().length} selected)
                      </span>
                    </label>
                  )}
                  {selectedTicketType && getAvailableCustomerTypes().map((type) => (
                    <label 
                      key={type}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 pl-8 rounded transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedCustomerTypes.includes(type)}
                        onChange={(e) => handleCustomerTypeChange(type, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                  {!selectedTicketType && (
                    <p className="text-sm text-gray-500 italic p-2">Select a ticket type first</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Rate Type"
                    options={[
                      { value: 'Fixed', label: 'Fixed' },
                      { value: 'Variable', label: 'Variable' }
                    ]}
                    value={bulkRateType}
                    onChange={setBulkRateType}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Frequency"
                    options={[
                      { value: 'Daily', label: 'Daily' },
                      { value: 'Weekly', label: 'Weekly' },
                      { value: 'Monthly', label: 'Monthly' }
                    ]}
                    value={bulkFrequency}
                    onChange={setBulkFrequency}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (GHS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select Unit"
                    options={[
                      { value: 'per day', label: 'Per Day' },
                      { value: 'per week', label: 'Per Week' },
                      { value: 'per month', label: 'Per Month' },
                      { value: 'spot charge', label: 'Spot Charge' }
                    ]}
                    value={bulkUnit}
                    onChange={setBulkUnit}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={bulkEffectiveDate}
                    onChange={(e) => setBulkEffectiveDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 shadow-sm cursor-pointer"
                    placeholder="dd/mm/yyyy"
                  />
                  {bulkEffectiveDate && (
                    <div className="mt-1 text-sm text-gray-600">
                      Selected: {formatDateDisplay(bulkEffectiveDate)}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will create multiple rate entries - one for each combination of selected location and customer type. For example, selecting 2 locations and 3 customer types will create 6 rate entries. Existing rates for the same combinations will be automatically expired.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowBulkAddModal(false);
                    setSelectedTicketType('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Bulk Rates
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};