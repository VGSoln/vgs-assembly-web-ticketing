'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, Database, ExternalLink } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';

interface StorageTankLocationsPageProps {}

export const StorageTankLocationsPage: React.FC<StorageTankLocationsPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
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

        // Custom marker creation function for market locations
        const createMarketLocationIcon = (level: 'high' | 'medium' | 'low') => {
          const colors = {
            high: '#10b981',    // Green - 70%+ full
            medium: '#f59e0b',  // Yellow - 30-70% full
            low: '#ef4444'      // Red - <30% full
          };
          
          const fillPercentage = {
            high: '85%',
            medium: '50%',
            low: '20%'
          };
          
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: white;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 3px solid ${colors[level]};
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: ${colors[level]};
              font-size: 11px;
              position: relative;
            ">
              <div style="
                position: absolute;
                bottom: 2px;
                left: 2px;
                right: 2px;
                height: ${fillPercentage[level]};
                background-color: ${colors[level]};
                opacity: 0.3;
                border-radius: 0 0 50% 50%;
              "></div>
              <span style="position: relative; z-index: 1;">${fillPercentage[level]}</span>
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18],
          });
        };

        // Storage tank locations data
        const marketLocations = [
          { 
            id: 1, 
            lat: 5.6037, 
            lng: -0.1870, 
            name: 'Main Market Location', 
            capacity: '500,000 L',
            currentLevel: '425,000 L',
            percentage: 85,
            level: 'high',
            zone: 'Zone 1'
          },
          { 
            id: 2, 
            lat: 5.6157, 
            lng: -0.1920, 
            name: 'North Market Location', 
            capacity: '350,000 L',
            currentLevel: '280,000 L',
            percentage: 80,
            level: 'high',
            zone: 'Zone 2'
          },
          { 
            id: 3, 
            lat: 5.5987, 
            lng: -0.1750, 
            name: 'East Market Location', 
            capacity: '400,000 L',
            currentLevel: '200,000 L',
            percentage: 50,
            level: 'medium',
            zone: 'Zone 3'
          },
          { 
            id: 4, 
            lat: 5.5937, 
            lng: -0.2000, 
            name: 'West Market Location', 
            capacity: '450,000 L',
            currentLevel: '90,000 L',
            percentage: 20,
            level: 'low',
            zone: 'Zone 4'
          },
          { 
            id: 5, 
            lat: 5.6087, 
            lng: -0.1650, 
            name: 'Central Market Location', 
            capacity: '600,000 L',
            currentLevel: '360,000 L',
            percentage: 60,
            level: 'medium',
            zone: 'Zone 5'
          },
          { 
            id: 6, 
            lat: 5.5887, 
            lng: -0.1820, 
            name: 'South Market Location', 
            capacity: '300,000 L',
            currentLevel: '45,000 L',
            percentage: 15,
            level: 'low',
            zone: 'Zone 6'
          },
          { 
            id: 7, 
            lat: 5.6117, 
            lng: -0.1700, 
            name: 'Reserve Market Location A', 
            capacity: '250,000 L',
            currentLevel: '225,000 L',
            percentage: 90,
            level: 'high',
            zone: 'Zone 1'
          },
          { 
            id: 8, 
            lat: 5.5967, 
            lng: -0.1900, 
            name: 'Reserve Market Location B', 
            capacity: '250,000 L',
            currentLevel: '100,000 L',
            percentage: 40,
            level: 'medium',
            zone: 'Zone 3'
          }
        ];

        // Add markers for market locations
        marketLocations.forEach((location) => {
          const icon = createMarketLocationIcon(location.level as 'high' | 'medium' | 'low');
          const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
          
          // Level colors for popup
          const levelColors = {
            high: '#10b981',
            medium: '#f59e0b',
            low: '#ef4444'
          };
          
          marker.bindPopup(`
            <div style="padding: 8px; min-width: 220px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
                ${location.name}
              </h3>
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 12px; color: #666;">Capacity:</span>
                  <span style="font-size: 12px; font-weight: 600;">${location.capacity}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 12px; color: #666;">Current Level:</span>
                  <span style="font-size: 12px; font-weight: 600; color: ${levelColors[location.level as keyof typeof levelColors]};">
                    ${location.currentLevel}
                  </span>
                </div>
                <div style="width: 100%; height: 20px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden; margin-top: 6px;">
                  <div style="width: ${location.percentage}%; height: 100%; background-color: ${levelColors[location.level as keyof typeof levelColors]}; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 11px; font-weight: bold;">${location.percentage}%</span>
                  </div>
                </div>
              </div>
              <p style="margin: 2px 0; color: #666; font-size: 12px;">
                Zone: <strong>${location.zone}</strong>
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

  const marketOptions = [
    { value: 'main', label: 'Main Market Location' },
    { value: 'north', label: 'North Market Location' },
    { value: 'east', label: 'East Market Location' },
    { value: 'west', label: 'West Market Location' },
    { value: 'central', label: 'Central Market Location' },
    { value: 'south', label: 'South Market Location' },
    { value: 'reserve-a', label: 'Reserve Market Location A' },
    { value: 'reserve-b', label: 'Reserve Market Location B' }
  ];

  // Market location statistics
  const marketStats = {
    total: 8
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
              value={selectedMarket}
              onChange={setSelectedMarket}
              placeholder="Select Market Location"
              options={marketOptions}
              className="w-full sm:w-auto min-w-[200px]"
            />
          </div>

          {/* Market Location Counter */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {marketStats.total}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-90">
                Total Market Locations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white flex-1 flex flex-col w-full relative" style={{ minHeight: 0, zIndex: 1 }}>
        {/* Map Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Market Locations</h2>
          
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
            style={{ zIndex: 1 }}
          />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
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