'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, ExternalLink } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { getCustomers } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerLocationsPageProps {}

interface CustomerLocation {
  'customer-id': string;
  'customer-number': string;
  phone: string;
  'location-name': string;
  'customer-type-name': string;
  'gps-latitude': number;
  'gps-longitude': number;
  'last-payment-date'?: string;
  'transaction-count': number;
}

export const CustomerLocationsPage: React.FC<CustomerLocationsPageProps> = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedMonthsOwed, setSelectedMonthsOwed] = useState('');
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Fetch customers with GPS coordinates
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user?.['assembly-id']) {
        setError('No assembly ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCustomers({
          'assembly-id': user['assembly-id'],
          'active-only': true
        });

        // Filter customers with GPS coordinates
        const customersWithGPS = data.filter(
          (customer: any) =>
            customer['gps-latitude'] != null &&
            customer['gps-longitude'] != null
        );

        setCustomers(customersWithGPS);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

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

        // Calculate center from customers or default to Accra
        let center: [number, number] = [5.6037, -0.1870];
        if (customers.length > 0) {
          const avgLat = customers.reduce((sum, c) => sum + c['gps-latitude'], 0) / customers.length;
          const avgLng = customers.reduce((sum, c) => sum + c['gps-longitude'], 0) / customers.length;
          center = [avgLat, avgLng];
        }

        // Create map
        const map = L.map(mapRef.current, {
          center,
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

        // Add markers for each customer
        customers.forEach((customer) => {
          const monthsSince = getMonthsSincePayment(customer['last-payment-date']);
          const status = getPaymentStatus(monthsSince);
          const icon = createCustomIcon(getMarkerColor(status));
          const marker = L.marker(
            [customer['gps-latitude'], customer['gps-longitude']],
            { icon }
          ).addTo(map);

          marker.bindPopup(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">
                ${customer['customer-number']}
              </h3>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Phone: <strong>${customer.phone}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Location: <strong>${customer['location-name']}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Type: <strong>${customer['customer-type-name']}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Last Payment: <strong>${customer['last-payment-date'] || 'Never'}</strong>
              </p>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Months Since: <strong>${monthsSince === 99 ? 'Never' : monthsSince}</strong>
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

    // Load map after component mounts and customers are loaded
    if (!loading && customers.length > 0) {
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
    }

    return () => {
      mounted = false;
    };
  }, [loading, customers, mapType]);

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

  // Mock data for filters (TODO: Replace with real data from API)
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

  // Helper function to calculate months since last payment
  const getMonthsSincePayment = (lastPaymentDate?: string): number => {
    if (!lastPaymentDate) return 99; // No payment ever
    const lastPayment = new Date(lastPaymentDate);
    const now = new Date();
    const months = (now.getFullYear() - lastPayment.getFullYear()) * 12 +
                  (now.getMonth() - lastPayment.getMonth());
    return Math.max(0, months);
  };

  // Helper function to get status based on months since payment
  const getPaymentStatus = (monthsSince: number): string => {
    if (monthsSince === 0) return 'paid';
    if (monthsSince === 1) return '1-month-debt';
    if (monthsSince === 2) return '2-month-debt';
    if (monthsSince === 3) return '3-month-debt';
    return '4-plus-debt';
  };

  // Calculate GPS statistics from real data (need to fetch all customers)
  const [allCustomers, setAllCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      if (!user?.['assembly-id']) return;

      try {
        const data = await getCustomers({
          'assembly-id': user['assembly-id'],
          'active-only': true
        });
        setAllCustomers(data);
      } catch (err) {
        console.error('Error fetching all customers for stats:', err);
      }
    };

    fetchAllCustomers();
  }, [user]);

  // GPS statistics from real data
  const gpsStats = {
    noGps: allCustomers.filter(c => !c['gps-latitude'] || !c['gps-longitude']).length,
    withGps: allCustomers.filter(c => c['gps-latitude'] && c['gps-longitude']).length,
    total: allCustomers.length
  };

  // Customer statistics for legend (from customers with GPS)
  const customerStats = {
    paid: customers.filter(c => getPaymentStatus(getMonthsSincePayment(c['last-payment-date'])) === 'paid').length,
    '1-month-debt': customers.filter(c => getPaymentStatus(getMonthsSincePayment(c['last-payment-date'])) === '1-month-debt').length,
    '2-month-debt': customers.filter(c => getPaymentStatus(getMonthsSincePayment(c['last-payment-date'])) === '2-month-debt').length,
    '3-month-debt': customers.filter(c => getPaymentStatus(getMonthsSincePayment(c['last-payment-date'])) === '3-month-debt').length,
    '4-plus-debt': customers.filter(c => getPaymentStatus(getMonthsSincePayment(c['last-payment-date'])) === '4-plus-debt').length
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

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
          
          {(loading || !mapLoaded) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading customer data...' : 'Loading Map...'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {loading ? 'Fetching GPS coordinates from API...' : 'Initializing Google Maps with Leaflet...'}
                </p>
              </div>
            </div>
          )}

          {!loading && customers.length === 0 && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No GPS Data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No customers with GPS coordinates found.
                </p>
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