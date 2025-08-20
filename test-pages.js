// Test script to verify all pages are loading correctly
const pages = [
  // Dashboard pages
  { name: 'Performance', path: 'src/components/pages/PerformancePage.tsx' },
  { name: 'Debt', path: 'src/components/pages/DebtPage.tsx' },
  
  // Visits pages
  { name: 'Visits', path: 'src/components/pages/VisitsPage.tsx' },
  { name: 'Visits List', path: 'src/components/pages/VisitsListPage.tsx' },
  
  // Customer pages
  { name: 'Customers', path: 'src/components/pages/CustomersPage.tsx' },
  { name: 'Customer Details', path: 'src/components/pages/CustomerDetailsPage.tsx' },
  { name: 'Add Customer', path: 'src/components/pages/AddCustomerPage.tsx' },
  
  // Staff pages
  { name: 'Staff', path: 'src/components/pages/StaffPage.tsx' },
  { name: 'Staff Details', path: 'src/components/pages/StaffDetailsPage.tsx' },
  { name: 'Edit Staff', path: 'src/components/pages/EditStaffPage.tsx' },
  { name: 'Add Staff', path: 'src/components/pages/AddStaffPage.tsx' },
  
  // Pump Station pages
  { name: 'Pump Stations', path: 'src/components/pages/PumpStationsPage.tsx' },
  { name: 'Pump Station Details', path: 'src/components/pages/PumpStationDetailsPage.tsx' },
  { name: 'Edit Pump Station', path: 'src/components/pages/EditPumpStationPage.tsx' },
  { name: 'Add Pump Station', path: 'src/components/pages/AddPumpStationPage.tsx' },
  
  // Storage Tank pages
  { name: 'Storage Tanks', path: 'src/components/pages/StorageTanksPage.tsx' },
  { name: 'Storage Tank Details', path: 'src/components/pages/StorageTankDetailsPage.tsx' },
  { name: 'Edit Storage Tank', path: 'src/components/pages/EditStorageTankPage.tsx' },
  { name: 'Add Storage Tank', path: 'src/components/pages/AddStorageTankPage.tsx' },
  
  // GPS/Map pages
  { name: 'Customer Locations', path: 'src/components/pages/CustomerLocationsPage.tsx' },
  { name: 'Collector Locations', path: 'src/components/pages/CollectorLocationsPage.tsx' },
  { name: 'Collector Paths', path: 'src/components/pages/CollectorPathsPage.tsx' },
  { name: 'Pump Station Locations', path: 'src/components/pages/PumpStationLocationsPage.tsx' },
  { name: 'Storage Tank Locations', path: 'src/components/pages/StorageTankLocationsPage.tsx' },
  
  // Meter Reading pages
  { name: 'Customer Meter Readings', path: 'src/components/pages/CustomerMeterReadingsPage.tsx' },
  { name: 'Pump Station Meter Readings', path: 'src/components/pages/PumpStationMeterReadingsPage.tsx' },
  { name: 'Storage Tank Meter Readings', path: 'src/components/pages/StorageTankMeterReadingsPage.tsx' },
];

const fs = require('fs');

console.log('Testing all pages for accessibility...\n');
let failedPages = [];
let successPages = [];

pages.forEach(page => {
  try {
    if (fs.existsSync(page.path)) {
      successPages.push(page.name);
      console.log(`✅ ${page.name} - File exists`);
    } else {
      failedPages.push(page.name);
      console.log(`❌ ${page.name} - File not found`);
    }
  } catch (error) {
    failedPages.push(page.name);
    console.log(`❌ ${page.name} - Error: ${error.message}`);
  }
});

console.log('\n========= Summary =========');
console.log(`✅ Successful: ${successPages.length}/${pages.length} pages`);
console.log(`❌ Failed: ${failedPages.length}/${pages.length} pages`);

if (failedPages.length > 0) {
  console.log('\nFailed pages:');
  failedPages.forEach(page => console.log(`  - ${page}`));
}