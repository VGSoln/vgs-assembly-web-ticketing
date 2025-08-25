import React, { useState } from 'react';
import { Calendar, Download, FileText, FileSpreadsheet, File, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2, Printer } from 'lucide-react';
import { ModernSelect } from '../ui/ModernSelect';
import { MonthYearPickerPortal } from '../ui/MonthYearPickerPortal';

interface BillGenerationPageProps {
  // Add props if needed
}

export const BillGenerationPage: React.FC<BillGenerationPageProps> = () => {
  const [selectedBusinessCenter, setSelectedBusinessCenter] = useState('');
  const [selectedZone, setSelectedZone] = useState('ZONE 1');
  const [billingPeriod, setBillingPeriod] = useState('customers');
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [monthYearPickerOpen, setMonthYearPickerOpen] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(172);
  const [zoomLevel, setZoomLevel] = useState(125);

  const businessCenterOptions = [
    { value: '', label: 'Select Business Center' },
    { value: 'kweiman-danfa', label: 'Kweiman-Danfa Water System' },
    { value: 'center2', label: 'Business Center 2' },
    { value: 'center3', label: 'Business Center 3' },
    { value: 'center4', label: 'Business Center 4' },
    { value: 'center5', label: 'Business Center 5' }
  ];

  const zoneOptions = [
    { value: '', label: 'Zones' },
    { value: 'ZONE 1', label: 'ZONE 1' },
    { value: 'ZONE 2', label: 'ZONE 2' },
    { value: 'ZONE 3', label: 'ZONE 3' },
    { value: 'ZONE 4', label: 'ZONE 4' },
    { value: 'ZONE 5', label: 'ZONE 5' },
    { value: 'ZONE 6', label: 'ZONE 6' },
    { value: 'ZONE 7', label: 'ZONE 7' },
    { value: 'ZONE 8', label: 'ZONE 8' }
  ];


  const handleRunReport = () => {
    console.log('Running report with:', {
      businessCenter: selectedBusinessCenter,
      zone: selectedZone,
      billingPeriod,
      month: selectedMonth,
      year: selectedYear
    });
    setReportGenerated(true);
  };

  const handleDownload = (format: string) => {
    console.log(`Downloading report in ${format} format`);
    // Add download logic here
  };

  const handleMonthYearApply = () => {
    setMonthYearPickerOpen(false);
    console.log(`Selected: ${selectedMonth} ${selectedYear}`);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Report Parameters */}
      <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Card Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Report Parameters</h2>
        </div>

        {/* Card Body - no scroll needed, content fits */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
              {/* Select Business Center */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Business Center
                </label>
                <ModernSelect
                  value={selectedBusinessCenter}
                  onChange={(value) => setSelectedBusinessCenter(value)}
                  options={businessCenterOptions}
                  placeholder="Select Business Center"
                />
              </div>

              {/* Select Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Zone
                </label>
                <ModernSelect
                  value={selectedZone}
                  onChange={(value) => setSelectedZone(value)}
                  options={zoneOptions}
                  placeholder="Zones"
                />
              </div>

              {/* Billing Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Billing Period
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billingPeriod"
                      value="customers"
                      checked={billingPeriod === 'customers'}
                      onChange={(e) => setBillingPeriod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Customers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billingPeriod"
                      value="standpipe"
                      checked={billingPeriod === 'standpipe'}
                      onChange={(e) => setBillingPeriod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Standpipe</span>
                  </label>
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Month
                </label>
                <MonthYearPickerPortal
                  isOpen={monthYearPickerOpen}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onToggle={() => setMonthYearPickerOpen(!monthYearPickerOpen)}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                  onApply={handleMonthYearApply}
                  className="w-full"
                />
              </div>

              {/* Run Report Button */}
              <div className="pt-2">
                <button
                  onClick={handleRunReport}
                  className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Report
                </button>
              </div>

              {/* Download Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Download Options
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="flex-1 px-2 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <FileText size={16} />
                    PDF
                  </button>
                  <button
                    onClick={() => handleDownload('excel')}
                    className="flex-1 px-2 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <FileSpreadsheet size={16} />
                    Excel
                  </button>
                  <button
                    onClick={() => handleDownload('csv')}
                    className="flex-1 px-2 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <File size={16} />
                    CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Right Content Area - PDF Viewer */}
      <div className="flex-1 h-full bg-gray-900 relative">
        {!reportGenerated ? (
          // Empty state before report is generated
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select parameters and click "Run Report" to generate</p>
            </div>
          </div>
        ) : (
          <>
            {/* PDF Viewer Toolbar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Navigation controls */}
                <button
                  onClick={handlePreviousPage}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center gap-2 text-gray-300">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center"
                    min={1}
                    max={totalPages}
                  />
                  <span>/ {totalPages}</span>
                </div>
                <button
                  onClick={handleNextPage}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                >
                  <ZoomOut className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-gray-300 min-w-[60px] text-center">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                >
                  <ZoomIn className="w-5 h-5 text-gray-400" />
                </button>
                
                <div className="border-l border-gray-600 h-6 mx-2"></div>
                
                {/* Other controls */}
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                  <RotateCw className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                  <Maximize2 className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                  <Printer className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* PDF Content Area */}
            <div className="flex justify-center p-8 overflow-auto h-[calc(100%-60px)]">
              <div 
                className="bg-white shadow-2xl"
                style={{
                  width: `${8.5 * (zoomLevel / 100)}in`,
                  minHeight: `${11 * (zoomLevel / 100)}in`,
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                {/* Sample Bill Content */}
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-xl font-bold">Community Water & Sanitation Agency</h1>
                    <p className="text-sm">Kweiman-Danfa Water System</p>
                    <p className="text-sm">GM-234-1979, Kweiman, Greater Accra</p>
                    <p className="text-sm">0202199626</p>
                    <p className="text-sm">kweimandanfa@gmail.com</p>
                  </div>

                  <div className="border-t-2 border-b-2 border-black py-2 mb-4">
                    <div className="flex justify-between">
                      <div>
                        <p><strong>Account No.</strong> 02-0002-000001</p>
                        <p><strong>Total Amount Due:</strong> GHS 21.70</p>
                        <p><strong>Payment Due By:</strong> 16th July, 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-red-600 text-sm">
                      Please pay your bills promptly (by the Payment Due Date) to avoid disconnection. 
                      Reconnection Fee is GHS 50.00.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border p-2">
                      <p><strong>Account Name:</strong> VGS CUSTOMER</p>
                      <p><strong>Address:</strong> VG Solutions Ltd</p>
                      <p><strong>Account Type:</strong> Domestic</p>
                      <p><strong>Zone / Section:</strong> ZONE 1</p>
                    </div>
                    <div className="border p-2">
                      <p><strong>Bill ID:</strong> 0000020377</p>
                      <p><strong>Bill Date:</strong> 01 July, 2025</p>
                      <p><strong>Bill Period:</strong> June 2025</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Meter Reading and Water Consumption</h3>
                    <table className="w-full border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Meter No.</th>
                          <th className="border p-2 text-left">From Date</th>
                          <th className="border p-2 text-left">To Date</th>
                          <th className="border p-2 text-left">Previous Read</th>
                          <th className="border p-2 text-left">Current Read</th>
                          <th className="border p-2 text-left">Consumption M³</th>
                          <th className="border p-2 text-left">Tariff Rate (GHS) / M³</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">VGSmETER123</td>
                          <td className="border p-2">06/02/2025</td>
                          <td className="border p-2">06/02/2025</td>
                          <td className="border p-2">0.0</td>
                          <td className="border p-2">0.0</td>
                          <td className="border p-2">0.0</td>
                          <td className="border p-2">12.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">TOTAL AMOUNT DUE: GHS 21.70</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};