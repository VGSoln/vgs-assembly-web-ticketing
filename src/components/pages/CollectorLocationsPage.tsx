'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { collectorOptions } from '@/lib/data';

interface CollectorLocationsPageProps {}

export const CollectorLocationsPage: React.FC<CollectorLocationsPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsOwed, setSelectedMonthsOwed] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
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

        // Custom marker creation function for collectors
        const createCustomIcon = (color: string) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${color};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">C</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
          });
        };

        // Collector locations data
        const collectorLocations = [
          { id: 1, lat: 5.6037, lng: -0.1870, name: 'Collector John Doe', zone: 'Zone 1', customers: 45 },
          { id: 2, lat: 5.6157, lng: -0.1820, name: 'Collector Jane Smith', zone: 'Zone 2', customers: 52 },
          { id: 3, lat: 5.6087, lng: -0.1750, name: 'Collector Bob Johnson', zone: 'Zone 3', customers: 38 },
          { id: 4, lat: 5.5997, lng: -0.1700, name: 'Collector Mary Brown', zone: 'Zone 4', customers: 41 },
          { id: 5, lat: 5.5987, lng: -0.2000, name: 'Collector James Wilson', zone: 'Zone 5', customers: 48 },
          { id: 6, lat: 5.6057, lng: -0.1600, name: 'Collector Sarah Davis', zone: 'Zone 6', customers: 56 },
          { id: 7, lat: 5.6137, lng: -0.1650, name: 'Collector Michael Lee', zone: 'Zone 1', customers: 43 },
          { id: 8, lat: 5.5937, lng: -0.1950, name: 'Collector Emma Garcia', zone: 'Zone 2', customers: 39 },
        ];

        // Add markers for collectors
        collectorLocations.forEach((location) => {
          const icon = createCustomIcon('#3b82f6'); // Blue color for collectors
          const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
          
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${location.name}
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Zone: <strong>${location.zone}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Customers: <strong>${location.customers}</strong>
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
    noGps: 2,
    withGps: 8,
    total: 10
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50" style={{ overflow: 'hidden' }}>
      {/* Top Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 w-full" style={{ overflow: 'hidden' }}>
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
              placeholder="Months Owed"
              options={monthsOwedOptions}
              className="w-full sm:w-auto min-w-[180px]"
            />
            <ModernSelect
              value={selectedCollector}
              onChange={setSelectedCollector}
              placeholder="Select Collector"
              options={collectorOptions}
              className="w-full sm:w-auto min-w-[200px]"
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
      <div className="bg-white flex-1 flex flex-col w-full" style={{ minHeight: 0, overflow: 'hidden' }}>
        {/* Map Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Collector Locations</h2>
          
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            
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
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 relative" style={{ minHeight: 0, overflow: 'hidden' }}>
          <div 
            ref={mapRef}
            className="w-full h-full absolute inset-0"
            style={{ overflow: 'hidden' }}
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
    </div>
  );
};