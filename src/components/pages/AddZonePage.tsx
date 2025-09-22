import React, { useState } from 'react';
import { ChevronLeft, Save, X, MapPin } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { communitiesData } from '@/lib/data';

interface AddZonePageProps {
  onSave?: (zoneData: any) => void;
  onBack?: () => void;
}

export const AddZonePage: React.FC<AddZonePageProps> = ({ onSave, onBack }) => {
  const [formData, setFormData] = useState({
    zoneName: '',
    community: '',
    description: '',
    locations: [] as string[]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const communityOptions = communitiesData.map(community => ({
    value: community.communityName,
    label: community.communityName
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.zoneName.trim()) {
      newErrors.zoneName = 'Zone name is required';
    }

    if (!formData.community) {
      newErrors.community = 'Community is required';
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
      
      const newZone = {
        ...formData,
        zoneId: `ZONE-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        numberOfLocations: 0,
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
        onSave(newZone);
      }
      
      console.log('Zone saved successfully:', newZone);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error saving zone:', error);
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
              <h1 className="text-2xl font-bold text-gray-900">Add Zone</h1>
              <p className="text-gray-600">Create a new zone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Zone Information
        </h2>
        
        <div className="space-y-6">
          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.zoneName}
              onChange={(e) => handleInputChange('zoneName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.zoneName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter zone name"
            />
            {errors.zoneName && <p className="mt-1 text-sm text-red-600">{errors.zoneName}</p>}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter zone description (optional)"
              rows={4}
            />
          </div>

          {/* Locations (placeholder for future implementation) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locations
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Locations can be added after creating the zone
              </p>
            </div>
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
              {isLoading ? 'Saving...' : 'Save Zone'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};