'use client'
import React, { useState, useEffect } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { PerformancePage } from './pages/PerformancePage';
import { DebtPage } from './pages/DebtPage';
import { DashboardDetailsCustomerDebtPage } from './pages/DashboardDetailsCustomerDebtPage';
import { DashboardDetailsYearlyWaterConnectionsPage } from './pages/DashboardDetailsYearlyWaterConnectionsPage';
import { DashboardDetailsPaidCustomersPage } from './pages/DashboardDetailsPaidCustomersPage';
import { DashboardDetailsNonPaidCustomersPage } from './pages/DashboardDetailsNonPaidCustomersPage';
import { DashboardDetailsCustomersWithNoPaymentsPage } from './pages/DashboardDetailsCustomersWithNoPaymentsPage';
import { DashboardDetailsInactiveCustomersPage } from './pages/DashboardDetailsInactiveCustomersPage';
import { DashboardDetailsCustomersInactiveThisYearPage } from './pages/DashboardDetailsCustomersInactiveThisYearPage';
import { CustomerPaymentStatusPage } from './pages/CustomerPaymentStatusPage';
import { CustomerPaymentStatusPaidCustomersPage } from './pages/CustomerPaymentStatusPaidCustomersPage';
import { CustomerPaymentStatusCustomersWithNegativeBalancesPage } from './pages/CustomerPaymentStatusCustomersWithNegativeBalancesPage';
import { CustomerPaymentStatusPartialPaymentPage } from './pages/CustomerPaymentStatusPartialPaymentPage';
import { CustomerPaymentStatusVisitedNoPaymentPage } from './pages/CustomerPaymentStatusVisitedNoPaymentPage';
import { CustomerPaymentStatusNotVisitedPage } from './pages/CustomerPaymentStatusNotVisitedPage';
import { CustomerVisitStatusNoOneHomePage } from './pages/CustomerVisitStatusNoOneHomePage';
import { CustomerVisitStatusMeterDisconnectedPage } from './pages/CustomerVisitStatusMeterDisconnectedPage';
import { CustomerVisitStatusWaterSupplyIssuesPage } from './pages/CustomerVisitStatusWaterSupplyIssuesPage';
import { CustomerVisitStatusCancelledStoppedPage } from './pages/CustomerVisitStatusCancelledStoppedPage';
import { CustomerVisitStatusExcusesPage } from './pages/CustomerVisitStatusExcusesPage';
import { CustomerVisitStatusUnreadableMeterPage } from './pages/CustomerVisitStatusUnreadableMeterPage';
import { CustomerVisitStatusInaccessibleMeterPage } from './pages/CustomerVisitStatusInaccessibleMeterPage';
import { CustomerVisitStatusFaultyMeterPage } from './pages/CustomerVisitStatusFaultyMeterPage';
import { CustomerVisitStatusOtherPage } from './pages/CustomerVisitStatusOtherPage';
import { BillGenerationPage } from './pages/BillGenerationPage';
import { VisitsPage } from './pages/VisitsPage';
import { VisitsListPage } from './pages/VisitsListPage';
import { PaymentsListPage } from './pages/PaymentsListPage';
import { BankDepositsListPage } from './pages/BankDepositsListPage';
import { PumpStationsPage } from './pages/PumpStationsPage';
import { StorageTanksPage } from './pages/StorageTanksPage';
import { PumpStationMeterReadingsPage } from './pages/PumpStationMeterReadingsPage';
import { StorageTankMeterReadingsPage } from './pages/StorageTankMeterReadingsPage';
import { CustomerMeterReadingsPage } from './pages/CustomerMeterReadingsPage';
import { StaffPage } from './pages/StaffPage';
import { StaffDetailsPage } from './pages/StaffDetailsPage';
import { EditStaffPage } from './pages/EditStaffPage';
import { AddStaffPage } from './pages/AddStaffPage';
import { CustomerLocationsPage } from './pages/CustomerLocationsPage';
import { CollectorPathsPage } from './pages/CollectorPathsPage';
import { CollectorLocationsPage } from './pages/CollectorLocationsPage';
import { PumpStationLocationsPage } from './pages/PumpStationLocationsPage';
import { StorageTankLocationsPage } from './pages/StorageTankLocationsPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReactivatedCustomersPage } from './pages/ReactivatedCustomersPage';
import { PageType, DateRange, ActiveYears } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import { menuItems } from '@/lib/data';

const Dashboard = () => {
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<PageType>('performance');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showCustomerDetails, setShowCustomerDetails] = useState<boolean>(false);

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
  };

  // Customer navigation handler
  const handleCustomerNavigation = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowCustomerDetails(true);
    setCurrentPage('customers');
  };

  // Reset customer navigation state when leaving customers page
  useEffect(() => {
    if (currentPage !== 'customers' && currentPage !== 'customer-details') {
      setSelectedCustomerId('');
      setShowCustomerDetails(false);
    }
  }, [currentPage]);

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
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            monthYearPickerOpen={monthYearPickerOpen}
            onMonthYearToggle={() => setMonthYearPickerOpen(!monthYearPickerOpen)}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onMonthYearApply={handleMonthYearSelect}
            onNavigate={(page, filter) => {
              if (filter && filter.monthsOwed !== undefined) {
                sessionStorage.setItem('customerDebtFilter', JSON.stringify({ monthsOwed: filter.monthsOwed }));
              }
              setCurrentPage(page as PageType);
            }}
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
        
      case 'dashboard-details-yearly-water-connections':
        return (
          <DashboardDetailsYearlyWaterConnectionsPage
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
        return <DashboardDetailsInactiveCustomersPage onNavigate={setCurrentPage} />;
        
      case 'dashboard-details-customers-inactive-this-year':
        return <DashboardDetailsCustomersInactiveThisYearPage onNavigate={setCurrentPage} />;
        
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
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-meter-disconnected':
        return (
          <CustomerVisitStatusMeterDisconnectedPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-water-supply-issues':
        return (
          <CustomerVisitStatusWaterSupplyIssuesPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('visits')}
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
            onNavigateBack={() => setCurrentPage('visits')}
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
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-unreadable-meter':
        return (
          <CustomerVisitStatusUnreadableMeterPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-inaccessible-meter':
        return (
          <CustomerVisitStatusInaccessibleMeterPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'customer-visit-status-faulty-meter':
        return (
          <CustomerVisitStatusFaultyMeterPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onNavigateBack={() => setCurrentPage('visits')}
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
            onNavigateBack={() => setCurrentPage('visits')}
            onCustomerClick={handleCustomerNavigation}
          />
        );
        
      case 'visits':
        return (
          <VisitsPage
            selectedVisitsMonth={selectedVisitsMonth}
            selectedVisitsYear={selectedVisitsYear}
            visitsMonthYearPickerOpen={visitsMonthYearPickerOpen}
            onVisitsMonthYearToggle={() => setVisitsMonthYearPickerOpen(!visitsMonthYearPickerOpen)}
            onVisitsMonthChange={setSelectedVisitsMonth}
            onVisitsYearChange={setSelectedVisitsYear}
            onVisitsMonthYearApply={handleVisitsMonthYearSelect}
            onNavigate={(page) => setCurrentPage(page as PageType)}
          />
        );

      case 'payments':
        return (
          <PaymentsListPage
            selectedDateRange={selectedDateRange}
            displayDateRange={displayDateRange}
            activePreset={activePreset}
            dateRangeOpen={dateRangeOpen}
            onDateRangeToggle={() => setDateRangeOpen(!dateRangeOpen)}
            onPresetSelect={handlePresetSelect}
            onDateRangeChange={setSelectedDateRange}
            onDateRangeApply={handleDateRangeSelect}
            onCustomerClick={handleCustomerNavigation}
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

      case 'visits-list':
        return (
          <VisitsListPage
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
        
      case 'pump-stations':
        return (
          <PumpStationsPage
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

      case 'storage-tanks':
        return (
          <StorageTanksPage
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
        
      case 'pump-station-meter-readings':
        return (
          <PumpStationMeterReadingsPage
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
        
      case 'storage-tank-meter-readings':
        return (
          <StorageTankMeterReadingsPage
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
        
      case 'customer-meter-readings':
        return (
          <CustomerMeterReadingsPage
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
        return <StaffPage onStaffSelect={handleStaffSelect} onAddStaff={handleAddStaff} />;

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

      case 'pump-station-locations':
        return <PumpStationLocationsPage />;

      case 'storage-tank-locations':
        return <StorageTankLocationsPage />;

      case 'customers':
      case 'customer-details':
        return <CustomersPage 
          initialCustomerId={selectedCustomerId}
          initialShowDetails={showCustomerDetails}
        />;
        
      case 'reactivated-customers':
        return <ReactivatedCustomersPage 
          initialCustomerId={selectedCustomerId}
          initialShowDetails={showCustomerDetails}
        />;
        
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
           currentPage === 'pump-station-locations' || 
           currentPage === 'storage-tank-locations' ||
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