import React from 'react';
import { Menu, LogOut, ArrowUp } from 'lucide-react';
import { PageType } from '@/types/dashboard';
import { AnimatedNumber } from '../charts/AnimatedNumber';

interface HeaderProps {
  currentPage: PageType;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onToggleSidebar
}) => {
  const getPageTitle = (page: PageType) => {
    switch (page) {
      case 'performance':
        return 'Performance Overview';
      case 'debt':
        return 'Debt Overview';
      case 'visits':
        return 'Customer Visits Overview';
      case 'visits-list':
        return 'Customer Visits Details';
      case 'pump-stations':
        return 'List of Pump Stations';
      case 'storage-tanks':
        return 'List of Storage Tanks';
      case 'pump-station-meter-readings':
        return 'Pump Station Meter Readings';
      case 'storage-tank-meter-readings':
        return 'Storage Tank Meter Readings';
      case 'customer-meter-readings':
        return 'Customer Meter Readings';
      case 'staff':
        return 'List of Staff Members';
      case 'staff-details':
        return 'Staff Member Details';
      case 'edit-staff':
        return 'Edit Staff Member';
      case 'add-staff':
        return 'Add New Staff Member';
      case 'customer-locations':
        return 'Customer Locations';
      case 'collector-locations':
        return 'Collector Locations';
      case 'collector-paths':
        return 'Collector Paths';
      case 'pump-station-locations':
        return 'Pump Station Locations';
      case 'storage-tank-locations':
        return 'Storage Tank Locations';
      case 'customers':
        return 'Customer List';
      case 'customer-details':
        return 'Customer Detail Information';
      default:
        return 'Dashboard';
    }
  };

  const getMainTitle = (page: PageType) => {
    switch (page) {
      case 'performance':
        return 'Dashboard';
      case 'debt':
        return 'Dashboard';
      case 'visits':
        return 'Visits';
      case 'visits-list':
        return 'Visits';
      case 'pump-stations':
        return 'Pump Stations';
      case 'storage-tanks':
        return 'Storage Tanks';
      case 'pump-station-meter-readings':
        return 'Meter Readings';
      case 'storage-tank-meter-readings':
        return 'Meter Readings';
      case 'customer-meter-readings':
        return 'Meter Readings';
      case 'staff':
        return 'Staff';
      case 'staff-details':
        return 'Staff';
      case 'edit-staff':
        return 'Staff';
      case 'add-staff':
        return 'Staff';
      case 'customer-locations':
        return 'GPS';
      case 'collector-locations':
        return 'GPS';
      case 'collector-paths':
        return 'GPS';
      case 'pump-station-locations':
        return 'GPS';
      case 'storage-tank-locations':
        return 'GPS';
      case 'customers':
        return 'Customers';
      case 'customer-details':
        return 'Customers';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="bg-gray-100 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="text-gray-600 hover:text-gray-900 hover:bg-white/70 p-2 rounded-lg transition-all"
            >
              <Menu size={24} />
            </button>
            
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">W</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors">
              Logout
            </button>
            <button className="text-gray-600 hover:text-gray-900 hover:bg-white/70 p-2 rounded-lg transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white px-6" style={{ paddingTop: '9px', paddingBottom: '9px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getMainTitle(currentPage)} <span className="text-sm font-normal text-gray-500">
                {getPageTitle(currentPage)}
              </span>
            </h1>
          </div>
          
          {currentPage === 'performance' && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-xs uppercase tracking-wider opacity-90">Today&apos;s Payments</div>
              <div className="text-2xl font-bold">
                GH₵<AnimatedNumber value={0} isCurrency={true} />
              </div>
              <div className="text-xs mt-1 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                <span>12% from yesterday</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};