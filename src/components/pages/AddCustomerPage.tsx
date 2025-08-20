'use client'
import React, { useState } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Calendar, Gauge, Building2, CreditCard, CheckCircle, X } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { CustomerReviewPage } from './CustomerReviewPage';
import { 
  businessLevelOptions, 
  zoneOptions
} from '@/lib/data';

interface CustomerFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  region: string;
  zone: string;
  address: string;
  city: string;
  customerType: string;
  billingCycle: string;
  meterNumber: string;
  meterType: string;
  manufacturer: string;
  modelNumber: string;
  installationDate: string;
  initialReading: string;
}

interface AddCustomerPageProps {
  onBack?: () => void;
  onSave?: (customerData: CustomerFormData) => void;
}

export const AddCustomerPage: React.FC<AddCustomerPageProps> = ({ onBack, onSave }) => {
  const [showReview, setShowReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    region: '',
    zone: '',
    address: '',
    city: '',
    customerType: '',
    billingCycle: '',
    meterNumber: '',
    meterType: '',
    manufacturer: '',
    modelNumber: '',
    installationDate: '',
    initialReading: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

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
    
    // Reset form data
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      region: '',
      zone: '',
      address: '',
      city: '',
      customerType: '',
      billingCycle: '',
      meterNumber: '',
      meterType: '',
      manufacturer: '',
      modelNumber: '',
      installationDate: '',
      initialReading: ''
    });
    setShowReview(false);
    onBack?.();
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
            New Customer Successfully Created
          </h3>
          <p className="text-gray-600 mb-6">
            The customer <strong>{formData.firstName} {formData.lastName}</strong> has been successfully added to the system.
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
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
              <p className="text-sm text-gray-500 mt-1">Fill in the customer information below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter middle name"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Contact Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Momo) Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone (Momo) number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.region}
                    onChange={(value) => handleInputChange('region', value)}
                    placeholder="Select Business Level"
                    options={businessLevelOptions}
                    className="w-full"
                  />
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.zone}
                    onChange={(value) => handleInputChange('zone', value)}
                    placeholder="Select Zone"
                    options={zoneOptions}
                    className="w-full"
                  />
                  {errors.zone && <p className="text-red-500 text-sm mt-1">{errors.zone}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Type & Billing Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Customer Type & Billing</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.customerType}
                    onChange={(value) => handleInputChange('customerType', value)}
                    placeholder="Select Customer Type"
                    options={customerTypeOptions}
                    className="w-full"
                  />
                  {errors.customerType && <p className="text-red-500 text-sm mt-1">{errors.customerType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.billingCycle}
                    onChange={(value) => handleInputChange('billingCycle', value)}
                    placeholder="Select Billing Cycle"
                    options={billingCycleOptions}
                    className="w-full"
                  />
                  {errors.billingCycle && <p className="text-red-500 text-sm mt-1">{errors.billingCycle}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Meter Information</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meterNumber}
                    onChange={(e) => handleInputChange('meterNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.meterNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter meter number"
                  />
                  {errors.meterNumber && <p className="text-red-500 text-sm mt-1">{errors.meterNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.meterType}
                    onChange={(value) => handleInputChange('meterType', value)}
                    placeholder="Select Meter Type"
                    options={meterTypeOptions}
                    className="w-full"
                  />
                  {errors.meterType && <p className="text-red-500 text-sm mt-1">{errors.meterType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter manufacturer"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model Number</label>
                    <input
                      type="text"
                      value={formData.modelNumber}
                      onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter model number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Installation Date</label>
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => handleInputChange('installationDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Reading <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.initialReading}
                      onChange={(e) => handleInputChange('initialReading', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.initialReading ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter initial reading"
                      min="0"
                    />
                    {errors.initialReading && <p className="text-red-500 text-sm mt-1">{errors.initialReading}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Review & Save
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};