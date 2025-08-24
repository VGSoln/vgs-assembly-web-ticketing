'use client'
import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';

interface PumpStationLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
  stationNumber: string;
  meterNumber?: string;
  pumpCapacity?: number;
  flowRate?: number;
  reading?: number;
  lastReading?: string;
  operationalStatus?: string;
  location?: string;
  city?: string;
  staffName?: string;
  latitude?: number;
  longitude?: number;
}

export const PumpStationLocationModal: React.FC<PumpStationLocationModalProps> = ({
  isOpen,
  onClose,
  stationName,
  stationNumber,
  meterNumber = 'N/A',
  pumpCapacity = 0,
  flowRate = 0,
  reading = 0,
  lastReading,
  operationalStatus = 'Operational',
  location = 'N/A',
  city = 'N/A',
  staffName = 'N/A',
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

        // Create icon based on operational status - green for Operational, red for Out of Service
        let markerIcon;
        try {
          const iconColor = operationalStatus.toLowerCase() === 'out of service' ? 'red' : 'green';
          markerIcon = L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
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
                Pump Station Location
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Station: <strong>${stationName}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Station #: <strong>${stationNumber}</strong>
              </p>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
                Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}
              </p>
            </div>
          `);
          
          // Ensure the map view includes the marker
          map.setView([latitude, longitude], 16);
        }, 100);

        mapInstanceRef.current = { map, tileLayer };
        
        if (mounted) {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    // Load map after a short delay
    const timer = setTimeout(() => {
      loadMap();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, latitude, longitude, stationName, stationNumber, mapType, operationalStatus]);

  // Handle map type changes
  useEffect(() => {
    if (mapInstanceRef.current?.tileLayer && mapInstanceRef.current?.map) {
      const { map, tileLayer } = mapInstanceRef.current;
      
      // Remove old tile layer
      map.removeLayer(tileLayer);
      
      // Import Leaflet and add new tile layer
      import('leaflet').then(({ default: L }) => {
        const newTileUrl = mapType === 'satellite'
          ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
          : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        
        const newTileLayer = L.tileLayer(newTileUrl, {
          attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
          maxZoom: 20,
        }).addTo(map);
        
        mapInstanceRef.current.tileLayer = newTileLayer;
      });
    }
  }, [mapType]);

  // Cleanup map when modal closes
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.map.remove();
      mapInstanceRef.current = null;
      setMapLoaded(false);
      setMapType('street'); // Reset map type
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenInNewWindow = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16`;
    window.open(googleMapsUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
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
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Pump Station Location</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded text-white text-sm transition-colors"
              title="Open in Google Maps"
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
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px] relative">
                <div 
                  ref={mapRef}
                  className="w-full h-full"
                />
                
                {/* Map Type Toggle */}
                <div className="absolute top-3 left-3 z-[1000] bg-white rounded-lg shadow-lg p-1 flex">
                  <button 
                    onClick={() => setMapType('street')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      mapType === 'street' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Map
                  </button>
                  <button 
                    onClick={() => setMapType('satellite')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      mapType === 'satellite' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Satellite
                  </button>
                </div>

                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-sm text-gray-600">Loading Map...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Station Information - Takes 1/3 of space */}
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex flex-col justify-center space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Station #</p>
                  <p className="text-sm font-semibold text-blue-600">{stationNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Station Name</p>
                  <p className="text-sm font-semibold text-gray-900">{stationName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meter Number</p>
                  <p className="text-sm font-semibold text-gray-900">{meterNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pump Capacity</p>
                  <p className="text-sm font-semibold text-gray-900">{pumpCapacity.toLocaleString()} m³/h</p>
                </div>

                {lastReading && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Reading Date</p>
                    <p className="text-sm font-semibold text-gray-900">{lastReading}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Staff Name</p>
                  <p className="text-sm font-semibold text-gray-900">{staffName}</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <p className={`text-lg font-bold ${getStatusColor(operationalStatus)}`}>
                    {operationalStatus}
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Reading</p>
                    <p className="text-2xl font-bold text-blue-600">{(reading || flowRate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};