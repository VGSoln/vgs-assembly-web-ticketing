'use client'
import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageSquare, DollarSign, Edit, User, MapPin, Calendar, Clock, Mail, Hash, Home, Navigation, ChevronLeft, Briefcase, CreditCard, Activity } from 'lucide-react';
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

  // Generate initials for avatar
  const initials = customerData.name.split(' ').map(n => n[0]).join('').toUpperCase();

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
    <div className="p-6 bg-gray-50 min-h-screen">
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
                <h1 className="text-xl font-bold text-gray-900">Customer Detail Information</h1>
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
                  Log Call
                </button>
                <button 
                  onClick={handleNotifyViaText}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send SMS
                </button>
                <button 
                  onClick={handleReceivePayment}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="text-sm font-bold">₵</span>
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
            <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg">
              <User className="w-3.5 h-3.5 mr-1.5" />
              Customer Profile
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6">
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
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{initials}</span>
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
            </div>

            {/* Account Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Meter Number */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Meter Number
                  </label>
                  <p className="text-sm font-medium text-gray-900 font-mono">{customerData.meterNumber}</p>
                </div>

                {/* Meter Type */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Meter Type
                  </label>
                  <p className="text-sm font-medium text-gray-900">{customerData.meterType}</p>
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

            {/* Location Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                      Address
                    </label>
                    <p className="text-sm font-medium text-gray-900">{customerData.address}</p>
                  </div>
                </div>
                <div className="flex gap-4 md:col-span-2">
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                      Latitude
                    </label>
                    <p className="text-sm font-medium text-gray-900 font-mono">{customerData.latitude}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                      Longitude
                    </label>
                    <p className="text-sm font-medium text-gray-900 font-mono">{customerData.longitude}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Billing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Balance</span>
                  <span className="text-sm font-medium text-gray-900">GHS {customerData.accountBalance}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment Date</span>
                  <span className="text-sm font-medium text-gray-900">{customerData.lastPaymentDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment Amount</span>
                  <span className="text-sm font-medium text-gray-900">GHS {customerData.lastPaymentAmount}</span>
                </div>
              </div>
            </div>

            {/* Audit Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
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
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Payment Received Successfully"
        message={`Payment has been recorded for customer ${customerData.name}. A receipt has been generated and sent via SMS to ${customerData.phone}.`}
        type="success"
        autoClose={true}
        autoCloseDelay={10000}
      />

      <ConfirmationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        title="SMS Notification Sent"
        message={`An SMS notification has been sent to ${customerData.name} at ${customerData.phone}.`}
        type="success"
        autoClose={true}
        autoCloseDelay={10000}
      />
    </div>
  );
};