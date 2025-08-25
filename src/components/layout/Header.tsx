import React, { useState, useEffect } from 'react';
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
  const [isCustomerDetails, setIsCustomerDetails] = useState(false);
  
  // Check for customer details view
  useEffect(() => {
    const checkCustomerView = () => {
      const viewType = document.body.getAttribute('data-customer-view');
      setIsCustomerDetails(viewType === 'details');
    };
    
    // Initial check
    checkCustomerView();
    
    // Set up observer for attribute changes
    const observer = new MutationObserver(checkCustomerView);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-customer-view'] });
    
    return () => observer.disconnect();
  }, []);
  const getPageTitle = (page: PageType, isDetails: boolean = false) => {
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
        return isCustomerDetails ? 'Customer Detail Information' : 'Customer List';
      case 'reactivated-customers':
        return 'Reactivated Customer List';
      case 'customer-details':
        return 'Customer Detail Information';
      case 'payments':
        return 'Payment Transactions';
      case 'bank-deposits':
        return 'Bank Deposit Transactions';
      case 'dashboard-details-customer-debt':
        return 'Customer Debt';
      case 'dashboard-details-yearly-water-connections':
        return 'Yearly Water Connections';
      case 'dashboard-details-paid-customers':
        return 'Paid Customers';
      case 'dashboard-details-non-paid-customers':
        return 'Non-Paid Customers';
      case 'dashboard-details-customers-with-no-payments':
        return 'Customers with No Payments';
      case 'dashboard-details-inactive-customers':
        return 'Inactive Customers';
      case 'dashboard-details-customers-inactive-this-year':
        return 'Customers made Inactive this Year';
      case 'customer-payment-status':
        return 'Paid Customers';
      case 'customer-payment-status-paid-customers':
        return 'Paid Customers';
      case 'customer-payment-status-customers-with-negative-balances':
        return 'Pre-Paid Customers';
      case 'customer-payment-status-partial-payment':
        return 'Partial Payment';
      case 'customer-payment-status-visited-no-payment':
        return 'Visited - No Payment';
      case 'customer-payment-status-not-visited':
        return 'Not Visited';
      case 'customer-visit-status-no-one-home':
        return 'No One Home';
      case 'customer-visit-status-meter-disconnected':
        return 'Meter Disconnected';
      case 'customer-visit-status-water-supply-issues':
        return 'Water Supply Issues';
      case 'customer-visit-status-cancelled-stopped':
        return 'Cancelled/Stopped';
      case 'customer-visit-status-excuses':
        return 'Excuses';
      case 'customer-visit-status-unreadable-meter':
        return 'Unreadable Meter';
      case 'customer-visit-status-inaccessible-meter':
        return 'Inaccessible Meter';
      case 'customer-visit-status-faulty-meter':
        return 'Faulty Meter';
      case 'customer-visit-status-other':
        return 'Other';
      case 'bill-generation':
        return 'Published Reports';
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
      case 'reactivated-customers':
        return 'Customers';
      case 'customer-details':
        return 'Customers';
      case 'payments':
        return 'Payments';
      case 'bank-deposits':
        return 'Bank Deposits';
      case 'dashboard-details-customer-debt':
        return 'Dashboard Details';
      case 'dashboard-details-yearly-water-connections':
        return 'Dashboard Details';
      case 'dashboard-details-paid-customers':
        return 'Dashboard Details';
      case 'dashboard-details-non-paid-customers':
        return 'Dashboard Details';
      case 'dashboard-details-customers-with-no-payments':
        return 'Dashboard Details';
      case 'dashboard-details-inactive-customers':
        return 'Dashboard Details';
      case 'dashboard-details-customers-inactive-this-year':
        return 'Dashboard Details';
      case 'customer-payment-status':
        return 'Customer Payment Status';
      case 'customer-payment-status-paid-customers':
        return 'Customer Payment Status';
      case 'customer-payment-status-customers-with-negative-balances':
        return 'Customer Payment Status';
      case 'customer-payment-status-partial-payment':
        return 'Customer Payment Status';
      case 'customer-payment-status-visited-no-payment':
        return 'Customer Payment Status';
      case 'customer-payment-status-not-visited':
        return 'Customer Payment Status';
      case 'customer-visit-status-no-one-home':
        return 'Customer Visit Status';
      case 'customer-visit-status-meter-disconnected':
        return 'Customer Visit Status';
      case 'customer-visit-status-water-supply-issues':
        return 'Customer Visit Status';
      case 'customer-visit-status-cancelled-stopped':
        return 'Customer Visit Status';
      case 'customer-visit-status-excuses':
        return 'Customer Visit Status';
      case 'customer-visit-status-unreadable-meter':
        return 'Customer Visit Status';
      case 'customer-visit-status-inaccessible-meter':
        return 'Customer Visit Status';
      case 'customer-visit-status-faulty-meter':
        return 'Customer Visit Status';
      case 'customer-visit-status-other':
        return 'Customer Visit Status';
      case 'bill-generation':
        return 'Reports';
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
              {getMainTitle(currentPage)} {currentPage === 'customer-payment-status-paid-customers' ? (
                <span className="text-sm font-normal text-gray-500">
                  Paid Customers
                </span>
              ) : currentPage === 'customer-payment-status-customers-with-negative-balances' ? (
                <span className="text-sm font-normal text-gray-500">
                  Pre-Paid Customers
                </span>
              ) : currentPage === 'customer-payment-status-partial-payment' ? (
                <span className="text-sm font-normal text-gray-500">
                  Partial Payment
                </span>
              ) : currentPage === 'customer-payment-status-visited-no-payment' ? (
                <span className="text-sm font-normal text-gray-500">
                  Visited - No Payment
                </span>
              ) : currentPage === 'customer-payment-status-not-visited' ? (
                <span className="text-sm font-normal text-gray-500">
                  Not Visited
                </span>
              ) : currentPage === 'customer-visit-status-no-one-home' ? (
                <span className="text-sm font-normal text-gray-500">
                  No One Home
                </span>
              ) : currentPage === 'customer-visit-status-meter-disconnected' ? (
                <span className="text-sm font-normal text-gray-500">
                  Meter Disconnected
                </span>
              ) : currentPage === 'customer-visit-status-water-supply-issues' ? (
                <span className="text-sm font-normal text-gray-500">
                  Water Supply Issues
                </span>
              ) : currentPage === 'customer-visit-status-cancelled-stopped' ? (
                <span className="text-sm font-normal text-gray-500">
                  Cancelled/Stopped
                </span>
              ) : currentPage === 'customer-visit-status-excuses' ? (
                <span className="text-sm font-normal text-gray-500">
                  Excuses
                </span>
              ) : currentPage === 'customer-visit-status-unreadable-meter' ? (
                <span className="text-sm font-normal text-gray-500">
                  Unreadable Meter
                </span>
              ) : currentPage === 'customer-visit-status-inaccessible-meter' ? (
                <span className="text-sm font-normal text-gray-500">
                  Inaccessible Meter
                </span>
              ) : currentPage === 'customer-visit-status-faulty-meter' ? (
                <span className="text-sm font-normal text-gray-500">
                  Faulty Meter
                </span>
              ) : currentPage === 'customer-visit-status-other' ? (
                <span className="text-sm font-normal text-gray-500">
                  Other
                </span>
              ) : (
                <span className="text-sm font-normal text-gray-500">
                  {getPageTitle(currentPage, isCustomerDetails)}
                </span>
              )}
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