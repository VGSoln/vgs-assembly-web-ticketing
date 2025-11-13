'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { PerformancePage } from './pages/PerformancePage';
import { DebtPage } from './pages/DebtPage';
import { RevenueOfficerPerformancePage } from './pages/RevenueOfficerPerformancePage';
import { DashboardDetailsCustomerDebtPage } from './pages/DashboardDetailsCustomerDebtPage';
import { DashboardDetailsPaidCustomersPage } from './pages/DashboardDetailsPaidCustomersPage';
import { DashboardDetailsNonPaidCustomersPage } from './pages/DashboardDetailsNonPaidCustomersPage';
import { DashboardDetailsCustomersWithNoPaymentsPage } from './pages/DashboardDetailsCustomersWithNoPaymentsPage';
import { DashboardDetailsInactiveCustomersPage } from './pages/DashboardDetailsInactiveCustomersPage';
import { DashboardDetailsCustomersInactiveThisYearPage } from './pages/DashboardDetailsCustomersInactiveThisYearPage';
import { DashboardDetailsCounterfeitedTicketsPage } from './pages/DashboardDetailsCounterfeitedTicketsPage';
import { CustomerPaymentStatusPage } from './pages/CustomerPaymentStatusPage';
import { CustomerPaymentStatusPaidCustomersPage } from './pages/CustomerPaymentStatusPaidCustomersPage';
import { CustomerPaymentStatusCustomersWithNegativeBalancesPage } from './pages/CustomerPaymentStatusCustomersWithNegativeBalancesPage';
import { CustomerPaymentStatusPartialPaymentPage } from './pages/CustomerPaymentStatusPartialPaymentPage';
import { CustomerPaymentStatusVisitedNoPaymentPage } from './pages/CustomerPaymentStatusVisitedNoPaymentPage';
import { CustomerPaymentStatusNotVisitedPage } from './pages/CustomerPaymentStatusNotVisitedPage';
import { CustomerVisitStatusNoOneHomePage } from './pages/CustomerVisitStatusNoOneHomePage';
import { CustomerVisitStatusCancelledStoppedPage } from './pages/CustomerVisitStatusCancelledStoppedPage';
import { CustomerVisitStatusExcusesPage } from './pages/CustomerVisitStatusExcusesPage';
import { CustomerVisitStatusOtherPage } from './pages/CustomerVisitStatusOtherPage';
import { BillGenerationPage } from './pages/BillGenerationPage';
import { TicketPaymentsPage } from './pages/TicketPaymentsPage';
import { BankDepositsListPage } from './pages/BankDepositsListPage';
import { CommunityPage } from './pages/CommunityPage';
import { ZonesPage } from './pages/ZonesPage';
import { TicketTypePage } from './pages/TicketTypePage';
import { LocationPage } from './pages/LocationPage';
import { CustomerTypePage } from './pages/CustomerTypePage';
import { StaffPage } from './pages/StaffPage';
import { StaffDetailsPage } from './pages/StaffDetailsPage';
import { EditStaffPage } from './pages/EditStaffPage';
import { AddStaffPage } from './pages/AddStaffPage';
import { CustomerLocationsPage } from './pages/CustomerLocationsPage';
import { CollectorPathsPage } from './pages/CollectorPathsPage';
import { CollectorLocationsPage } from './pages/CollectorLocationsPage';
import { TicketCustomersPage } from './pages/TicketCustomersPage';
import { TicketRatesPage } from './pages/TicketRatesPage';
import { PageType, DateRange, ActiveYears } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import { menuItems } from '@/lib/data';

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<PageType>('performance');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showCustomerDetails, setShowCustomerDetails] = useState<boolean>(false);
  const [staffRefreshKey, setStaffRefreshKey] = useState(0);

  // Date range state (Performance page)
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ start: '2025-08-01', end: '2025-08-31' });
  const [displayDateRange, setDisplayDateRange] = useState('This Month');
  const [activePreset, setActivePreset] = useState('thisMonth');
  const [activeYears, setActiveYears] = useState<ActiveYears>({ 2023: true, 2024: true, 2025: true });

  // Month/Year state (Debt page)
  const [monthYearPickerOpen, setMonthYearPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Visits state (Visits page)
  const [visitsMonthYearPickerOpen, setVisitsMonthYearPickerOpen] = useState(false);
  const [selectedVisitsMonth, setSelectedVisitsMonth] = useState('August');
  const [selectedVisitsYear, setSelectedVisitsYear] = useState('2025');

  // Payments state (Payments page)
  const [paymentsMonthYearPickerOpen, setPaymentsMonthYearPickerOpen] = useState(false);
  const [selectedPaymentsMonth, setSelectedPaymentsMonth] = useState('August');
  const [selectedPaymentsYear, setSelectedPaymentsYear] = useState('2025');

  // Bank Deposits state (Bank Deposits page)
  const [bankDepositsMonthYearPickerOpen, setBankDepositsMonthYearPickerOpen] = useState(false);
  const [selectedBankDepositsMonth, setSelectedBankDepositsMonth] = useState('August');
  const [selectedBankDepositsYear, setSelectedBankDepositsYear] = useState('2025');

  // Initialize page from URL on mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const staffIdParam = searchParams.get('staffId');

    if (pageParam && pageParam !== currentPage) {
      setCurrentPage(pageParam as PageType);
    }

    if (staffIdParam) {
      setSelectedStaffId(staffIdParam);
    }
  }, []); // Run only on mount

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', currentPage);

    if (selectedStaffId) {
      params.set('staffId', selectedStaffId);
    } else {
      params.delete('staffId');
    }

    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  }, [currentPage, selectedStaffId]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      const staffIdParam = urlParams.get('staffId');

      if (pageParam) {
        setCurrentPage(pageParam as PageType);
      }

      if (staffIdParam) {
        setSelectedStaffId(staffIdParam);
      } else {
        setSelectedStaffId('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (dateRangeOpen && !target.closest('.date-range-picker')) {
        setDateRangeOpen(false);
      }
      if (monthYearPickerOpen && !target.closest('.month-year-picker')) {
        setMonthYearPickerOpen(false);
      }
      if (visitsMonthYearPickerOpen && !target.closest('.visits-month-year-picker')) {
        setVisitsMonthYearPickerOpen(false);
      }
      if (paymentsMonthYearPickerOpen && !target.closest('.payments-month-year-picker')) {
        setPaymentsMonthYearPickerOpen(false);
      }
      if (bankDepositsMonthYearPickerOpen && !target.closest('.bank-deposits-month-year-picker')) {
        setBankDepositsMonthYearPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dateRangeOpen, monthYearPickerOpen, visitsMonthYearPickerOpen, paymentsMonthYearPickerOpen, bankDepositsMonthYearPickerOpen]);

  // Event handlers
  const toggleSubmenu = (menu: string) => {
    setExpandedMenus(prev => {
      // Close all other menus and toggle the clicked one
      const newState: { [key: string]: boolean } = {};
      
      // Set all menus to false
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      
      // Toggle the clicked menu (if it was closed, open it; if it was open, close it)
      newState[menu] = !prev[menu];
      
      return newState;
    });
  };

  const toggleYear = (year: number) => {
    setActiveYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const handlePresetSelect = (presetKey: string) => {
    const presets = {
      today: { label: 'Today', start: '2025-08-13', end: '2025-08-13' },
      thisMonth: { label: 'This Month', start: '2025-08-01', end: '2025-08-31' }
      // Add more presets as needed
    };
    
    const preset = presets[presetKey as keyof typeof presets];
    if (preset) {
      setSelectedDateRange({ start: preset.start, end: preset.end });
      setDisplayDateRange(preset.label);
      setActivePreset(presetKey);
      setDateRangeOpen(false);
    }
  };

  const handleDateRangeSelect = () => {
    setDisplayDateRange(`${formatDate(selectedDateRange.start)} - ${formatDate(selectedDateRange.end)}`);
    setActivePreset('custom');
    setDateRangeOpen(false);
  };

  const handleMonthYearSelect = () => {
    setMonthYearPickerOpen(false);
  };

  const handleVisitsMonthYearSelect = () => {
    setVisitsMonthYearPickerOpen(false);
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    setCurrentPage('staff-details');
  };

  const handleBackToStaff = () => {
    setCurrentPage('staff');
    setSelectedStaffId('');
  };

  const handleEditStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setCurrentPage('edit-staff');
  };

  const handleBackToStaffDetails = () => {
    setCurrentPage('staff-details');
  };

  const handleAddStaff = () => {
    setCurrentPage('add-staff');
  };

  const handleBackToStaffFromAdd = () => {
    setCurrentPage('staff');
    setSelectedStaffId('');
    // Increment refresh key to trigger StaffPage to refetch data
    setStaffRefreshKey(prev => prev + 1);
  };

  // Customer navigation handler
  const handleCustomerNavigation = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowCustomerDetails(true);
    setCurrentPage('ticket-customers');
  };

  // Reset customer navigation state when leaving customers page
  useEffect(() => {
    if (currentPage !== 'ticket-customers' && currentPage !== 'customer-details') {
      setSelectedCustomerId('');
      setShowCustomerDetails(false);
    }
  }, [currentPage]);

  // Helper function to navigate to a page (with type casting)
  const navigateToPage = (page: string) => {
    setCurrentPage(page as PageType);
  };

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'performance':
        return (
          <PerformancePage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            activeYears={activeYears}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onToggleYear={toggleYear}
            onNavigate={(page) => setCurrentPage(page as PageType)}
          />
        );
        
      case 'debt':
        return (
          <DebtPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigate={(page, filter) => {
              if (filter && filter.monthsOwed !== undefined) {
                sessionStorage.setItem('customerDebtFilter', JSON.stringify({ monthsOwed: filter.monthsOwed }));
              }
              setCurrentPage(page as PageType);
            }}
          />
        );
        
      case 'revenue-officer-performance':
      case 'dashboard-details-revenue-officer-field-attendance':
        return (
          <RevenueOfficerPerformancePage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );
        
      case 'dashboard-details-customer-debt':
        return (
          <DashboardDetailsCustomerDebtPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('performance')}
            onCustomerClick={handleCustomerNavigation}
          />
        );

      case 'dashboard-details-paid-customers':
        return (
          <DashboardDetailsPaidCustomersPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('performance')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'dashboard-details-non-paid-customers':
        return (
          <DashboardDetailsNonPaidCustomersPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('debt')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'dashboard-details-customers-with-no-payments':
        return (
          <DashboardDetailsCustomersWithNoPaymentsPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('debt')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'dashboard-details-inactive-customers':
        return <DashboardDetailsInactiveCustomersPage onNavigate={navigateToPage} />;

      case 'dashboard-details-customers-inactive-this-year':
        return <DashboardDetailsCustomersInactiveThisYearPage onNavigate={navigateToPage} />;

      case 'dashboard-details-counterfeited-tickets':
        return <DashboardDetailsCounterfeitedTicketsPage onNavigate={navigateToPage} />;
        
      case 'customer-payment-status':
        return (
          <CustomerPaymentStatusPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('performance')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-payment-status-paid-customers':
        return <CustomerPaymentStatusPaidCustomersPage onNavigate={(page) => setCurrentPage(page as PageType)} />;
        
      case 'customer-payment-status-customers-with-negative-balances':
        return <CustomerPaymentStatusCustomersWithNegativeBalancesPage onNavigate={(page) => setCurrentPage(page as PageType)} />;
        
      case 'customer-payment-status-partial-payment':
        return <CustomerPaymentStatusPartialPaymentPage onNavigate={(page) => setCurrentPage(page as PageType)} />;
        
      case 'customer-payment-status-visited-no-payment':
        return <CustomerPaymentStatusVisitedNoPaymentPage onNavigate={(page) => setCurrentPage(page as PageType)} />;
        
      case 'customer-payment-status-not-visited':
        return <CustomerPaymentStatusNotVisitedPage onNavigate={(page) => setCurrentPage(page as PageType)} />;
        
      case 'customer-visit-status-no-one-home':
        return (
          <CustomerVisitStatusNoOneHomePage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('customer-payment-status')}
            onCustomerClick={handleCustomerNavigation}
          />
        );

      case 'customer-visit-status-cancelled-stopped':
        return (
          <CustomerVisitStatusCancelledStoppedPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('customer-payment-status')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-excuses':
        return (
          <CustomerVisitStatusExcusesPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('customer-payment-status')}
            onCustomerClick={handleCustomerNavigation}
          />
        );

      case 'customer-visit-status-other':
        return (
          <CustomerVisitStatusOtherPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('customer-payment-status')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'ticket-payments':
        return (
          <TicketPaymentsPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'bank-deposits':
        return (
          <BankDepositsListPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'bill-generation':
        return <BillGenerationPage />;
        
      case 'storage-tanks':
        return (
          <CommunityPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'zones':
        return (
          <ZonesPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'ticket-type':
        return (
          <TicketTypePage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'location':
        return (
          <LocationPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'customer-type':
        return (
          <CustomerTypePage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
          />
        );

      case 'staff':
        return <StaffPage key={staffRefreshKey} onStaffSelect={handleStaffSelect} onAddStaff={handleAddStaff} />;

      case 'staff-details':
        return <StaffDetailsPage staffId={selectedStaffId} onBack={handleBackToStaff} onEdit={handleEditStaff} />;

      case 'edit-staff':
        return <EditStaffPage staffId={selectedStaffId} onBack={handleBackToStaffDetails} />;

      case 'add-staff':
        return <AddStaffPage onBack={handleBackToStaffFromAdd} />;

      case 'customer-locations':
        return <CustomerLocationsPage />;

      case 'collector-locations':
        return <CollectorLocationsPage />;

      case 'collector-paths':
        return <CollectorPathsPage />;

      case 'customer-details':
        return null; // Page removed
        
      case 'ticket-customers':
        return <TicketCustomersPage 
          initialCustomerId={selectedCustomerId}
          initialShowDetails={showCustomerDetails}
        />;
      
      case 'ticket-rates':
        return <TicketRatesPage />;
        
        
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        menuItems={menuItems}
        expandedMenus={expandedMenus}
        currentPage={currentPage}
        onToggleSubmenu={toggleSubmenu}
        onPageChange={setCurrentPage}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {currentPage === 'customer-locations' ||
           currentPage === 'collector-locations' ||
           currentPage === 'collector-paths' ||
           currentPage === 'customer-details' ? (
            <>
              <div className="flex-1 overflow-hidden">
                {renderPageContent()}
              </div>
              <Footer />
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-2 lg:p-3">
                <div className="w-full">
                  {renderPageContent()}
                </div>
              </div>
              <Footer />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;