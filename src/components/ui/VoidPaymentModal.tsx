'use client'
import React, { useState } from 'react';
import { X, AlertTriangle, Hash, FileText } from 'lucide-react';

interface VoidPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  transactionId: string;
  customerName: string;
  customerNumber: string;
  phoneNumber: string;
  transactionDate: string;
  amount: number;
}

export const VoidPaymentModal: React.FC<VoidPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transactionId,
  customerName,
  customerNumber,
  phoneNumber,
  transactionDate,
  amount
}) => {
  const [voidReason, setVoidReason] = useState('');
  const [confirmTransactionId, setConfirmTransactionId] = useState('');
  const [confirmCustomerNumber, setConfirmCustomerNumber] = useState('');
  const [errors, setErrors] = useState({
    transactionId: '',
    customerNumber: '',
    reason: ''
  });

  const validateForm = () => {
    const newErrors = {
      transactionId: '',
      customerNumber: '',
      reason: ''
    };

    if (!confirmTransactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    } else if (confirmTransactionId !== transactionId) {
      newErrors.transactionId = 'Transaction ID does not match';
    }

    if (!confirmCustomerNumber.trim()) {
      newErrors.customerNumber = 'Customer number is required';
    } else if (confirmCustomerNumber !== customerNumber) {
      newErrors.customerNumber = 'Customer number does not match';
    }

    if (!voidReason.trim()) {
      newErrors.reason = 'Please provide a reason for voiding this payment';
    }

    setErrors(newErrors);
    return !newErrors.transactionId && !newErrors.customerNumber && !newErrors.reason;
  };

  const handleVoid = () => {
    if (validateForm()) {
      onConfirm(voidReason);
      handleClose();
    }
  };

  const handleClose = () => {
    setVoidReason('');
    setConfirmTransactionId('');
    setConfirmCustomerNumber('');
    setErrors({ transactionId: '', customerNumber: '', reason: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-red-600 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Void Payment Transaction
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-red-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">
              Warning: The payment will be permanently voided.
            </p>
            <p className="text-xs text-red-700 mt-1">
              Please verify all information carefully before proceeding.
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
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount Being Voided</p>
                <p className="text-lg font-bold text-red-600">₵{amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-5"></div>

          {/* Confirmation Fields */}
          <div className="space-y-4 mb-5">
            {/* Confirm Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Enter Transaction ID to Confirm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={confirmTransactionId}
                onChange={(e) => {
                  setConfirmTransactionId(e.target.value);
                  setErrors(prev => ({ ...prev, transactionId: '' }));
                }}
                placeholder="Enter transaction ID to confirm"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.transactionId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.transactionId && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {errors.transactionId}
                </p>
              )}
            </div>

            {/* Confirm Customer Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-1" />
                Enter Customer # to Confirm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={confirmCustomerNumber}
                onChange={(e) => {
                  setConfirmCustomerNumber(e.target.value);
                  setErrors(prev => ({ ...prev, customerNumber: '' }));
                }}
                placeholder="Enter customer number to confirm"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.customerNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customerNumber && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {errors.customerNumber}
                </p>
              )}
            </div>

            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Voiding Payment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={voidReason}
                onChange={(e) => {
                  setVoidReason(e.target.value);
                  setErrors(prev => ({ ...prev, reason: '' }));
                }}
                placeholder="Please provide a detailed reason for voiding this payment..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {errors.reason}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVoid}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Void Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};