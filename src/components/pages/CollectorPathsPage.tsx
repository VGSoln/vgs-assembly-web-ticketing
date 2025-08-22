'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, Calendar } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { ModernDatePicker } from '../ui/ModernDatePicker';
import { collectorOptions } from '@/lib/data';

interface CollectorPathsPageProps {}

export const CollectorPathsPage: React.FC<CollectorPathsPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
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
        const createCustomIcon = (color: string, label: string) => {
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
            ">${label}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
          });
        };

        // Collector paths data - multiple paths showing different routes
        const collectorPaths = [
          {
            id: 1,
            name: 'Collector John Doe',
            color: '#3b82f6',
            path: [
              [5.6037, -0.1870],
              [5.6057, -0.1850],
              [5.6077, -0.1830],
              [5.6097, -0.1810],
              [5.6117, -0.1820],
              [5.6137, -0.1840],
              [5.6157, -0.1820],
            ],
            stops: 12,
            distance: '5.2 km'
          },
          {
            id: 2,
            name: 'Collector Jane Smith',
            color: '#10b981',
            path: [
              [5.5987, -0.2000],
              [5.5997, -0.1980],
              [5.6007, -0.1960],
              [5.6017, -0.1940],
              [5.6027, -0.1920],
              [5.6037, -0.1900],
              [5.6047, -0.1880],
            ],
            stops: 15,
            distance: '4.8 km'
          },
          {
            id: 3,
            name: 'Collector Bob Johnson',
            color: '#f59e0b',
            path: [
              [5.5937, -0.1950],
              [5.5947, -0.1930],
              [5.5957, -0.1910],
              [5.5967, -0.1890],
              [5.5977, -0.1870],
              [5.5987, -0.1850],
              [5.5997, -0.1830],
            ],
            stops: 10,
            distance: '3.7 km'
          }
        ];

        // Add paths and markers for each collector
        collectorPaths.forEach((collector, index) => {
          // Draw the path
          const polyline = L.polyline(collector.path as [number, number][], {
            color: collector.color,
            weight: 4,
            opacity: 0.7,
            smoothFactor: 1
          }).addTo(map);

          // Add start marker
          const startIcon = createCustomIcon(collector.color, 'S');
          const startMarker = L.marker(collector.path[0] as [number, number], { icon: startIcon }).addTo(map);
          startMarker.bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${collector.name} - Start
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Route Distance: <strong>${collector.distance}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Stops: <strong>${collector.stops}</strong>
              </p>
            </div>
          `);

          // Add end marker
          const endIcon = createCustomIcon(collector.color, 'E');
          const endMarker = L.marker(collector.path[collector.path.length - 1] as [number, number], { icon: endIcon }).addTo(map);
          endMarker.bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${collector.name} - End
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Route Completed
              </p>
            </div>
          `);

          // Add intermediate stop markers
          collector.path.slice(1, -1).forEach((point, stopIndex) => {
            const stopIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: white;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid ${collector.color};
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            });
            const stopMarker = L.marker(point as [number, number], { icon: stopIcon }).addTo(map);
            stopMarker.bindPopup(`
              <div style="padding: 8px;">
                <p style="margin: 0; font-size: 12px;">
                  ${collector.name}<br>
                  Stop ${stopIndex + 2} of ${collector.stops}
                </p>
              </div>
            `);
          });
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

  // GPS statistics
  const gpsStats = {
    noGps: 46,
    withGps: 1559,
    total: 1605
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
              value={selectedCollector}
              onChange={setSelectedCollector}
              placeholder="Select Collector"
              options={collectorOptions}
              className="w-full sm:w-auto min-w-[200px]"
            />
            <ModernDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className="w-full sm:w-auto min-w-[150px]"
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
          <h2 className="text-lg font-semibold text-gray-900">Collector Paths</h2>
          
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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