import React, { useState } from 'react';
import { X, User, Phone, Hash, AlertCircle, CheckCircle } from 'lucide-react';

interface ReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerNumber: string;
  customerName: string;
  customerPhone: string;
  meterNumber: string;
  onConfirm: (reason: string) => void;
}

export const ReactivationModal: React.FC<ReactivationModalProps> = ({
  isOpen,
  onClose,
  customerNumber,
  customerName,
  customerPhone,
  meterNumber,
  onConfirm
}) => {
  const [confirmCustomerNumber, setConfirmCustomerNumber] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [reactivationReason, setReactivationReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState({
    customerNumber: '',
    phone: '',
    reason: ''
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      customerNumber: '',
      phone: '',
      reason: ''
    };

    if (confirmCustomerNumber !== customerNumber) {
      newErrors.customerNumber = 'Customer number does not match';
    }
    if (!confirmCustomerNumber) {
      newErrors.customerNumber = 'Customer number is required';
    }

    if (confirmPhone !== customerPhone) {
      newErrors.phone = 'Phone number does not match';
    }
    if (!confirmPhone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!reactivationReason.trim()) {
      newErrors.reason = 'Reactivation reason is required';
    }

    setErrors(newErrors);
    return !newErrors.customerNumber && !newErrors.phone && !newErrors.reason;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleFinalConfirm = () => {
    onConfirm(reactivationReason);
    handleClose();
  };

  const handleClose = () => {
    setConfirmCustomerNumber('');
    setConfirmPhone('');
    setReactivationReason('');
    setShowConfirmDialog(false);
    setErrors({ customerNumber: '', phone: '', reason: '' });
    onClose();
  };

  return (
    <>
      {/* Main Reactivation Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
            onClick={handleClose}
          />

          <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Customer Reactivation
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                {/* Customer Information Display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer #:</span>
                      <p className="font-medium text-gray-900">{customerNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-900">{customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Meter #:</span>
                      <p className="font-medium text-gray-900">{meterNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Hash className="inline w-4 h-4 mr-1" />
                      Confirm Customer Number *
                    </label>
                    <input
                      type="text"
                      value={confirmCustomerNumber}
                      onChange={(e) => setConfirmCustomerNumber(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter customer number to confirm"
                    />
                    {errors.customerNumber && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.customerNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Confirm Phone Number *
                    </label>
                    <input
                      type="text"
                      value={confirmPhone}
                      onChange={(e) => setConfirmPhone(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number to confirm"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Reactivation *
                    </label>
                    <textarea
                      value={reactivationReason}
                      onChange={(e) => setReactivationReason(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.reason ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Enter the reason for reactivating this customer account..."
                    />
                    {errors.reason && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    Please verify all information carefully before proceeding with reactivation.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm"
                >
                  Proceed to Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={() => setShowConfirmDialog(false)}
            />

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-6 py-5">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Confirm Reactivation
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  Are you sure you want to reactivate this customer account?
                </p>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{customerName}</p>
                  <p className="text-xs text-gray-600">Customer #: {customerNumber}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-medium">Reason:</span> {reactivationReason}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm"
                  >
                    Confirm Reactivation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};