'use client'
import React, { useState } from 'react';
import { X, Phone, ChevronDown } from 'lucide-react';

interface LogCustomerCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CallLogData) => void;
  customerName?: string;
}

interface CallLogData {
  outcome: string;
  customerComments: string;
  staffNotes: string;
}

export const LogCustomerCallModal: React.FC<LogCustomerCallModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerName
}) => {
  const [outcome, setOutcome] = useState('');
  const [customerComments, setCustomerComments] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false);

  const outcomeOptions = [
    'Customer Inquiry - Resolved',
    'Payment Arrangement',
    'Billing Dispute',
    'Service Request',
    'Complaint - Resolved',
    'Complaint - Escalated',
    'Technical Support',
    'Account Update',
    'Meter Reading Issue',
    'Connection Request',
    'Disconnection Request',
    'Other'
  ];

  const handleSave = () => {
    if (!outcome) {
      alert('Please select a call outcome');
      return;
    }

    onSave({
      outcome,
      customerComments,
      staffNotes
    });

    // Reset form
    setOutcome('');
    setCustomerComments('');
    setStaffNotes('');
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setOutcome('');
    setCustomerComments('');
    setStaffNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Log Customer Support Call</h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {customerName && (
            <p className="text-sm text-gray-600 mt-1">Customer: {customerName}</p>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Call Outcome Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-blue-600 mb-2">
              Select The Customer Support Call Outcome
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOutcomeDropdown(!showOutcomeDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className={outcome ? 'text-gray-900' : 'text-gray-400'}>
                  {outcome || 'Select Outcome'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showOutcomeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showOutcomeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {outcomeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setOutcome(option);
                        setShowOutcomeDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Comments */}
          <div>
            <label className="block text-sm font-semibold text-blue-600 mb-2">
              Customer Comments
            </label>
            <textarea
              value={customerComments}
              onChange={(e) => setCustomerComments(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={6}
              placeholder="Enter customer comments"
            />
          </div>

          {/* Staff Comments/Notes */}
          <div>
            <label className="block text-sm font-semibold text-blue-600 mb-2">
              Staff Comments / Notes
            </label>
            <textarea
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={6}
              placeholder="Enter staff comments/notes"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition-colors"
            >
              Save Call Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};