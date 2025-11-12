'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, Calendar, ExternalLink } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { ModernDatePicker } from '../ui/ModernDatePicker';
import { useAuth } from '@/contexts/AuthContext';
import { getOfficerPaths, getUsers, getZones } from '@/lib/api';

interface CollectorPathsPageProps {}

interface PathPoint {
  'gps-latitude': number;
  'gps-longitude': number;
  timestamp: string;
}

interface OfficerPath {
  'user-id': string;
  'user-name': string;
  date: string;
  path: PathPoint[];
  'transaction-count': number;
  'total-distance-km': number;
}

export const CollectorPathsPage: React.FC<CollectorPathsPageProps> = () => {
  const { user } = useAuth();
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pathData, setPathData] = useState<OfficerPath[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Fetch users and zones on mount
  useEffect(() => {
    if (!user?.['assembly-id']) return;

    const fetchFilters = async () => {
      try {
        const [usersData, zonesData] = await Promise.all([
          getUsers({ 'assembly-id': user['assembly-id'], role: 'officer' }),
          getZones({ 'assembly-id': user['assembly-id'], 'active-only': true })
        ]);
        setUsers(usersData);
        setZones(zonesData);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, [user]);

  // Fetch path data when filters change
  useEffect(() => {
    if (!user?.['assembly-id'] || !selectedCollector || !selectedDate) return;

    const fetchPaths = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOfficerPaths({
          'assembly-id': user['assembly-id'],
          'user-id': selectedCollector,
          date: selectedDate
        });
        setPathData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching paths:', err);
        setError(err instanceof Error ? err.message : 'Failed to load path data');
        setPathData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, [user, selectedCollector, selectedDate]);

  // Initialize map
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

        mapInstanceRef.current = { map, tileLayer, layers: [] };

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
  }, [mapType]);

  // Update map with path data
  useEffect(() => {
    if (!mapInstanceRef.current?.map || !pathData.length) return;

    const updateMapPaths = async () => {
      try {
        const L = (await import('leaflet')).default;
        const { map, layers } = mapInstanceRef.current;

        // Clear existing path layers
        if (layers && layers.length > 0) {
          layers.forEach((layer: any) => map.removeLayer(layer));
          mapInstanceRef.current.layers = [];
        }

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        const newLayers: any[] = [];

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

        // Add paths and markers for each officer
        pathData.forEach((officerPath, index) => {
          const color = colors[index % colors.length];
          const pathCoords = officerPath.path.map(p => [p['gps-latitude'], p['gps-longitude']] as [number, number]);

          if (pathCoords.length === 0) return;

          // Draw the path
          const polyline = L.polyline(pathCoords, {
            color: color,
            weight: 4,
            opacity: 0.7,
            smoothFactor: 1
          }).addTo(map);
          newLayers.push(polyline);

          // Add start marker
          const startIcon = createCustomIcon(color, 'S');
          const startMarker = L.marker(pathCoords[0], { icon: startIcon }).addTo(map);
          startMarker.bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${officerPath['user-name']} - Start
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Route Distance: <strong>${officerPath['total-distance-km']?.toFixed(2) || '0.00'} km</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Transactions: <strong>${officerPath['transaction-count'] || 0}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Time: <strong>${officerPath.path[0]?.timestamp ? new Date(officerPath.path[0].timestamp).toLocaleTimeString() : 'N/A'}</strong>
              </p>
            </div>
          `);
          newLayers.push(startMarker);

          // Add end marker
          if (pathCoords.length > 1) {
            const endIcon = createCustomIcon(color, 'E');
            const endMarker = L.marker(pathCoords[pathCoords.length - 1], { icon: endIcon }).addTo(map);
            endMarker.bindPopup(`
              <div style="padding: 8px; min-width: 180px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                  ${officerPath['user-name']} - End
                </h3>
                <p style="margin: 0; color: #666; font-size: 12px;">
                  Time: <strong>${officerPath.path[officerPath.path.length - 1]?.timestamp ? new Date(officerPath.path[officerPath.path.length - 1].timestamp).toLocaleTimeString() : 'N/A'}</strong>
                </p>
              </div>
            `);
            newLayers.push(endMarker);
          }

          // Add intermediate stop markers
          pathCoords.slice(1, -1).forEach((point, stopIndex) => {
            const stopIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                background-color: white;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid ${color};
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            });
            const stopMarker = L.marker(point, { icon: stopIcon }).addTo(map);
            const pathPoint = officerPath.path[stopIndex + 1];
            stopMarker.bindPopup(`
              <div style="padding: 8px;">
                <p style="margin: 0; font-size: 12px;">
                  <strong>${officerPath['user-name']}</strong><br>
                  Stop ${stopIndex + 2} of ${pathCoords.length}<br>
                  ${pathPoint?.timestamp ? new Date(pathPoint.timestamp).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            `);
            newLayers.push(stopMarker);
          });

          // Fit map to bounds
          if (pathCoords.length > 0) {
            map.fitBounds(pathCoords);
          }
        });

        mapInstanceRef.current.layers = newLayers;
      } catch (error) {
        console.error('Error updating map paths:', error);
      }
    };

    updateMapPaths();
  }, [pathData]);

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

  // Convert users to collector options
  const collectorOptions = users.map(u => ({
    value: u.id,
    label: `${u['first-name']} ${u['last-name']}`
  }));

  // Convert zones to zone options
  const zoneOptions = zones.map(z => ({
    value: z.id,
    label: z.name
  }));

  // Calculate GPS statistics from path data
  const gpsStats = pathData.reduce((acc, path) => {
    const pathsWithoutGPS = path.path.filter(p => !p['gps-latitude'] || !p['gps-longitude']).length;
    const pathsWithGPS = path.path.filter(p => p['gps-latitude'] && p['gps-longitude']).length;
    return {
      noGps: acc.noGps + pathsWithoutGPS,
      withGps: acc.withGps + pathsWithGPS,
      total: acc.total + path.path.length
    };
  }, { noGps: 0, withGps: 0, total: 0 });

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Top Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 w-full relative" style={{ zIndex: 1000 }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 max-w-full">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            <ModernSelect
              value={selectedZone}
              onChange={setSelectedZone}
              placeholder="Zone"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading Map...</p>
                <p className="text-xs text-gray-500 mt-2">Initializing Google Maps with Leaflet...</p>
              </div>
            </div>
          )}

          {mapLoaded && loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-10">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto mb-3"></div>
                <p className="text-sm text-gray-700 font-medium">Loading path data...</p>
              </div>
            </div>
          )}

          {mapLoaded && error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-10 max-w-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {mapLoaded && !loading && !error && pathData.length === 0 && selectedCollector && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Path Data</h3>
                <p className="text-sm text-gray-600">
                  No GPS path data found for the selected collector and date.
                  Try selecting a different date or collector.
                </p>
              </div>
            </div>
          )}

          {mapLoaded && !selectedCollector && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Collector</h3>
                <p className="text-sm text-gray-600">
                  Please select a collector from the dropdown to view their GPS path data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};