'use client'
import React from 'react';
import { X, Camera, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface MeterPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingId?: string;
  meterNumber: string;
  customerName: string;
  customerNumber: string;
  readingDate: string;
  readingValue: number;
  volume?: number;
  staffName?: string;
  imageUrl?: string;
}

export const MeterPhotoModal: React.FC<MeterPhotoModalProps> = ({
  isOpen,
  onClose,
  readingId,
  meterNumber,
  customerName,
  customerNumber,
  readingDate,
  readingValue,
  volume,
  staffName = 'N/A',
  imageUrl = '/images/meter1.jpg'
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `meter-${meterNumber}-${readingDate.replace(/\s/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewWindow = () => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Meter Reading Photo</h2>
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
                    alt={`Meter ${meterNumber}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Meter Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[550px] flex flex-col justify-start space-y-4">
                {readingId && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reading ID</p>
                    <p className="text-sm font-bold text-blue-600">{readingId}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meter Number</p>
                  <p className="text-sm font-semibold text-blue-600">{meterNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                  <p className="text-sm font-semibold text-gray-900">{customerName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Number</p>
                  <p className="text-sm font-semibold text-gray-900">{customerNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reading Date</p>
                  <p className="text-sm font-semibold text-gray-900">{readingDate}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Staff Name</p>
                  <p className="text-sm font-semibold text-gray-900">{staffName}</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Reading</p>
                  <p className="text-2xl font-bold text-blue-600">{readingValue.toLocaleString()}</p>
                </div>

                {volume !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Volume (m³)</p>
                    <p className="text-lg font-bold text-green-600">{volume.toLocaleString()}</p>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Photo Taken</p>
                  <p className="text-sm text-gray-600">{readingDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};