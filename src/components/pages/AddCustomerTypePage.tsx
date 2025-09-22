import React, { useState } from 'react';
import { ChevronLeft, Save, X, Users } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface AddCustomerTypePageProps {
  onSave?: (customerTypeData: any) => void;
  onBack?: () => void;
}

export const AddCustomerTypePage: React.FC<AddCustomerTypePageProps> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState({
    ticketType: '',
    customerTypeName: '',
    description: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const ticketTypeOptions = [
    { value: 'Lorry Park', label: 'Lorry Park' },
    { value: 'Market', label: 'Market' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.ticketType) {
      newErrors.ticketType = 'Ticket type is required';
    }

    if (!formData.customerTypeName.trim()) {
      newErrors.customerTypeName = 'Customer type name is required';
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
      
      const newCustomerType = {
        ...formData,
        customerTypeId: `CT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
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
        onSave(newCustomerType);
      }
      
      console.log('Customer type saved successfully:', newCustomerType);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error saving customer type:', error);
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
              <h1 className="text-2xl font-bold text-gray-900">Add Customer Type</h1>
              <p className="text-gray-600">Create a new customer type</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          Customer Type Information
        </h2>
        
        <div className="space-y-6">
          {/* Ticket Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Type <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.ticketType}
              onChange={(value) => handleInputChange('ticketType', value)}
              placeholder="Select ticket type"
              options={ticketTypeOptions}
              showClear={true}
              className={errors.ticketType ? 'border-red-500' : ''}
            />
            {errors.ticketType && <p className="mt-1 text-sm text-red-600">{errors.ticketType}</p>}
          </div>

          {/* Customer Type Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerTypeName}
              onChange={(e) => handleInputChange('customerTypeName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.customerTypeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer type name"
            />
            {errors.customerTypeName && <p className="mt-1 text-sm text-red-600">{errors.customerTypeName}</p>}
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
              placeholder="Enter customer type description"
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
              {isLoading ? 'Saving...' : 'Save Customer Type'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};