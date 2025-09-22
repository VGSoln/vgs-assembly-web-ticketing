'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Map, Satellite, Filter, ExternalLink, Calendar } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { DateRangePicker } from '../layout/DateRangePicker';
import { collectorOptions } from '@/lib/data';
import { DateRange } from '@/types/dashboard';
import { getDatePresets } from '@/lib/utils';

interface CollectorLocationsPageProps {}

export const CollectorLocationsPage: React.FC<CollectorLocationsPageProps> = () => {
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

        // Customer transaction locations data with payment history - Today's transactions
        const todayStr = new Date().toISOString().split('T')[0];
        const customerTransactions = [
          // New customers (first time or single payment)
          { id: 1, lat: 5.6037, lng: -0.1870, customerName: 'Kofi Mensah', customerType: 'Stall', ticketType: 'Market', location: 'Central Market', amount: 6.00, date: todayStr, collector: 'John Doe', paymentsCount: 1, isNew: true },
          { id: 2, lat: 5.6157, lng: -0.1820, customerName: 'Ama Serwaa', customerType: 'Table-Top', ticketType: 'Market', location: 'Kejetia Market', amount: 3.50, date: todayStr, collector: 'Jane Smith', paymentsCount: 1, isNew: true },
          { id: 3, lat: 5.6087, lng: -0.1750, customerName: 'Kwame Asante', customerType: 'Hawker', ticketType: 'Market', location: 'Bantama Market', amount: 2.00, date: todayStr, collector: 'Bob Johnson', paymentsCount: 1, isNew: true },
          { id: 4, lat: 5.5997, lng: -0.1700, customerName: 'Yaw Boateng', customerType: 'Taxi', ticketType: 'Lorry Park', location: 'Main Station', amount: 2.00, date: todayStr, collector: 'Mary Brown', paymentsCount: 1, isNew: true },
          { id: 5, lat: 5.5987, lng: -0.2000, customerName: 'Akua Darko', customerType: 'Trotro', ticketType: 'Lorry Park', location: 'Tech Junction', amount: 1.50, date: todayStr, collector: 'James Wilson', paymentsCount: 1, isNew: true },
          
          // Existing customers (multiple payments)
          { id: 6, lat: 5.6057, lng: -0.1600, customerName: 'Mohammed Ali', customerType: 'Private', ticketType: 'Lorry Park', location: 'Asafo Station', amount: 2.50, date: todayStr, collector: 'Sarah Davis', paymentsCount: 15, isNew: false },
          { id: 7, lat: 5.6137, lng: -0.1650, customerName: 'Grace Osei', customerType: 'Stall', ticketType: 'Market', location: 'Adum Market', amount: 6.00, date: todayStr, collector: 'Michael Lee', paymentsCount: 45, isNew: false },
          { id: 8, lat: 5.5937, lng: -0.1950, customerName: 'Samuel Tetteh', customerType: 'Table-Top', ticketType: 'Market', location: 'Roman Hill Market', amount: 3.50, date: todayStr, collector: 'Emma Garcia', paymentsCount: 23, isNew: false },
          { id: 9, lat: 5.6107, lng: -0.1920, customerName: 'Abena Mensah', customerType: 'Stall', ticketType: 'Market', location: 'Central Market', amount: 6.00, date: todayStr, collector: 'John Doe', paymentsCount: 67, isNew: false },
          { id: 10, lat: 5.5977, lng: -0.1850, customerName: 'Isaac Amponsah', customerType: 'Hawker', ticketType: 'Market', location: 'Kejetia Market', amount: 2.00, date: todayStr, collector: 'Jane Smith', paymentsCount: 12, isNew: false },
          { id: 11, lat: 5.6027, lng: -0.1780, customerName: 'Comfort Adjei', customerType: 'Taxi', ticketType: 'Lorry Park', location: 'Main Station', amount: 2.00, date: todayStr, collector: 'Bob Johnson', paymentsCount: 34, isNew: false },
          { id: 12, lat: 5.6147, lng: -0.1950, customerName: 'Daniel Owusu', customerType: 'Trotro', ticketType: 'Lorry Park', location: 'Tech Junction', amount: 1.50, date: todayStr, collector: 'Mary Brown', paymentsCount: 89, isNew: false },
          { id: 13, lat: 5.5947, lng: -0.1730, customerName: 'Patricia Agyeman', customerType: 'Private', ticketType: 'Lorry Park', location: 'Asafo Station', amount: 2.50, date: todayStr, collector: 'James Wilson', paymentsCount: 56, isNew: false },
          { id: 14, lat: 5.6077, lng: -0.2010, customerName: 'Joseph Badu', customerType: 'Stall', ticketType: 'Market', location: 'Bantama Market', amount: 6.00, date: todayStr, collector: 'Sarah Davis', paymentsCount: 98, isNew: false },
          { id: 15, lat: 5.6017, lng: -0.1690, customerName: 'Esther Frimpong', customerType: 'Table-Top', ticketType: 'Market', location: 'Adum Market', amount: 3.50, date: todayStr, collector: 'Michael Lee', paymentsCount: 41, isNew: false },
        ];

        // Add markers for customer transactions
        customerTransactions.forEach((transaction) => {
          // Green for new customers (1 payment), Blue for existing customers (2+ payments)
          const color = transaction.isNew ? '#10b981' : '#3b82f6';
          const icon = createCustomIcon(color, transaction.isNew);
          const marker = L.marker([transaction.lat, transaction.lng], { icon }).addTo(map);
          
          marker.bindPopup(`
            <div style="padding: 10px; min-width: 200px;">
              <div style="background: ${transaction.isNew ? '#10b981' : '#3b82f6'}; color: white; padding: 6px; border-radius: 4px 4px 0 0; margin: -10px -10px 8px -10px;">
                <h3 style="margin: 0; font-weight: bold; font-size: 14px;">
                  ${transaction.customerName}
                </h3>
                <span style="font-size: 11px; opacity: 0.9;">
                  ${transaction.isNew ? 'New Customer' : `Existing Customer (${transaction.paymentsCount} payments)`}
                </span>
              </div>
              <div style="padding-top: 4px;">
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Type:</strong> ${transaction.customerType}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Ticket:</strong> ${transaction.ticketType}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Location:</strong> ${transaction.location}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Amount:</strong> GHS ${transaction.amount.toFixed(2)}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Date:</strong> ${transaction.date}
                </p>
                <p style="margin: 2px 0; color: #666; font-size: 12px;">
                  <strong>Collector:</strong> ${transaction.collector}
                </p>
              </div>
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

  const ticketTypeOptions = [
    { value: 'market', label: 'Market' },
    { value: 'lorry-park', label: 'Lorry Park' }
  ];

  // Transaction statistics
  const transactionStats = {
    newCustomers: 5,
    existingCustomers: 10,
    total: 15
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
                const presets = getDatePresets();
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