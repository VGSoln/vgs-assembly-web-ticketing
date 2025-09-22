'use client'
import React from 'react';
import { X } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerNumber: string;
  phoneNumber: string;
  transactionId: string;
  amount: number;
  date?: string;
  receiptImage?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  customerName,
  customerNumber,
  phoneNumber,
  transactionId,
  amount,
  date,
  receiptImage = '/images/reciept1.jpg'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-5">
            {/* Receipt Image - Takes 2/3 of space */}
            <div className="col-span-2">
              <div className="bg-gray-100 rounded-lg p-3 h-[500px] flex items-center justify-center">
                {receiptImage ? (
                  <img 
                    src={receiptImage} 
                    alt="Payment Receipt" 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">No Receipt Image</p>
                    <p className="text-sm mt-1">Receipt photograph will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex flex-col justify-center space-y-6">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="text-lg font-bold text-blue-600">#{transactionId}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                  <p className="text-sm font-semibold text-gray-900">{customerName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Number</p>
                  <p className="text-sm font-semibold text-gray-900">{customerNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{phoneNumber}</p>
                </div>

                {date && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction Date</p>
                    <p className="text-sm font-semibold text-gray-900">{date}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">GHS {amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};