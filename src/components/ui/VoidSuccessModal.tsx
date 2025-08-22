'use client'
import React, { useEffect, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface VoidSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  transactionType?: 'payment' | 'deposit';
}

export const VoidSuccessModal: React.FC<VoidSuccessModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  transactionType = 'deposit'
}) => {
  const [progress, setProgress] = useState(100);
  const MODAL_DURATION = 20000; // 20 seconds

  // Auto-close after 20 seconds with progress animation
  useEffect(() => {
    if (isOpen) {
      setProgress(100);
      const startTime = Date.now();
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / MODAL_DURATION) * 100);
        
        if (remaining <= 0) {
          clearInterval(progressInterval);
          onClose();
        } else {
          setProgress(remaining);
        }
      }, 50); // Update every 50ms for smooth animation

      const closeTimer = setTimeout(() => {
        onClose();
      }, MODAL_DURATION);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimer);
        setProgress(100);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeText = transactionType === 'payment' ? 'Payment' : 'Bank Deposit';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100001] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="bg-green-600 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Void Successful
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-green-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {typeText} Voided Successfully
            </h3>
            <p className="text-gray-600">
              {typeText} transaction <span className="font-semibold">#{transactionId}</span> has been successfully voided.
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">What happens next:</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                The transaction has been marked as voided in the system
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                The void reason has been recorded for audit purposes
              </li>
            </ul>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="text-center text-xs text-gray-500 mb-2">
              This window will close automatically in 20 seconds
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};