'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, Droplets } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface PumpStationLocationsPageProps {}

export const PumpStationLocationsPage: React.FC<PumpStationLocationsPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
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
          zoom: 12,
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

        // Custom marker creation function for pump stations
        const createPumpStationIcon = (status: 'active' | 'maintenance' | 'inactive') => {
          const colors = {
            active: '#10b981',      // Green
            maintenance: '#f59e0b', // Yellow
            inactive: '#ef4444'     // Red
          };
          
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${colors[status]};
              width: 32px;
              height: 32px;
              border-radius: 8px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });
        };

        // Pump station locations data
        const pumpStations = [
          { 
            id: 1, 
            lat: 5.6037, 
            lng: -0.1870, 
            name: 'Main Pump Station', 
            status: 'active',
            capacity: '5000 L/min',
            pressure: '4.2 bar',
            zone: 'Zone 1'
          },
          { 
            id: 2, 
            lat: 5.6157, 
            lng: -0.1920, 
            name: 'North Pump Station', 
            status: 'active',
            capacity: '3500 L/min',
            pressure: '3.8 bar',
            zone: 'Zone 2'
          },
          { 
            id: 3, 
            lat: 5.5987, 
            lng: -0.1750, 
            name: 'East Pump Station', 
            status: 'maintenance',
            capacity: '4000 L/min',
            pressure: '0.0 bar',
            zone: 'Zone 3'
          },
          { 
            id: 4, 
            lat: 5.5937, 
            lng: -0.2000, 
            name: 'West Pump Station', 
            status: 'active',
            capacity: '4500 L/min',
            pressure: '4.0 bar',
            zone: 'Zone 4'
          },
          { 
            id: 5, 
            lat: 5.6087, 
            lng: -0.1650, 
            name: 'Central Pump Station', 
            status: 'active',
            capacity: '6000 L/min',
            pressure: '4.5 bar',
            zone: 'Zone 5'
          },
          { 
            id: 6, 
            lat: 5.5887, 
            lng: -0.1820, 
            name: 'South Pump Station', 
            status: 'inactive',
            capacity: '3000 L/min',
            pressure: '0.0 bar',
            zone: 'Zone 6'
          }
        ];

        // Add markers for pump stations
        pumpStations.forEach((station) => {
          const icon = createPumpStationIcon(station.status as 'active' | 'maintenance' | 'inactive');
          const marker = L.marker([station.lat, station.lng], { icon }).addTo(map);
          
          // Status colors for popup
          const statusColors = {
            active: '#10b981',
            maintenance: '#f59e0b',
            inactive: '#ef4444'
          };
          
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
                ${station.name}
              </h3>
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${statusColors[station.status as keyof typeof statusColors]}; margin-right: 6px;"></span>
                <span style="font-size: 12px; text-transform: uppercase; font-weight: 600; color: ${statusColors[station.status as keyof typeof statusColors]};">
                  ${station.status}
                </span>
              </div>
              <p style="margin: 2px 0; color: #666; font-size: 12px;">
                Zone: <strong>${station.zone}</strong>
              </p>
              <p style="margin: 2px 0; color: #666; font-size: 12px;">
                Capacity: <strong>${station.capacity}</strong>
              </p>
              <p style="margin: 2px 0; color: #666; font-size: 12px;">
                Pressure: <strong>${station.pressure}</strong>
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

  const stationOptions = [
    { value: 'main', label: 'Main Pump Station' },
    { value: 'north', label: 'North Pump Station' },
    { value: 'east', label: 'East Pump Station' },
    { value: 'west', label: 'West Pump Station' },
    { value: 'central', label: 'Central Pump Station' },
    { value: 'south', label: 'South Pump Station' }
  ];

  // Station statistics
  const stationStats = {
    total: 6
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
              value={selectedStation}
              onChange={setSelectedStation}
              placeholder="Select Station"
              options={stationOptions}
              className="w-full sm:w-auto min-w-[200px]"
            />
          </div>

          {/* Station Counter */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stationStats.total}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-90">
                Total Pump Stations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white flex-1 flex flex-col w-full" style={{ minHeight: 0, overflow: 'hidden' }}>
        {/* Map Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Pump Station Locations</h2>
          
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
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