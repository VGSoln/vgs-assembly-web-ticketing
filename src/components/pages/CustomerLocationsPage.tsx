'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, ExternalLink } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface CustomerLocationsPageProps {}

export const CustomerLocationsPage: React.FC<CustomerLocationsPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsOwed, setSelectedMonthsOwed] = useState('');
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Import Leaflet
        const L = (await import('leaflet')).default;
        
        // Fix default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map
        const map = L.map(mapRef.current, {
          center: [5.6037, -0.1870], // Accra, Ghana
          zoom: 13,
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

        // Custom marker creation function
        const createCustomIcon = (color: string) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${color};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });
        };

        // Customer locations
        const customerLocations = [
          { id: 1, lat: 5.6037, lng: -0.1870, status: 'paid', name: 'Customer A', debt: '0 months' },
          { id: 2, lat: 5.6157, lng: -0.1820, status: 'paid', name: 'Customer B', debt: '0 months' },
          { id: 3, lat: 5.6087, lng: -0.1750, status: '1-month-debt', name: 'Customer E', debt: '1 month' },
          { id: 4, lat: 5.5997, lng: -0.1700, status: '1-month-debt', name: 'Customer F', debt: '1 month' },
          { id: 5, lat: 5.5987, lng: -0.2000, status: '2-month-debt', name: 'Customer I', debt: '2 months' },
          { id: 6, lat: 5.6057, lng: -0.1600, status: '3-month-debt', name: 'Customer K', debt: '3 months' },
          { id: 7, lat: 5.6137, lng: -0.1650, status: '4-plus-debt', name: 'Customer M', debt: '4 months' },
          { id: 8, lat: 5.5937, lng: -0.1950, status: 'paid', name: 'Customer C', debt: '0 months' },
          { id: 9, lat: 5.5847, lng: -0.1880, status: 'paid', name: 'Customer D', debt: '0 months' },
          { id: 10, lat: 5.5917, lng: -0.1730, status: '1-month-debt', name: 'Customer G', debt: '1 month' },
        ];

        // Color mapping
        const getMarkerColor = (status: string) => {
          switch (status) {
            case 'paid': return '#10b981';
            case '1-month-debt': return '#3b82f6';
            case '2-month-debt': return '#8b5cf6';
            case '3-month-debt': return '#f59e0b';
            case '4-plus-debt': return '#ef4444';
            default: return '#6b7280';
          }
        };

        // Add markers
        customerLocations.forEach((location) => {
          const icon = createCustomIcon(getMarkerColor(location.status));
          const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
          
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${location.name}
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Status: <strong>${location.status.replace(/-/g, ' ')}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Debt: <strong>${location.debt}</strong>
              </p>
            </div>
          `);
        });

        mapInstanceRef.current = { map, tileLayer };
        
        if (mounted) {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    // Load map after component mounts
    const timer = setTimeout(() => {
      loadMap();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

  // Mock data for filters
  const businessCenterOptions = [
    { value: 'bc1', label: 'Business Center 1' },
    { value: 'bc2', label: 'Business Center 2' },
    { value: 'bc3', label: 'Business Center 3' }
  ];

  const zoneOptions = [
    { value: 'zone1', label: 'Zone 1' },
    { value: 'zone2', label: 'Zone 2' },
    { value: 'zone3', label: 'Zone 3' },
    { value: 'zone4', label: 'Zone 4' },
    { value: 'zone5', label: 'Zone 5' },
    { value: 'zone6', label: 'Zone 6' }
  ];

  const monthsOwedOptions = [
    { value: '0', label: 'Current (0 months)' },
    { value: '1', label: '1 Month' },
    { value: '2', label: '2 Months' },
    { value: '3', label: '3 Months' },
    { value: '4+', label: '4+ Months' }
  ];

  // GPS statistics
  const gpsStats = {
    noGps: 46,
    withGps: 1559,
    total: 1605
  };

  // Customer statistics for legend
  const customerStats = {
    paid: 156,
    '1-month-debt': 491,
    '2-month-debt': 307,
    '3-month-debt': 174,
    '4-plus-debt': 340
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Top Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 w-full relative" style={{ zIndex: 1000 }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 max-w-full">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            <ModernSelect
              value={selectedBusinessCenter}
              onChange={setSelectedBusinessCenter}
              placeholder="Select Business Center"
              options={businessCenterOptions}
              className="w-full sm:w-auto min-w-[200px]"
            />
            <ModernSelect
              value={selectedZone}
              onChange={setSelectedZone}
              placeholder="Zones"
              options={zoneOptions}
              className="w-full sm:w-auto min-w-[150px]"
            />
            <ModernSelect
              value={selectedMonthsOwed}
              onChange={setSelectedMonthsOwed}
              placeholder="Months since Last Payment"
              options={monthsOwedOptions}
              className="w-full sm:w-auto min-w-[180px]"
            />
          </div>

          {/* GPS Counter */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {gpsStats.noGps} | {gpsStats.withGps}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-90">
                No GPS | GPS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white flex-1 flex flex-col w-full relative" style={{ minHeight: 0, zIndex: 1 }}>
        {/* Map Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Customer Locations</h2>
          
          <div className="flex items-center gap-3">
            {/* Map Type Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMapType('street')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  mapType === 'street'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  mapType === 'satellite'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Satellite className="w-4 h-4" />
                Satellite
              </button>
            </div>
            
            {/* Open in Browser Button */}
            <button
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              title="Open map in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Browser
            </button>
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 relative" style={{ minHeight: 0, overflow: 'hidden', zIndex: 1 }}>
          <div 
            ref={mapRef}
            className="w-full h-full absolute inset-0"
            style={{ overflow: 'hidden', zIndex: 1 }}
          />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading Map...</p>
                <p className="text-xs text-gray-500 mt-2">Initializing Google Maps with Leaflet...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend - Sits flush with footer */}
      <div className="py-2 px-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 w-full">
        <div className="flex flex-wrap items-center gap-2 overflow-hidden">
          <h3 className="text-xs font-medium text-gray-700">Legend:</h3>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">Month Less ({customerStats.paid})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">1 Month ({customerStats['1-month-debt']})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">2 Months ({customerStats['2-month-debt']})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">3 Months ({customerStats['3-month-debt']})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">4+ Month ({customerStats['4-plus-debt']})</span>
          </div>
        </div>
      </div>
    </div>
  );
};