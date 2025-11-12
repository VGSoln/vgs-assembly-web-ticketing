'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Calendar, Gauge, Building2, CreditCard, CheckCircle, X } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { CustomerReviewPage } from './CustomerReviewPage';
import { getCustomer, updateCustomer, getLocations, getCustomerTypes } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerFormData {
  phone: string;
  altPhone: string;
  identifier: string;
  locationId: string;
  customerTypeId: string;
  gpsLatitude: string;
  gpsLongitude: string;
}

interface EditCustomerPageProps {
  customerId: string;
  onSave?: (customerData: CustomerFormData) => void;
  onBack?: () => void;
}

export const EditCustomerPage: React.FC<EditCustomerPageProps> = ({
  customerId,
  onSave,
  onBack
}) => {
  const { user } = useAuth();
  const [originalCustomer, setOriginalCustomer] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [customerTypes, setCustomerTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState<CustomerFormData>({
    phone: '',
    altPhone: '',
    identifier: '',
    locationId: '',
    customerTypeId: '',
    gpsLatitude: '',
    gpsLongitude: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerFormData> & { general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load customer data and related options
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const assemblyId = user?.['assembly-id'];
        if (!assemblyId) {
          throw new Error('Assembly ID not found');
        }

        // Fetch customer data, locations, and customer types in parallel
        const [customerData, locationsData, customerTypesData] = await Promise.all([
          getCustomer(customerId),
          getLocations(assemblyId),
          getCustomerTypes(assemblyId)
        ]);

        setOriginalCustomer(customerData);
        setLocations(locationsData);
        setCustomerTypes(customerTypesData);

        setFormData({
          phone: customerData.phone || '',
          altPhone: customerData['alt-phone'] || '',
          identifier: customerData.identifier || '',
          locationId: customerData['location-id'] || '',
          customerTypeId: customerData['customer-type-id'] || '',
          gpsLatitude: customerData['gps-latitude']?.toString() || '',
          gpsLongitude: customerData['gps-longitude']?.toString() || ''
        });
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setFetchError('Failed to load customer data. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [customerId, user]);

  const customerTypeOptions = [
    { value: 'domestic', label: 'Domestic' },
    { value: 'non-residential', label: 'Non-Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const billingCycleOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'bi-annually', label: 'Bi-Annually' },
    { value: 'annually', label: 'Annually' }
  ];

  const meterTypeOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'digital', label: 'Digital' },
    { value: 'smart', label: 'Smart' },
    { value: 'ultrasonic', label: 'Ultrasonic' }
  ];

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone (Momo) number is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.zone.trim()) newErrors.zone = 'Zone is required';
    if (!formData.customerType.trim()) newErrors.customerType = 'Customer type is required';
    if (!formData.billingCycle.trim()) newErrors.billingCycle = 'Billing cycle is required';
    if (!formData.meterNumber.trim()) newErrors.meterNumber = 'Meter number is required';
    if (!formData.meterType.trim()) newErrors.meterType = 'Meter type is required';
    if (!formData.initialReading.trim()) newErrors.initialReading = 'Initial reading is required';
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone (Momo) number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setShowReview(true);
    }
  };

  const handleConfirmSave = () => {
    console.log('🔄 handleConfirmSave called');
    console.log('📋 Customer data:', formData);
    onSave?.(formData);
    
    // Show success modal
    console.log('✅ Setting showSuccessModal to true');
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    console.log('❌ Closing success modal');
    setShowSuccessModal(false);
    setShowReview(false);
    window.history.back();
  };

  // Helper function to format zone display
  const getZoneLabel = (value: string) => {
    const zoneMap: { [key: string]: string } = {
      'zone1': 'ZONE 1',
      'zone2': 'ZONE 2', 
      'zone3': 'ZONE 3',
      'zone4': 'ZONE 4',
      'zone5': 'ZONE 5',
      'zone6': 'ZONE 6'
    };
    return zoneMap[value] || value || 'Not provided';
  };

  // Success Modal Component
  const SuccessModal = () => {
    console.log('🎉 SuccessModal is rendering!');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Success!</h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Customer Successfully Updated
          </h3>
          <p className="text-gray-600 mb-6">
            The customer <strong>{formData.firstName} {formData.lastName}</strong> has been successfully updated in the system.
          </p>
          
          {/* Customer details summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Customer:</span>
                <p className="text-gray-900">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phone:</span>
                <p className="text-gray-900">{formData.phoneNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Zone:</span>
                <p className="text-gray-900">{getZoneLabel(formData.zone)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Meter #:</span>
                <p className="text-gray-900 font-mono">{formData.meterNumber}</p>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleSuccessModalClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Continue
          </button>
        </div>
      </div>
    </div>
    );
  };

  if (showReview) {
    console.log('📄 Review page rendering. showSuccessModal:', showSuccessModal);
    return (
      <>
        {/* Success Modal */}
        {showSuccessModal && <SuccessModal />}
        
        <CustomerReviewPage 
          customerData={formData}
          onBack={() => setShowReview(false)}
          onConfirm={handleConfirmSave}
          isEditMode={true}
        />
      </>
    );
  }

  console.log('📝 Main form page rendering. showSuccessModal:', showSuccessModal);
  
  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
      
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
              <p className="text-sm text-gray-500 mt-1">Update customer information for {customerId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative z-40">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Momo) Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="0240000000"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative z-30">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select region"
                    options={businessLevelOptions}
                    value={formData.region}
                    onChange={(value) => handleInputChange('region', value)}
                  />
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-500">{errors.region}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select zone"
                    options={zoneOptions}
                    value={formData.zone}
                    onChange={(value) => handleInputChange('zone', value)}
                  />
                  {errors.zone && (
                    <p className="mt-1 text-sm text-red-500">{errors.zone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative z-20">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Account Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select customer type"
                    options={customerTypeOptions}
                    value={formData.customerType}
                    onChange={(value) => handleInputChange('customerType', value)}
                  />
                  {errors.customerType && (
                    <p className="mt-1 text-sm text-red-500">{errors.customerType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select billing cycle"
                    options={billingCycleOptions}
                    value={formData.billingCycle}
                    onChange={(value) => handleInputChange('billingCycle', value)}
                  />
                  {errors.billingCycle && (
                    <p className="mt-1 text-sm text-red-500">{errors.billingCycle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative z-10">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Meter Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meterNumber}
                    onChange={(e) => handleInputChange('meterNumber', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.meterNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono`}
                    placeholder="Enter meter number"
                  />
                  {errors.meterNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.meterNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    placeholder="Select meter type"
                    options={meterTypeOptions}
                    value={formData.meterType}
                    onChange={(value) => handleInputChange('meterType', value)}
                  />
                  {errors.meterType && (
                    <p className="mt-1 text-sm text-red-500">{errors.meterType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Zenner, Itron"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model Number
                  </label>
                  <input
                    type="text"
                    value={formData.modelNumber}
                    onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter model number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installation Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => handleInputChange('installationDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Reading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.initialReading}
                    onChange={(e) => handleInputChange('initialReading', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.initialReading ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="0"
                  />
                  {errors.initialReading && (
                    <p className="mt-1 text-sm text-red-500">{errors.initialReading}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Customer
            </button>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};