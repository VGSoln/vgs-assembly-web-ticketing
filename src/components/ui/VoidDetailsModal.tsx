'use client'
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface VoidDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  customerName: string;
  customerNumber: string;
  phoneNumber: string;
  transactionDate: string;
  amount: number;
  voidReason: string;
  voidedDate: string;
  voidedBy: string;
}

export const VoidDetailsModal: React.FC<VoidDetailsModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  customerName,
  customerNumber,
  phoneNumber,
  transactionDate,
  amount,
  voidReason,
  voidedDate,
  voidedBy
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-red-600 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Voided Payment Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Status Badge */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">
              This payment has been voided and cannot be processed.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                <p className="text-sm font-semibold text-gray-900">#{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction Date</p>
                <p className="text-sm font-semibold text-gray-900">{transactionDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                <p className="text-sm font-semibold text-gray-900">{customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Number</p>
                <p className="text-sm font-semibold text-gray-900">{customerNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">{phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Voided Amount</p>
                <p className="text-lg font-bold text-red-600">₵{amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Void Information */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Voided Date</p>
                  <p className="text-sm font-semibold text-gray-900">{voidedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Voided By</p>
                  <p className="text-sm font-semibold text-gray-900">{voidedBy}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reason for Void</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{voidReason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};