'use client'
import React from 'react';
import { ArrowLeft, Check, Edit, Droplet, MapPin, Building2, Gauge, Calendar, Settings } from 'lucide-react';

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

interface PumpStationReviewPageProps {
  pumpStationData: PumpStationFormData;
  onBack: () => void;
  onConfirm: () => void;
  onEdit?: () => void;
}

export const PumpStationReviewPage: React.FC<PumpStationReviewPageProps> = ({ 
  pumpStationData, 
  onBack, 
  onConfirm, 
  onEdit 
}) => {
  const formatValue = (value: string, fallback: string = 'Not provided') => {
    return value.trim() || fallback;
  };

  const getMeterTypeLabel = (value: string) => {
    const meterMap: { [key: string]: string } = {
      'manual': 'Manual',
      'digital': 'Digital',
      'smart': 'Smart',
      'ultrasonic': 'Ultrasonic'
    };
    return meterMap[value] || value || 'Not provided';
  };

  const getMaintenanceScheduleLabel = (value: string) => {
    const scheduleMap: { [key: string]: string } = {
      'weekly': 'Weekly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'annually': 'Annually'
    };
    return scheduleMap[value] || value || 'Not provided';
  };

  const formatDate = (date: string) => {
    if (!date) return 'Not provided';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const formatCoordinates = (lat: string, lng: string) => {
    if (!lat && !lng) return 'Not provided';
    if (!lat) return `Longitude: ${lng}`;
    if (!lng) return `Latitude: ${lat}`;
    return `${lat}, ${lng}`;
  };

  return (
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
              Back to Form
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Pump Station Information</h1>
              <p className="text-sm text-gray-500 mt-1">Please review the information below before saving</p>
            </div>
          </div>
          <button
            onClick={onEdit || onBack}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            Edit Information
          </button>
        </div>
      </div>

      {/* Review Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Basic Information Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Pump Station Name</label>
                  <p className="text-gray-900 font-medium">{formatValue(pumpStationData.pumpStationName)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Water System Name</label>
                  <p className="text-gray-900">{formatValue(pumpStationData.waterSystemName)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                  <p className="text-gray-900">{formatValue(pumpStationData.region)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900">{formatValue(pumpStationData.location)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">GPS Coordinates</label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                    {formatCoordinates(pumpStationData.latitude, pumpStationData.longitude)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Technical Specifications</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Throughput</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {pumpStationData.throughput ? `${pumpStationData.throughput} L/s` : 'Not provided'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Pump Capacity</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {pumpStationData.pumpCapacity ? `${pumpStationData.pumpCapacity} L/min` : 'Not provided'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Power Rating</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {pumpStationData.powerRating ? `${pumpStationData.powerRating} kW` : 'Not provided'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Operating Pressure</label>
                  <p className="text-gray-900">
                    {pumpStationData.operatingPressure ? `${pumpStationData.operatingPressure} bar` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Maintenance Schedule</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {getMaintenanceScheduleLabel(pumpStationData.maintenanceSchedule)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information Review */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Meter Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Meter Number</label>
                  <p className="text-gray-900 font-mono font-semibold bg-gray-100 px-3 py-2 rounded">
                    {formatValue(pumpStationData.meterNumber)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Meter Type</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      {getMeterTypeLabel(pumpStationData.meterType)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Manufacturer</label>
                  <p className="text-gray-900">{formatValue(pumpStationData.manufacturer)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Model Number</label>
                  <p className="text-gray-900 font-mono">{formatValue(pumpStationData.modelNumber)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Installation Date</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(pumpStationData.installationDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Initial Reading</label>
                  <p className="text-gray-900 font-semibold">
                    {pumpStationData.initialReading ? `${pumpStationData.initialReading} m³` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={onEdit || onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Information
              </button>
              <button
                onClick={onConfirm}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Check className="w-5 h-5" />
                Confirm & Save Pump Station
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};