import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Ticket } from 'lucide-react';
import { ticketTypesData } from '@/lib/data';

interface EditTicketTypePageProps {
  ticketTypeId?: string;
  onSave?: (ticketTypeData: any) => void;
  onBack?: () => void;
}

export const EditTicketTypePage: React.FC<EditTicketTypePageProps> = ({ 
  ticketTypeId, 
  onSave, 
  onBack 
}) => {
  const originalTicketType = ticketTypesData.find(tt => tt.id.toString() === ticketTypeId || tt.ticketTypeId === ticketTypeId);
  
  const [formData, setFormData] = useState({
    ticketTypeName: '',
    description: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (originalTicketType) {
      setFormData({
        ticketTypeName: originalTicketType.ticketTypeName,
        description: originalTicketType.description
      });
    }
  }, [originalTicketType]);

  if (!originalTicketType) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ticket Type Not Found</h2>
          <button 
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                window.history.back();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Ticket Types
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.ticketTypeName.trim()) {
      newErrors.ticketTypeName = 'Ticket type name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedTicketType = {
        ...originalTicketType,
        ...formData,
        modifiedDate: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(',', ''),
        modifiedBy: 'AEDA Admin'
      };
      
      if (onSave) {
        onSave(updatedTicketType);
      }
      
      console.log('Ticket type updated successfully:', updatedTicketType);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error updating ticket type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  window.history.back();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Ticket Type</h1>
              <p className="text-gray-600">Ticket Type ID: {originalTicketType.ticketTypeId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-green-500" />
          Ticket Type Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ticket Type ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Type ID
            </label>
            <input
              type="text"
              value={originalTicketType.ticketTypeId}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Ticket Type Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ticketTypeName}
              onChange={(e) => handleInputChange('ticketTypeName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.ticketTypeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter ticket type name (e.g., Lorry Park, Market, etc.)"
            />
            {errors.ticketTypeName && <p className="mt-1 text-sm text-red-600">{errors.ticketTypeName}</p>}
          </div>

          {/* Created Date (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created Date
            </label>
            <input
              type="text"
              value={originalTicketType.createdDate}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Created By (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created By
            </label>
            <input
              type="text"
              value={originalTicketType.createdBy}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Modified Date (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Modified Date
            </label>
            <input
              type="text"
              value={originalTicketType.modifiedDate}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Modified By (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Modified By
            </label>
            <input
              type="text"
              value={originalTicketType.modifiedBy}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Revenue Type - Read Only (Full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revenue Type
            </label>
            <input
              type="text"
              value="Ticketing"
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              title="All ticket types are automatically assigned to Ticketing revenue type"
            />
            <p className="mt-1 text-sm text-gray-500">Automatically assigned to all ticket types</p>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter ticket type description"
            rows={4}
          />
        </div>

        {/* Form Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  window.history.back();
                }
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};