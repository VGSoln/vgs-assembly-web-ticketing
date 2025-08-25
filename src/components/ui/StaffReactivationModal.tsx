import React, { useState } from 'react';
import { X, User, Phone, Hash, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import { ModernSelect } from './ModernSelect';

interface StaffReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  staffPhone: string;
  staffEmail: string;
  onConfirm: (reason: string) => void;
}

export const StaffReactivationModal: React.FC<StaffReactivationModalProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  staffPhone,
  staffEmail,
  onConfirm
}) => {
  const [confirmStaffId, setConfirmStaffId] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [reactivationReason, setReactivationReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState({
    staffId: '',
    phone: '',
    reason: ''
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      staffId: '',
      phone: '',
      reason: ''
    };

    // Allow matching with or without leading zeros
    const normalizedConfirmId = confirmStaffId.replace(/^0+/, '');
    const normalizedStaffId = staffId.replace(/^0+/, '');
    
    if (normalizedConfirmId !== normalizedStaffId) {
      newErrors.staffId = 'Staff ID does not match';
    }
    if (!confirmStaffId) {
      newErrors.staffId = 'Staff ID is required';
    }

    if (confirmPhone !== staffPhone) {
      newErrors.phone = 'Phone number does not match';
    }
    if (!confirmPhone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!reactivationReason.trim()) {
      newErrors.reason = 'Reactivation reason is required';
    }
    if (reactivationReason === 'Other' && !otherReason.trim()) {
      newErrors.reason = 'Please specify the reason for reactivation';
    }

    setErrors(newErrors);
    return !newErrors.staffId && !newErrors.phone && !newErrors.reason;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleFinalConfirm = () => {
    const finalReason = reactivationReason === 'Other' ? otherReason : reactivationReason;
    onConfirm(finalReason);
    handleClose();
  };

  const handleClose = () => {
    setConfirmStaffId('');
    setConfirmPhone('');
    setReactivationReason('');
    setOtherReason('');
    setShowConfirmDialog(false);
    setErrors({ staffId: '', phone: '', reason: '' });
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

          <div className="inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full" style={{ maxWidth: '522px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Staff Member Reactivation
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
                {/* Staff Information Display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Staff Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Staff ID:</span>
                      <p className="font-medium text-gray-900">#{staffId.padStart(4, '0')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{staffName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-900">{staffPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900 text-xs break-all">{staffEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">
                    <CheckCircle className="inline w-4 h-4 mr-1" />
                    Reactivating this staff member will restore their system access.
                  </p>
                </div>

                {/* Confirmation Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Hash className="inline w-4 h-4 mr-1" />
                      Confirm Staff ID *
                    </label>
                    <input
                      type="text"
                      value={confirmStaffId}
                      onChange={(e) => setConfirmStaffId(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.staffId ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter staff ID to confirm"
                    />
                    {errors.staffId && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {errors.staffId}
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
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Reactivation *
                    </label>
                    <div className="mb-2">
                      <ModernSelect
                        placeholder="Select a reason..."
                        options={[
                          { value: 'Return from leave', label: 'Return from leave' },
                          { value: 'Rehired', label: 'Rehired' },
                          { value: 'Contract renewed', label: 'Contract renewed' },
                          { value: 'Suspension lifted', label: 'Suspension lifted' },
                          { value: 'Return from medical leave', label: 'Return from medical leave' },
                          { value: 'Transfer back', label: 'Transfer back' },
                          { value: 'Performance improved', label: 'Performance improved' },
                          { value: 'Administrative error', label: 'Administrative error' },
                          { value: 'Temporary deactivation ended', label: 'Temporary deactivation ended' },
                          { value: 'Probation completed', label: 'Probation completed' },
                          { value: 'Other', label: 'Other (specify below)' }
                        ]}
                        value={reactivationReason}
                        onChange={setReactivationReason}
                        showClear={false}
                        className={errors.reason ? 'border-red-500' : ''}
                      />
                    </div>
                    {reactivationReason === 'Other' && (
                      <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.reason ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder="Please specify the reason for reactivation..."
                      />
                    )}
                    {errors.reason && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {errors.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <AlertTriangle className="inline w-4 h-4 mr-1" />
                    Please verify all information carefully before proceeding with reactivation.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pt-0.5 pb-2 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
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

            <div className="inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-6 py-5 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Confirm Reactivation
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  Are you sure you want to reactivate this staff member? They will regain access to the system.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{staffName}</p>
                  <p className="text-xs text-gray-600">Staff ID: #{staffId.padStart(4, '0')}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-medium">Reason:</span> {reactivationReason === 'Other' ? otherReason : reactivationReason}
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