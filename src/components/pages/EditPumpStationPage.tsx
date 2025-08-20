'use client'
import React, { useState } from 'react';
import { ArrowLeft, Save, Droplet, Gauge, MapPin, Building2, Calendar, CheckCircle, Settings } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { 
  businessLevelOptions 
} from '@/lib/data';

interface PumpStationFormData {
  pumpStationName: string;
  waterSystemName: string;
  throughput: string;
  meterNumber: string;
  meterType: string;
  manufacturer: string;
  modelNumber: string;
  installationDate: string;
  initialReading: string;
  region: string;
  location: string;
  latitude: string;
  longitude: string;
  operatingPressure: string;
  pumpCapacity: string;
  powerRating: string;
  maintenanceSchedule: string;
}

interface PumpStationData {
  id: number;
  pumpStationNumber: string;
  pumpStationName: string;
  waterSystemName: string;
  throughput: number;
  meterNumber: string;
  lastReadingDate: string;
  daysSinceLastReading: number;
  lastReading: number;
  location: string;
  gps: boolean;
}

interface EditPumpStationPageProps {
  pumpStationData: PumpStationData;
  onBack?: () => void;
  onSave?: (pumpStationData: PumpStationFormData) => void;
}

export const EditPumpStationPage: React.FC<EditPumpStationPageProps> = ({ pumpStationData, onBack, onSave }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<PumpStationFormData>({
    pumpStationName: pumpStationData.pumpStationName || '',
    waterSystemName: pumpStationData.waterSystemName || '',
    throughput: pumpStationData.throughput?.toString() || '',
    meterNumber: pumpStationData.meterNumber || '',
    meterType: '',
    manufacturer: '',
    modelNumber: '',
    installationDate: '',
    initialReading: pumpStationData.lastReading?.toString() || '',
    region: '',
    location: pumpStationData.location || '',
    latitude: '',
    longitude: '',
    operatingPressure: '',
    pumpCapacity: '',
    powerRating: '',
    maintenanceSchedule: ''
  });

  const [errors, setErrors] = useState<Partial<PumpStationFormData>>({});

  const meterTypeOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'digital', label: 'Digital' },
    { value: 'smart', label: 'Smart' },
    { value: 'ultrasonic', label: 'Ultrasonic' }
  ];

  const maintenanceScheduleOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  const handleInputChange = (field: keyof PumpStationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PumpStationFormData> = {};

    // Required fields validation
    if (!formData.pumpStationName.trim()) newErrors.pumpStationName = 'Pump station name is required';
    if (!formData.waterSystemName.trim()) newErrors.waterSystemName = 'Water system name is required';
    if (!formData.meterNumber.trim()) newErrors.meterNumber = 'Meter number is required';
    if (!formData.meterType.trim()) newErrors.meterType = 'Meter type is required';
    if (!formData.initialReading.trim()) newErrors.initialReading = 'Initial reading is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Numeric validation for optional technical fields
    if (formData.throughput && isNaN(Number(formData.throughput))) {
      newErrors.throughput = 'Throughput must be a valid number';
    }
    if (formData.initialReading && isNaN(Number(formData.initialReading))) {
      newErrors.initialReading = 'Initial reading must be a valid number';
    }
    if (formData.pumpCapacity && isNaN(Number(formData.pumpCapacity))) {
      newErrors.pumpCapacity = 'Pump capacity must be a valid number';
    }
    if (formData.powerRating && isNaN(Number(formData.powerRating))) {
      newErrors.powerRating = 'Power rating must be a valid number';
    }
    if (formData.operatingPressure && isNaN(Number(formData.operatingPressure))) {
      newErrors.operatingPressure = 'Operating pressure must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('🔄 handleSave called');
      console.log('📋 Pump Station data:', formData);
      onSave?.(formData);
      
      // Show success modal
      console.log('✅ Setting showSuccessModal to true');
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    console.log('❌ Closing success modal');
    setShowSuccessModal(false);
    onBack?.();
  };

  // Success Modal Component
  const SuccessModal = () => {
    console.log('🎉 SuccessModal is rendering!');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Success!</h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Pump Station Successfully Updated
          </h3>
          <p className="text-gray-600 mb-6">
            The pump station <strong>{formData.pumpStationName}</strong> has been successfully updated in the system.
          </p>
          
          {/* Close Button */}
          <button
            onClick={handleSuccessModalClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Continue
          </button>
        </div>
      </div>
    </div>
    );
  };

  console.log('📝 Edit form page rendering. showSuccessModal:', showSuccessModal);
  
  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
      
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Pump Station</h1>
              <p className="text-sm text-gray-500 mt-1">Update the pump station information below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pump Station Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pumpStationName}
                    onChange={(e) => handleInputChange('pumpStationName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.pumpStationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter pump station name"
                  />
                  {errors.pumpStationName && <p className="text-red-500 text-sm mt-1">{errors.pumpStationName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water System Name <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.waterSystemName}
                    onChange={(value) => handleInputChange('waterSystemName', value)}
                    placeholder="Select Water System"
                    options={businessLevelOptions}
                    className="w-full"
                  />
                  {errors.waterSystemName && <p className="text-red-500 text-sm mt-1">{errors.waterSystemName}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.region}
                    onChange={(value) => handleInputChange('region', value)}
                    placeholder="Select Region"
                    options={businessLevelOptions}
                    className="w-full"
                  />
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter location description"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter latitude coordinates"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter longitude coordinates"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Technical Specifications</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Throughput (L/s)</label>
                  <input
                    type="number"
                    value={formData.throughput}
                    onChange={(e) => handleInputChange('throughput', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.throughput ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter throughput"
                    min="0"
                  />
                  {errors.throughput && <p className="text-red-500 text-sm mt-1">{errors.throughput}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pump Capacity (L/min)</label>
                  <input
                    type="number"
                    value={formData.pumpCapacity}
                    onChange={(e) => handleInputChange('pumpCapacity', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.pumpCapacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter pump capacity"
                    min="0"
                  />
                  {errors.pumpCapacity && <p className="text-red-500 text-sm mt-1">{errors.pumpCapacity}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Power Rating (kW)</label>
                  <input
                    type="number"
                    value={formData.powerRating}
                    onChange={(e) => handleInputChange('powerRating', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.powerRating ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter power rating"
                    min="0"
                    step="0.1"
                  />
                  {errors.powerRating && <p className="text-red-500 text-sm mt-1">{errors.powerRating}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operating Pressure (bar)</label>
                  <input
                    type="number"
                    value={formData.operatingPressure}
                    onChange={(e) => handleInputChange('operatingPressure', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.operatingPressure ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter operating pressure"
                    min="0"
                    step="0.1"
                  />
                  {errors.operatingPressure && <p className="text-red-500 text-sm mt-1">{errors.operatingPressure}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Schedule</label>
                  <ModernSelect
                    value={formData.maintenanceSchedule}
                    onChange={(value) => handleInputChange('maintenanceSchedule', value)}
                    placeholder="Select Maintenance Schedule"
                    options={maintenanceScheduleOptions}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Meter Information</h2>
              </div>
            </div>
            <div className="p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meterNumber}
                    onChange={(e) => handleInputChange('meterNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.meterNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter meter number"
                  />
                  {errors.meterNumber && <p className="text-red-500 text-sm mt-1">{errors.meterNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meter Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={formData.meterType}
                    onChange={(value) => handleInputChange('meterType', value)}
                    placeholder="Select Meter Type"
                    options={meterTypeOptions}
                    className="w-full"
                  />
                  {errors.meterType && <p className="text-red-500 text-sm mt-1">{errors.meterType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter manufacturer"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model Number</label>
                    <input
                      type="text"
                      value={formData.modelNumber}
                      onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter model number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Installation Date</label>
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => handleInputChange('installationDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Reading <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.initialReading}
                      onChange={(e) => handleInputChange('initialReading', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.initialReading ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current reading"
                      min="0"
                    />
                    {errors.initialReading && <p className="text-red-500 text-sm mt-1">{errors.initialReading}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Pump Station
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};