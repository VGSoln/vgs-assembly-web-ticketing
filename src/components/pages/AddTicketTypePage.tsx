import React, { useState } from 'react';
import { ChevronLeft, Save, X, Ticket } from 'lucide-react';

interface AddTicketTypePageProps {
  onSave?: (ticketTypeData: any) => void;
  onBack?: () => void;
}

export const AddTicketTypePage: React.FC<AddTicketTypePageProps> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState({
    ticketTypeName: '',
    description: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
      
      const newTicketType = {
        ...formData,
        ticketTypeId: `TT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        createdDate: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(',', ''),
        createdBy: 'AEDA Admin',
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
        onSave(newTicketType);
      }
      
      console.log('Ticket type saved successfully:', newTicketType);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error saving ticket type:', error);
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
              <h1 className="text-2xl font-bold text-gray-900">Add Ticket Type</h1>
              <p className="text-gray-600">Create a new ticket type</p>
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
        
        <div className="space-y-6">
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

          {/* Revenue Type - Read Only */}
          <div>
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

          {/* Description */}
          <div>
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
              <X className="w-4 h-4 inline-block mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Ticket Type'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};