'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, CheckCircle, X } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load customer data and related options
  useEffect(() => {
    const fetchData = async () => {
      if (!customerId || !user?.['assembly-id']) return;

      setIsFetching(true);
      setFetchError(null);

      try {
        const assemblyId = user['assembly-id'];

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
      } catch (error: any) {
        console.error('Error fetching customer data:', error);
        setFetchError(error.message || 'Failed to load customer data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [customerId, user]);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    // Required fields validation
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.locationId.trim()) newErrors.locationId = 'Location is required';
    if (!formData.customerTypeId.trim()) newErrors.customerTypeId = 'Customer type is required';

    // Phone validation (basic)
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 Saving customer data:', formData);

      // Call API to update customer
      await updateCustomer(customerId, {
        phone: formData.phone,
        'alt-phone': formData.altPhone,
        identifier: formData.identifier,
        'location-id': formData.locationId,
        'customer-type-id': formData.customerTypeId,
        'gps-latitude': formData.gpsLatitude ? parseFloat(formData.gpsLatitude) : undefined,
        'gps-longitude': formData.gpsLongitude ? parseFloat(formData.gpsLongitude) : undefined
      });

      console.log('✅ Customer updated successfully');
      onSave?.(formData);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('❌ Error updating customer:', error);
      setErrors({ general: error.message || 'Failed to update customer' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    console.log('❌ Closing success modal');
    setShowSuccessModal(false);
    onBack?.() || window.history.back();
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Success!</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Customer Successfully Updated
          </h3>
          <p className="text-gray-600 mb-6">
            The customer <strong>{originalCustomer?.name || formData.identifier}</strong> has been successfully updated in the system.
          </p>

          {/* Customer details summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Customer:</span>
                <p className="text-gray-900">{originalCustomer?.name || formData.identifier}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Phone:</span>
                <p className="text-gray-900">{formData.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Location:</span>
                <p className="text-gray-900">{locations.find(l => l.id === formData.locationId)?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Customer Type:</span>
                <p className="text-gray-900">{customerTypes.find(ct => ct.id === formData.customerTypeId)?.name || 'N/A'}</p>
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

  console.log('📝 Main form page rendering. showSuccessModal:', showSuccessModal);

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-t-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold">Edit Customer</h1>
                  <p className="text-blue-100 text-sm mt-1">Update customer information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-b-2xl shadow-lg p-6">
            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : fetchError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">{fetchError}</p>
              </div>
            ) : (
              <>
                {errors.general && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Alt Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.altPhone}
                      onChange={(e) => handleInputChange('altPhone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter alternate phone number"
                    />
                  </div>

                  {/* Identifier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identifier
                    </label>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => handleInputChange('identifier', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter identifier"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <ModernSelect
                      placeholder="Select Location"
                      options={locations.map(l => ({ value: l.id, label: l.name }))}
                      value={formData.locationId}
                      onChange={(value) => handleInputChange('locationId', value)}
                    />
                    {errors.locationId && (
                      <p className="mt-1 text-sm text-red-500">{errors.locationId}</p>
                    )}
                  </div>

                  {/* Customer Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Type <span className="text-red-500">*</span>
                    </label>
                    <ModernSelect
                      placeholder="Select Customer Type"
                      options={customerTypes.map(ct => ({ value: ct.id, label: ct.name }))}
                      value={formData.customerTypeId}
                      onChange={(value) => handleInputChange('customerTypeId', value)}
                    />
                    {errors.customerTypeId && (
                      <p className="mt-1 text-sm text-red-500">{errors.customerTypeId}</p>
                    )}
                  </div>

                  {/* GPS Coordinates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPS Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.gpsLatitude}
                        onChange={(e) => handleInputChange('gpsLatitude', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., 5.6037"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPS Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.gpsLongitude}
                        onChange={(e) => handleInputChange('gpsLongitude', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., -0.1870"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
