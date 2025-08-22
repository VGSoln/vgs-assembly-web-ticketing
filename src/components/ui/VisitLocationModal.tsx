'use client'
import React, { useEffect, useRef } from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';

interface VisitLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitId?: string;
  customerName: string;
  customerNumber: string;
  phoneNumber: string;
  visitDate: string;
  visitTime: string;
  staffName: string;
  visitOutcome: string;
  latitude?: number;
  longitude?: number;
}

export const VisitLocationModal: React.FC<VisitLocationModalProps> = ({
  isOpen,
  onClose,
  visitId,
  customerName,
  customerNumber,
  phoneNumber,
  visitDate,
  visitTime,
  staffName,
  visitOutcome,
  latitude = 5.6037,
  longitude = -0.1870
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const loadMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      // Clean up any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create map
      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      // Add tile layer
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '',
        maxZoom: 20
      }).addTo(map);

      // Create red marker icon
      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Add marker with popup
      const marker = L.marker([latitude, longitude], { icon: redIcon }).addTo(map);
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
            Visit Location
          </h3>
          <p style="margin: 0; color: #666; font-size: 12px;">
            Customer: <strong>${customerName}</strong>
          </p>
          <p style="margin: 0; color: #666; font-size: 12px;">
            Customer #: <strong>${customerNumber}</strong>
          </p>
          <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
            Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}
          </p>
        </div>
      `);

      mapInstanceRef.current = map;
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, latitude, longitude, customerName, customerNumber]);

  const handleOpenInNewWindow = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16`;
    window.open(googleMapsUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden" style={{ maxWidth: '52rem' }}>
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Visit Location
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Map
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
        <div className="p-5">
          <div className="grid grid-cols-3 gap-5">
            {/* Map - Takes 2/3 of space */}
            <div className="col-span-2">
              <div className="bg-gray-100 rounded-lg p-2 h-[500px]">
                <div ref={mapRef} className="w-full h-full rounded" />
              </div>
            </div>

            {/* Visit Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex flex-col justify-center space-y-5">
                {visitId && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visit ID</p>
                    <p className="text-sm font-bold text-blue-600">{visitId}</p>
                  </div>
                )}

                <div className={visitId ? "" : "pb-3 border-b border-gray-200"}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visit Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">{visitDate} at {visitTime}</p>
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
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{phoneNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Staff Name</p>
                  <p className="text-sm font-semibold text-gray-900">{staffName}</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visit Outcome</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {visitOutcome}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};