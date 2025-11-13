import React from 'react';
import { X, AlertCircle, RefreshCw, User, Phone, Mail, Calendar, UserX } from 'lucide-react';

interface StaffDeactivatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  staffPhone: string;
  staffEmail: string;
  deactivatedDate?: string;
  deactivatedBy?: string;
  deactivationReason?: string;
  onReactivate: () => void;
}

export const StaffDeactivatedModal: React.FC<StaffDeactivatedModalProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  staffPhone,
  staffEmail,
  deactivatedDate = 'N/A',
  deactivatedBy = 'System Admin',
  deactivationReason = 'Not specified',
  onReactivate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        <div className="inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full" style={{ maxWidth: '522px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Deactivated Staff Member
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Status Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    This staff member is currently deactivated
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    System access has been revoked for this account
                  </p>
                </div>
              </div>
            </div>

            {/* Staff Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Staff Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <User className="w-3 h-3" />
                    <span className="text-xs">Staff ID</span>
                  </div>
                  <p className="font-medium text-gray-900">#{staffId.padStart(4, '0')}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <User className="w-3 h-3" />
                    <span className="text-xs">Name</span>
                  </div>
                  <p className="font-medium text-gray-900">{staffName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs">Phone</span>
                  </div>
                  <p className="font-medium text-gray-900">{staffPhone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Mail className="w-3 h-3" />
                    <span className="text-xs">Email</span>
                  </div>
                  <p className="font-medium text-gray-900 text-xs break-all">{staffEmail}</p>
                </div>
              </div>
            </div>

            {/* Deactivation Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Deactivation Details</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-xs text-gray-500 w-24">Status:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    INACTIVE
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-xs text-gray-500 w-24">Reason:</span>
                  <p className="text-sm text-gray-900 flex-1">{deactivationReason}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-xs text-gray-500 w-24">Date:</span>
                  <p className="text-sm text-gray-900">{deactivatedDate}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-xs text-gray-500 w-24">By:</span>
                  <p className="text-sm text-gray-900">{deactivatedBy}</p>
                </div>
              </div>
            </div>

            {/* Reactivation Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                Use the reactivation button below to restore this staff&apos;s system access.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-0.5 pb-4 bg-gray-50 flex justify-between gap-3 rounded-b-lg">
            <button
              onClick={onReactivate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reactivate Staff Member
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};