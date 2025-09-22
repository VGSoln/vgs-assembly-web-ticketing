import React, { useState } from 'react';
import { ChevronLeft, Save, X, MapPin } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { communitiesData, zonesData } from '@/lib/data';

interface AddLocationPageProps {
  onSave?: (locationData: any) => void;
  onBack?: () => void;
}

export const AddLocationPage: React.FC<AddLocationPageProps> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState({
    ticketType: '',
    locationName: '',
    community: '',
    zone: '',
    description: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const ticketTypeOptions = [
    { value: 'Lorry Park', label: 'Lorry Park' },
    { value: 'Market', label: 'Market' }
  ];

  const communityOptions = communitiesData.map(community => ({
    value: community.communityName,
    label: community.communityName
  }));

  const getZoneOptions = () => {
    if (!formData.community) return [];
    return zonesData
      .filter(zone => zone.community === formData.community)
      .map(zone => ({
        value: zone.zoneName,
        label: zone.zoneName
      }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset zone when community changes
      if (field === 'community' && value !== prev.community) {
        newData.zone = '';
      }
      return newData;
    });
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

    if (!formData.locationName.trim()) {
      newErrors.locationName = 'Location name is required';
    }

    if (!formData.community) {
      newErrors.community = 'Community is required';
    }

    if (!formData.zone) {
      newErrors.zone = 'Zone is required';
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
      
      const newLocation = {
        ...formData,
        locationId: `LOC-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
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
        onSave(newLocation);
      }
      
      console.log('Location saved successfully:', newLocation);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error saving location:', error);
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
              <h1 className="text-2xl font-bold text-gray-900">Add Location</h1>
              <p className="text-gray-600">Create a new location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Location Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Location Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.locationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter location name"
            />
            {errors.locationName && <p className="mt-1 text-sm text-red-600">{errors.locationName}</p>}
          </div>

          {/* Community Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.community}
              onChange={(value) => handleInputChange('community', value)}
              placeholder="Select community"
              options={communityOptions}
              showClear={true}
              className={errors.community ? 'border-red-500' : ''}
            />
            {errors.community && <p className="mt-1 text-sm text-red-600">{errors.community}</p>}
          </div>

          {/* Zone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.zone}
              onChange={(value) => handleInputChange('zone', value)}
              placeholder={formData.community ? "Select zone" : "Select community first"}
              options={getZoneOptions()}
              showClear={true}
              disabled={!formData.community}
              className={errors.zone ? 'border-red-500' : ''}
            />
            {errors.zone && <p className="mt-1 text-sm text-red-600">{errors.zone}</p>}
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
            placeholder="Enter location description"
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
              <X className="w-4 h-4 inline-block mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};