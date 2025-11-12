import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, MapPin } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { getLocation, updateLocation, getZones } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface EditLocationPageProps {
  locationId?: string;
  onSave?: (locationData: any) => void;
  onBack?: () => void;
}

export const EditLocationPage: React.FC<EditLocationPageProps> = ({
  locationId,
  onSave,
  onBack
}) => {
  const { user } = useAuth();
  const [originalLocation, setOriginalLocation] = useState<any>(null);
  const [zones, setZones] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    locationType: '',
    zoneId: '',
    gpsLatitude: '',
    gpsLongitude: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const locationTypeOptions = [
    { value: 'market', label: 'Market' },
    { value: 'lorry-park', label: 'Lorry Park' },
    { value: 'community', label: 'Community' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;

      setIsFetching(true);
      setFetchError(null);
      try {
        const assemblyId = user?.['assembly-id'];
        if (!assemblyId) {
          throw new Error('Assembly ID not found');
        }

        const [locationData, zonesData] = await Promise.all([
          getLocation(locationId),
          getZones({ 'assembly-id': assemblyId })
        ]);

        setOriginalLocation(locationData);
        setZones(zonesData);

        setFormData({
          name: locationData.name || '',
          locationType: locationData['location-type'] || '',
          zoneId: locationData['zone-id'] || '',
          gpsLatitude: locationData['gps-latitude']?.toString() || '',
          gpsLongitude: locationData['gps-longitude']?.toString() || ''
        });
      } catch (error) {
        console.error('Error fetching location data:', error);
        setFetchError('Failed to load location data. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [locationId, user]);

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !originalLocation) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {fetchError || 'Location Not Found'}
          </h2>
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
            Back to Locations
          </button>
        </div>
      </div>
    );
  }

  const zoneOptions = zones.map(zone => ({
    value: zone.id,
    label: zone.name
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }

    if (!formData.locationType) {
      newErrors.locationType = 'Location type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiData: any = {
        name: formData.name,
        'location-type': formData.locationType
      };

      if (formData.zoneId) {
        apiData['zone-id'] = formData.zoneId;
      }
      if (formData.gpsLatitude) {
        apiData['gps-latitude'] = parseFloat(formData.gpsLatitude);
      }
      if (formData.gpsLongitude) {
        apiData['gps-longitude'] = parseFloat(formData.gpsLongitude);
      }

      await updateLocation(locationId!, apiData);

      if (onSave) {
        onSave({ ...originalLocation, ...formData });
      }

      console.log('Location updated successfully');
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error updating location:', error);
      setErrors({ general: 'Failed to update location. Please try again.' });
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Location</h1>
              <p className="text-gray-600">Location ID: {originalLocation.locationId}</p>
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
          {/* Location ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location ID
            </label>
            <input
              type="text"
              value={originalLocation.locationId}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

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
              showClear={false}
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
              showClear={false}
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
              showClear={false}
              disabled={!formData.community}
              className={errors.zone ? 'border-red-500' : ''}
            />
            {errors.zone && <p className="mt-1 text-sm text-red-600">{errors.zone}</p>}
          </div>

          {/* Created Date (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created Date
            </label>
            <input
              type="text"
              value={originalLocation.createdDate}
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
              value={originalLocation.createdBy}
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
              value={originalLocation.modifiedDate}
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
              value={originalLocation.modifiedBy}
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