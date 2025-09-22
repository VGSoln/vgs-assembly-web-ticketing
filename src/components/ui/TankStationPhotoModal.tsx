'use client'
import React from 'react';
import { X, Camera, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface TankStationPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingId?: string;
  assetNumber: string; // Tank number
  assetName: string; // Tank name
  assetType: 'Storage Tank';
  meterNumber?: string;
  readingDate: string;
  readingValue: number;
  fieldReading?: number;
  staffName?: string;
  system?: string;
  capacity?: number;
  status?: string;
  imageUrl?: string;
}

export const TankStationPhotoModal: React.FC<TankStationPhotoModalProps> = ({
  isOpen,
  onClose,
  readingId,
  assetNumber,
  assetName,
  assetType,
  meterNumber,
  readingDate,
  readingValue,
  fieldReading,
  staffName = 'N/A',
  system,
  capacity,
  status,
  imageUrl = '/images/meter1.jpg'
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${assetType.toLowerCase().replace(' ', '-')}-${assetNumber}-${readingDate.replace(/\s/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewWindow = () => {
    window.open(imageUrl, '_blank');
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600';
    switch (status.toLowerCase()) {
      case 'operational':
        return 'text-green-600';
      case 'maintenance':
        return 'text-yellow-600';
      case 'offline':
      case 'out of service':
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">{assetType} Meter Reading Photo</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
              title="Open in New Window"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="grid grid-cols-3 gap-5">
            {/* Image - Takes 2/3 of space */}
            <div className="col-span-2">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[550px] relative">
                <div className="w-full h-full relative">
                  <Image
                    src={imageUrl}
                    alt={`${assetType} ${assetNumber}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Asset Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[550px] flex flex-col justify-start space-y-4">
                {readingId && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reading ID</p>
                    <p className="text-sm font-bold text-blue-600">{readingId}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {assetType === 'Storage Tank' ? 'Tank #' : 'Station #'}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">{assetNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {assetType === 'Storage Tank' ? 'Tank Name' : 'Station Name'}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{assetName}</p>
                </div>

                {meterNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meter Number</p>
                    <p className="text-sm font-semibold text-gray-900">{meterNumber}</p>
                  </div>
                )}

                {system && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">System</p>
                    <p className="text-sm font-semibold text-gray-900">{system}</p>
                  </div>
                )}

                {capacity !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {capacity.toLocaleString()} {assetType === 'Storage Tank' ? 'm³' : 'm³/h'}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reading Date</p>
                  <p className="text-sm font-semibold text-gray-900">{readingDate}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Staff Name</p>
                  <p className="text-sm font-semibold text-gray-900">{staffName}</p>
                </div>

                {status && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <p className={`text-sm font-semibold ${getStatusColor(status)}`}>
                      {status}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Reading</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {readingValue.toLocaleString()} m³
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};