'use client'
import React from 'react';
import { ArrowLeft, Check, Edit, User, Phone, Mail, MapPin, Building2, Gauge, Calendar } from 'lucide-react';

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

interface CustomerReviewPageProps {
  customerData: CustomerFormData;
  onConfirm: () => void;
  onEdit?: () => void;
}

export const CustomerReviewPage: React.FC<CustomerReviewPageProps> = ({ 
  customerData, 
  onConfirm, 
  onEdit 
}) => {
  const formatValue = (value: string, fallback: string = 'Not provided') => {
    return value.trim() || fallback;
  };

  const getFullName = () => {
    const parts = [customerData.firstName, customerData.middleName, customerData.lastName].filter(Boolean);
    return parts.join(' ') || 'Not provided';
  };

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

  const getCustomerTypeLabel = (value: string) => {
    const typeMap: { [key: string]: string } = {
      'domestic': 'Domestic',
      'non-residential': 'Non-Residential',
      'commercial': 'Commercial',
      'industrial': 'Industrial'
    };
    return typeMap[value] || value || 'Not provided';
  };

  const getMeterTypeLabel = (value: string) => {
    const meterMap: { [key: string]: string } = {
      'manual': 'Manual',
      'digital': 'Digital',
      'smart': 'Smart',
      'ultrasonic': 'Ultrasonic'
    };
    return meterMap[value] || value || 'Not provided';
  };

  const getBillingCycleLabel = (value: string) => {
    const cycleMap: { [key: string]: string } = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'bi-annually': 'Bi-Annually',
      'annually': 'Annually'
    };
    return cycleMap[value] || value || 'Not provided';
  };

  const formatDate = (date: string) => {
    if (!date) return 'Not provided';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  return (
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
              Back to Form
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Customer Information</h1>
              <p className="text-sm text-gray-500 mt-1">Please review the information below before saving</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Personal Information Review */}
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                  <p className="text-gray-900">{formatValue(customerData.firstName)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Middle Name</label>
                  <p className="text-gray-900">{formatValue(customerData.middleName)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <p className="text-gray-900">{formatValue(customerData.lastName)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Review */}
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone (Momo) Number</label>
                  <p className="text-gray-900 font-mono">{formatValue(customerData.phoneNumber)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-gray-900">{formatValue(customerData.email)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                  <p className="text-gray-900">{formatValue(customerData.region)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Zone</label>
                  <p className="text-gray-900 font-semibold">{getZoneLabel(customerData.zone)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                  <p className="text-gray-900">{formatValue(customerData.city)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="text-gray-900">{formatValue(customerData.address)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Type & Billing Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Customer Type & Billing</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer Type</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {getCustomerTypeLabel(customerData.customerType)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Billing Cycle</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {getBillingCycleLabel(customerData.billingCycle)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Meter Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Meter Number</label>
                  <p className="text-gray-900 font-mono font-semibold bg-gray-100 px-3 py-2 rounded">
                    {formatValue(customerData.meterNumber)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Meter Type</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      {getMeterTypeLabel(customerData.meterType)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Manufacturer</label>
                  <p className="text-gray-900">{formatValue(customerData.manufacturer)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Model Number</label>
                  <p className="text-gray-900 font-mono">{formatValue(customerData.modelNumber)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Installation Date</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(customerData.installationDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Initial Reading</label>
                  <p className="text-gray-900 font-semibold">
                    {customerData.initialReading ? `${customerData.initialReading} m³` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Check className="w-5 h-5" />
                Confirm & Save Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};