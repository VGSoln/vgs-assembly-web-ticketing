'use client'
import React, { useState, useEffect } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { PerformancePage } from './pages/PerformancePage';
import { DebtPage } from './pages/DebtPage';
import { VisitsPage } from './pages/VisitsPage';
import { VisitsListPage } from './pages/VisitsListPage';
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
import { PageType, DateRange, ActiveYears } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import { menuItems } from '@/lib/data';

const Dashboard = () => {
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<PageType>('performance');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dateRangeOpen, monthYearPickerOpen, visitsMonthYearPickerOpen]);

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
        return <CustomersPage />;
        
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
           currentPage === 'storage-tank-locations' ? (
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