'use client'
import React from 'react';
import { ArrowLeft, Edit, Database, MapPin, Gauge, Calendar, Settings } from 'lucide-react';

interface StorageTankData {
  id: number;
  storageTankNumber: string;
  storageTankName: string;
  waterSystemName: string;
  throughput: number;
  meterNumber: string;
  lastReadingDate: string;
  daysSinceLastReading: number;
  lastReading: number;
  location: string;
  gps: boolean;
}

interface StorageTankDetailsPageProps {
  storageTankData: StorageTankData;
  onBack: () => void;
  onEdit: () => void;
}

export const StorageTankDetailsPage: React.FC<StorageTankDetailsPageProps> = ({ 
  storageTankData, 
  onBack, 
  onEdit 
}) => {
  const formatValue = (value: string | number, fallback: string = 'Not provided') => {
    if (value === '' || value === null || value === undefined) return fallback;
    return String(value);
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

  const getStatusColor = (days: number) => {
    if (days === 0) return 'bg-gray-100 text-gray-800';
    if (days <= 30) return 'bg-green-100 text-green-800';
    if (days <= 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (days: number) => {
    if (days === 0) return 'No readings';
    if (days <= 30) return 'Recent';
    if (days <= 90) return 'Attention needed';
    return 'Overdue';
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
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Storage Tank Details</h1>
              <p className="text-sm text-gray-500 mt-1">{storageTankData.storageTankName}</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            Edit Storage Tank
          </button>
        </div>
      </div>

      {/* Details Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tank Number</p>
                  <p className="text-2xl font-bold text-gray-900">{storageTankData.storageTankNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Gauge className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Reading</p>
                  <p className="text-2xl font-bold text-gray-900">{storageTankData.lastReading.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reading Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(storageTankData.daysSinceLastReading)}`}>
                    {getStatusText(storageTankData.daysSinceLastReading)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Storage Tank Number</label>
                  <p className="text-gray-900 font-semibold">{formatValue(storageTankData.storageTankNumber)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Storage Tank Name</label>
                  <p className="text-gray-900 font-medium">{formatValue(storageTankData.storageTankName)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Water System Name</label>
                  <p className="text-gray-900">{formatValue(storageTankData.waterSystemName)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Location Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900">{formatValue(storageTankData.location)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">GPS Available</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    storageTankData.gps ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {storageTankData.gps ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
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
                      {storageTankData.throughput} L/s
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meter Information */}
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
                    {formatValue(storageTankData.meterNumber)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Reading Date</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(storageTankData.lastReadingDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Days Since Last Reading</label>
                  <p className="text-gray-900 font-semibold">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(storageTankData.daysSinceLastReading)}`}>
                      {storageTankData.daysSinceLastReading} days
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Reading</label>
                  <p className="text-gray-900 font-semibold">
                    {storageTankData.lastReading.toLocaleString()} m³
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start items-center pt-6">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};