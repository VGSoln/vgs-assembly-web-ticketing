'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, ExternalLink, Calendar } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { collectorOptions } from '@/lib/data';
import { DateRange } from '@/types/dashboard';
import { getDatePresets } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getGPSTransactions } from '@/lib/api';

interface CollectorLocationsPageProps {}

interface GPSTransaction {
  id: string;
  'customer-id': string;
  'customer-name'?: string;
  'customer-type-name'?: string;
  'ticket-type-name'?: string;
  'location-name'?: string;
  amount: number;
  'transaction-date': string;
  'user-name'?: string;
  'gps-latitude': number;
  'gps-longitude': number;
  'payments-count'?: number;
}

export const CollectorLocationsPage: React.FC<CollectorLocationsPageProps> = () => {
  const { user } = useAuth();
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState<'market' | 'lorry-park' | ''>('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Date range state - default to today
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('today');
  const [displayDateRange, setDisplayDateRange] = useState('Today');

  // API data state
  const [gpsTransactions, setGpsTransactions] = useState<GPSTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch GPS transactions from API
  useEffect(() => {
    const fetchGPSData = async () => {
      if (!user?.['assembly-id']) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getGPSTransactions({
          'assembly-id': user['assembly-id'],
          'start-date': selectedDateRange.start,
          'end-date': selectedDateRange.end,
          ...(selectedCollector && { 'user-id': selectedCollector }),
        });

        setGpsTransactions(data);
      } catch (err) {
        console.error('Error fetching GPS transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch GPS data');
      } finally {
        setLoading(false);
      }
    };

    fetchGPSData();
  }, [user, selectedDateRange, selectedCollector]);

  // Map initialization and update with real data
  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      if (!mapRef.current || mapInstanceRef.current || loading) return;

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

        // Custom marker creation function for customers
        const createCustomIcon = (color: string, isNew: boolean = false) => {
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
              font-size: 10px;
            ">${isNew ? '🆕' : '💰'}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
          });
        };

        // Add markers for GPS transactions from API
        const markers: any[] = [];
        gpsTransactions.forEach((transaction) => {
          // Skip transactions without GPS coordinates
          if (!transaction['gps-latitude'] || !transaction['gps-longitude']) return;

          // Determine if customer is new (payments-count <= 1)
          const isNew = (transaction['payments-count'] || 1) <= 1;
          const color = isNew ? '#10b981' : '#3b82f6';
          const icon = createCustomIcon(color, isNew);

          const marker = L.marker(
            [transaction['gps-latitude'], transaction['gps-longitude']],
            { icon }
          ).addTo(map);

          marker.bindPopup(`
            <div style="padding: 10px; min-width: 200px;">
              <div style="background: ${color}; color: white; padding: 6px; border-radius: 4px 4px 0 0; margin: -10px -10px 8px -10px;">
                <h3 style="margin: 0; font-weight: bold; font-size: 14px;">
                  ${transaction['customer-name'] || 'Unknown Customer'}
                </h3>
                <span style="font-size: 11px; opacity: 0.9;">
                  ${isNew ? 'New Customer' : `Existing Customer (${transaction['payments-count'] || 0} payments)`}
                </span>
              </div>
              <div style="padding-top: 4px;">
                ${transaction['customer-type-name'] ? `<p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Type:</strong> ${transaction['customer-type-name']}
                </p>` : ''}
                ${transaction['ticket-type-name'] ? `<p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Ticket:</strong> ${transaction['ticket-type-name']}
                </p>` : ''}
                ${transaction['location-name'] ? `<p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Location:</strong> ${transaction['location-name']}
                </p>` : ''}
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Amount:</strong> GHS ${transaction.amount.toFixed(2)}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Date:</strong> ${transaction['transaction-date']}
                </p>
                ${transaction['user-name'] ? `<p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Collector:</strong> ${transaction['user-name']}
                </p>` : ''}
              </div>
            </div>
          `);

          markers.push(marker);
        });

        // Auto-fit bounds to show all markers if there are any
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        mapInstanceRef.current = { map, tileLayer, markers };

        if (mounted) {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    // Load map after component mounts and data is loaded
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
  }, [loading, gpsTransactions]);

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

  const ticketTypeOptions = [
    { value: 'market', label: 'Market' },
    { value: 'lorry-park', label: 'Lorry Park' }
  ];

  // Transaction statistics from real data
  const transactionStats = {
    newCustomers: gpsTransactions.filter(t => (t['payments-count'] || 1) <= 1).length,
    existingCustomers: gpsTransactions.filter(t => (t['payments-count'] || 1) > 1).length,
    total: gpsTransactions.length
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Top Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0 w-full relative" style={{ zIndex: 1000 }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 max-w-full">
          {/* Filter Controls with Date Range Picker First */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap flex-1">
            {/* Date Range Picker - First */}
            <DateRangePicker
              isOpen={dateRangeOpen}
              selectedDateRange={selectedDateRange}
              displayDateRange={displayDateRange}
              activePreset={activePreset}
              onToggle={() => setDateRangeOpen(!dateRangeOpen)}
              onPresetSelect={(preset: string) => {
                const presets = getDatePresets() as Record<string, any>;
                if (presets[preset]) {
                  setSelectedDateRange({ start: presets[preset].start, end: presets[preset].end });
                  setActivePreset(preset);
                  setDisplayDateRange(presets[preset].label);
                  setDateRangeOpen(false);
                }
              }}
              onDateChange={setSelectedDateRange}
              onApplyRange={() => {
                // Update display text based on selected range
                const start = new Date(selectedDateRange.start);
                const end = new Date(selectedDateRange.end);
                const today = new Date().toISOString().split('T')[0];
                
                if (selectedDateRange.start === selectedDateRange.end) {
                  if (selectedDateRange.start === today) {
                    setDisplayDateRange('Today');
                  } else {
                    setDisplayDateRange(start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                  }
                } else {
                  setDisplayDateRange(
                    `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  );
                }
                setActivePreset('custom');
                setDateRangeOpen(false);
              }}
            />
            
            {/* Dropdowns - Reordered as requested */}
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
              placeholder="Zone"
              options={zoneOptions}
              className="w-full sm:w-auto min-w-[100px]"
            />
            <ModernSelect
              value={selectedTicketType}
              onChange={setSelectedTicketType}
              placeholder="Ticket Type"
              options={ticketTypeOptions}
              className="w-full sm:w-auto min-w-[130px]"
            />
            <ModernSelect
              value={selectedCollector}
              onChange={setSelectedCollector}
              placeholder="Select Collector"
              options={collectorOptions}
              className="w-full sm:w-auto min-w-[150px]"
            />
          </div>

          {/* Transaction Counter */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {transactionStats.newCustomers} | {transactionStats.existingCustomers}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-90">
                New | Existing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white flex-1 flex flex-col w-full relative" style={{ minHeight: 0, zIndex: 1 }}>
        {/* Map Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Customer Transaction Locations</h2>
          
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

          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading GPS Data...</p>
                <p className="text-xs text-gray-500 mt-2">Fetching transaction locations...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6 max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading GPS Data</h3>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Map Loading State */}
          {!loading && !error && !mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading Map...</p>
                <p className="text-xs text-gray-500 mt-2">Initializing Google Maps with Leaflet...</p>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && mapLoaded && gpsTransactions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 pointer-events-none">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No GPS Data Available</h3>
                <p className="text-sm text-gray-600">No transactions with GPS coordinates found for the selected date range.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};