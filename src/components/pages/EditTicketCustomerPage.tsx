'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Briefcase, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface TicketCustomerFormData {
  // Personal Information
  name: string;
  phone: string;
  identifier: string; // Trader Type or License Plate
  address: string;
  email: string;
  latitude: string;
  longitude: string;
  
  // Account Information
  customerNumber: string;
  ticketType: string; // Market or Lorry Park
  location: string; // Market/Lorry Park Name
  
  // Locations
  community: string;
  zone: string;
  
  // Payment Information (read-only)
  totalTicketTransactions: number;
  lastPaymentAmount: string;
  lastPaymentDate: string;
  
  // Audit Information (read-only)
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

interface EditTicketCustomerPageProps {
  customerId?: string;
  onBack?: () => void;
  onSave?: (customerData: TicketCustomerFormData) => void;
}

export const EditTicketCustomerPage: React.FC<EditTicketCustomerPageProps> = ({ 
  customerId = 'TKT-001784',
  onBack, 
  onSave 
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Initialize with existing customer data matching the image
  const [formData, setFormData] = useState<TicketCustomerFormData>({
    // Personal Information
    name: 'TKT-001784',
    phone: '0244304995',
    identifier: 'Stall',
    address: '',
    email: '',
    latitude: '5.78441568',
    longitude: '-0.16486985',
    
    // Account Information
    customerNumber: 'TKT-001784',
    ticketType: 'Market',
    location: 'Central Market',
    
    // Locations
    community: 'Adum',
    zone: 'Zone A',
    
    // Payment Information (read-only)
    totalTicketTransactions: 45,
    lastPaymentAmount: '120.00',
    lastPaymentDate: '15 May 2025 3:45 PM',
    
    // Audit Information (read-only)
    createdDate: '01 November 2024 2:30 PM',
    createdBy: 'AEDA Admin',
    lastModifiedDate: '11 June 2025 9:15 AM',
    lastModifiedBy: 'MARY SERWAA'
  });

  const [errors, setErrors] = useState<Partial<TicketCustomerFormData>>({});

  // Load customer data based on customerId
  useEffect(() => {
    // In a real app, this would fetch data from an API
    console.log('Loading ticket customer data for ID:', customerId);
  }, [customerId]);

  const ticketTypeOptions = [
    { value: 'Market', label: 'Market' },
    { value: 'Lorry Park', label: 'Lorry Park' }
  ];

  const identifierOptions = formData.ticketType === 'Market' ? [
    { value: 'Hawker', label: 'Hawker' },
    { value: 'Table-Top', label: 'Table-Top' },
    { value: 'Stall', label: 'Stall' }
  ] : [];

  const zoneOptions = [
    { value: 'Zone A', label: 'Zone A' },
    { value: 'Zone B', label: 'Zone B' },
    { value: 'Zone C', label: 'Zone C' },
    { value: 'Zone D', label: 'Zone D' },
  ];

  // Location options based on Ticket Type
  const marketLocationOptions = [
    { value: 'Central Market', label: 'Central Market' },
    { value: 'Kejetia Market', label: 'Kejetia Market' },
    { value: 'Bantama Market', label: 'Bantama Market' },
    { value: 'Asafo Market', label: 'Asafo Market' },
    { value: 'Adum Market', label: 'Adum Market' },
    { value: 'Race Course Market', label: 'Race Course Market' },
  ];

  const lorryParkLocationOptions = [
    { value: 'Kejetia Lorry Park', label: 'Kejetia Lorry Park' },
    { value: 'Asafo Lorry Park', label: 'Asafo Lorry Park' },
    { value: 'Tech Junction Station', label: 'Tech Junction Station' },
    { value: 'Atonsu Station', label: 'Atonsu Station' },
    { value: 'Sofoline Station', label: 'Sofoline Station' },
    { value: 'Bantama Station', label: 'Bantama Station' },
  ];

  const locationOptions = formData.ticketType === 'Market' ? marketLocationOptions : lorryParkLocationOptions;

  const handleInputChange = (field: keyof TicketCustomerFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear identifier and location when switching ticket type
    if (field === 'ticketType' && value !== formData.ticketType) {
      setFormData(prev => ({ ...prev, identifier: '', location: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketCustomerFormData> = {};

    // Required fields validation (matching the image requirements)
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.identifier.trim()) newErrors.identifier = formData.ticketType === 'Market' ? 'Identifier is required' : 'License plate is required';
    if (!formData.ticketType.trim()) newErrors.ticketType = 'Ticket type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.community.trim()) newErrors.community = 'Community is required';
    if (!formData.zone.trim()) newErrors.zone = 'Zone is required';

    // Email validation (optional)
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saving ticket customer data:', formData);
      onSave?.(formData);
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onBack?.();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Ticket Customer</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Customer Details</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Personal Information */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Personal Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  PHONE <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  IDENTIFIER <span className="text-red-500">*</span>
                </label>
                {formData.ticketType === 'Market' ? (
                  <ModernSelect
                    placeholder="Select identifier"
                    options={identifierOptions}
                    value={formData.identifier}
                    onChange={(value) => handleInputChange('identifier', value)}
                    error={!!errors.identifier}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => handleInputChange('identifier', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.identifier ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter license plate"
                  />
                )}
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  ADDRESS
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  GPS COORDINATES
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`Lat: ${formData.latitude}`}
                    onChange={(e) => handleInputChange('latitude', e.target.value.replace('Lat: ', ''))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Latitude"
                  />
                  <input
                    type="text"
                    value={`Long: ${formData.longitude}`}
                    onChange={(e) => handleInputChange('longitude', e.target.value.replace('Long: ', ''))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="border-b border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Account Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  CUSTOMER NUMBER
                </label>
                <input
                  type="text"
                  value={formData.customerNumber}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  TICKET TYPE <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select ticket type"
                  options={ticketTypeOptions}
                  value={formData.ticketType}
                  onChange={(value) => handleInputChange('ticketType', value)}
                  error={!!errors.ticketType}
                />
                {errors.ticketType && (
                  <p className="mt-1 text-sm text-red-500">{errors.ticketType}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  LOCATION <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder={formData.ticketType === 'Market' ? 'Select market' : 'Select lorry park'}
                  options={locationOptions}
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  error={!!errors.location}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="border-b border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                Locations
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  COMMUNITY <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.community}
                  onChange={(e) => handleInputChange('community', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.community ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter community"
                />
                {errors.community && (
                  <p className="mt-1 text-sm text-red-500">{errors.community}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  ZONE <span className="text-red-500">*</span>
                </label>
                <ModernSelect
                  placeholder="Select zone"
                  options={zoneOptions}
                  value={formData.zone}
                  onChange={(value) => handleInputChange('zone', value)}
                  error={!!errors.zone}
                />
                {errors.zone && (
                  <p className="mt-1 text-sm text-red-500">{errors.zone}</p>
                )}
              </div>
            </div>

            {/* Payment Information (Read-only) */}
            <div className="border-b border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Payment Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  TOTAL TICKET TRANSACTIONS
                </label>
                <input
                  type="text"
                  value={formData.totalTicketTransactions}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  LAST PAYMENT
                </label>
                <input
                  type="text"
                  value={`GHS ${formData.lastPaymentAmount}`}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  PAYMENT DATE
                </label>
                <input
                  type="text"
                  value={formData.lastPaymentDate}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Audit Information (Read-only) */}
            <div className="border-b border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Audit Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    CREATED
                  </label>
                  <input
                    type="text"
                    value={formData.createdDate}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    CREATED BY
                  </label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    LAST MODIFIED
                  </label>
                  <input
                    type="text"
                    value={formData.lastModifiedDate}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    LAST MODIFIED BY
                  </label>
                  <input
                    type="text"
                    value={formData.lastModifiedBy}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Customer Updated Successfully
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                The ticket customer information has been updated successfully.
              </p>
              <button
                onClick={handleSuccessModalClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};