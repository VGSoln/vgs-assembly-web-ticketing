'use client'
import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';

interface CustomerDebtLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerNumber: string;
  phoneNumber: string;
  meterNumber?: string;
  zone?: string;
  lastPaidDate?: string;
  lastPaidAmount?: string;
  totalAmountOwed?: string;
  monthsOwed?: number;
  lastVisitOutcome?: string;
  latitude?: number;
  longitude?: number;
}

export const CustomerDebtLocationModal: React.FC<CustomerDebtLocationModalProps> = ({
  isOpen,
  onClose,
  customerName,
  customerNumber,
  phoneNumber,
  meterNumber = 'N/A',
  zone = 'N/A',
  lastPaidDate = 'N/A',
  lastPaidAmount = 'N/A',
  totalAmountOwed = 'N/A',
  monthsOwed = 0,
  lastVisitOutcome = 'N/A',
  latitude = 5.6037,
  longitude = -0.1870
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    let mounted = true;

    const loadMap = async () => {
      try {
        // Import Leaflet and its CSS
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        
        // Fix default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // Add Google Maps tiles
        const getTileUrl = () => {
          return mapType === 'satellite'
            ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        };

        const tileLayer = L.tileLayer(getTileUrl(), {
          attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
          maxZoom: 20,
        }).addTo(map);

        // Try to create a custom red icon, fallback to default if it fails
        let markerIcon;
        try {
          markerIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        } catch (e) {
          // Use default icon if custom icon fails
          markerIcon = new L.Icon.Default();
        }

        // Add marker with icon - ensure it's added after map is ready
        setTimeout(() => {
          const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                Customer Location
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                ${customerName}
              </p>
              <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">
                ${customerNumber}
              </p>
            </div>
          `).openPopup();
        }, 100);

        // Store map instance
        if (mounted) {
          mapInstanceRef.current = { map, tileLayer };
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();

    return () => {
      mounted = false;
      // Clean up the map instance
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
      setMapLoaded(false);
    };
  }, [isOpen, latitude, longitude, customerName, customerNumber]);

  // Update tile layer when mapType changes
  useEffect(() => {
    if (mapInstanceRef.current?.map && mapInstanceRef.current?.tileLayer) {
      const { map, tileLayer } = mapInstanceRef.current;
      
      // Remove old tile layer
      map.removeLayer(tileLayer);
      
      // Add new tile layer
      const L = window.L;
      const newTileUrl = mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      
      const newTileLayer = L.tileLayer(newTileUrl, {
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        maxZoom: 20,
      }).addTo(map);
      
      mapInstanceRef.current.tileLayer = newTileLayer;
    }
  }, [mapType]);

  if (!isOpen) return null;

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Customer Debt Location</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInGoogleMaps}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
              title="Open in Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Maps
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
              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <div ref={mapRef} className="w-full h-full" />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-gray-500">Loading map...</div>
                  </div>
                )}
              </div>
              
              {/* Map Type Toggle */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setMapType('street')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    mapType === 'street'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Street View
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    mapType === 'satellite'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Satellite View
                </button>
              </div>
            </div>

            {/* Customer Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex flex-col justify-start space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Number</p>
                  <p className="text-sm font-bold text-blue-600">{customerNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                  <p className="text-sm font-semibold text-gray-900">{customerName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{phoneNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meter Number</p>
                  <p className="text-sm font-semibold text-gray-900">{meterNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Zone</p>
                  <p className="text-sm font-semibold text-gray-900">{zone}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Paid Date</p>
                  <p className="text-sm font-semibold text-gray-900">{lastPaidDate}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Paid Amount</p>
                  <p className="text-sm font-semibold text-green-600">{lastPaidAmount}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Months Owed</p>
                  <p className="text-sm font-semibold text-orange-600">{monthsOwed} months</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount Owed</p>
                  <p className="text-xl font-bold text-red-600">{totalAmountOwed}</p>
                </div>

                {lastVisitOutcome && lastVisitOutcome !== 'N/A' && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Visit Outcome</p>
                    <p className="text-sm text-gray-700">{lastVisitOutcome}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};