import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, MapPin } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { zonesData, communitiesData } from '@/lib/data';

interface EditZonePageProps {
  zoneId?: string;
  onSave?: (zoneData: any) => void;
  onBack?: () => void;
}

export const EditZonePage: React.FC<EditZonePageProps> = ({ 
  zoneId, 
  onSave, 
  onBack 
}) => {
  const originalZone = zonesData.find(z => z.id.toString() === zoneId || z.zoneId === zoneId);
  
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

  useEffect(() => {
    if (originalZone) {
      setFormData({
        zoneName: originalZone.zoneName,
        community: originalZone.community,
        description: '',
        locations: []
      });
    }
  }, [originalZone]);

  if (!originalZone) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Zone Not Found</h2>
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
            Back to Zones
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
      
      const updatedZone = {
        ...originalZone,
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
        onSave(updatedZone);
      }
      
      console.log('Zone updated successfully:', updatedZone);
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error updating zone:', error);
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Zone</h1>
              <p className="text-gray-600">Zone ID: {originalZone.zoneId}</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zone ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone ID
            </label>
            <input
              type="text"
              value={originalZone.zoneId}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

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
              showClear={false}
              className={errors.community ? 'border-red-500' : ''}
            />
            {errors.community && <p className="mt-1 text-sm text-red-600">{errors.community}</p>}
          </div>

          {/* Number of Locations (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Locations
            </label>
            <input
              type="text"
              value={originalZone.numberOfLocations || 0}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Created Date (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created Date
            </label>
            <input
              type="text"
              value={originalZone.createdDate}
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
              value={originalZone.createdBy}
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
              value={originalZone.modifiedDate}
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
              value={originalZone.modifiedBy}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
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
            placeholder="Enter zone description (optional)"
            rows={4}
          />
        </div>

        {/* Locations - Full Width */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locations
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Location management will be implemented in a future update
            </p>
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