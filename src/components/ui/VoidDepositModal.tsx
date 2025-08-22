'use client'
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface VoidDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  transactionId: string;
  depositDate: string;
  bankName: string;
  accountNumber: string;
  depositAmount: number;
  zone: string;
  collector: string;
}

export const VoidDepositModal: React.FC<VoidDepositModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transactionId,
  depositDate,
  bankName,
  accountNumber,
  depositAmount,
  zone,
  collector
}) => {
  const [voidReason, setVoidReason] = useState('');
  const [error, setError] = useState('');

  const handleVoid = () => {
    if (!voidReason.trim()) {
      setError('Please provide a reason for voiding this deposit');
      return;
    }
    onConfirm(voidReason);
    setVoidReason('');
    setError('');
  };

  const handleClose = () => {
    setVoidReason('');
    setError('');
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
            Void Bank Deposit
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
              Warning: This action cannot be undone. The bank deposit will be permanently voided.
            </p>
          </div>

          {/* Deposit Details */}
          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                <p className="text-sm font-semibold text-gray-900">#{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deposit Date</p>
                <p className="text-sm font-semibold text-gray-900">{depositDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                <p className="text-sm font-semibold text-gray-900">{bankName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</p>
                <p className="text-sm font-semibold text-gray-900">{accountNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Zone</p>
                <p className="text-sm font-semibold text-gray-900">{zone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Collector</p>
                <p className="text-sm font-semibold text-gray-900">{collector}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deposit Amount</p>
              <p className="text-lg font-bold text-red-600">₵{depositAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Voiding Deposit <span className="text-red-500">*</span>
            </label>
            <textarea
              value={voidReason}
              onChange={(e) => {
                setVoidReason(e.target.value);
                setError('');
              }}
              placeholder="Please provide a detailed reason for voiding this bank deposit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
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
              Void Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};