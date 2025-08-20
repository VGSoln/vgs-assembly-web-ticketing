import React, { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { months } from '@/lib/utils';
import { Button } from '../ui/Button';

interface MonthYearPickerProps {
  isOpen: boolean;
  selectedMonth: string;
  selectedYear: string;
  onToggle: () => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onApply: () => void;
  className?: string;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  isOpen,
  selectedMonth,
  selectedYear,
  onToggle,
  onMonthChange,
  onYearChange,
  onApply,
  className = ''
}) => {
  const [yearInputMode, setYearInputMode] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);

  const handleYearNavigate = (direction: 'prev' | 'next') => {
    const currentYear = parseInt(selectedYear);
    if (direction === 'prev') {
      onYearChange((currentYear - 1).toString());
    } else {
      onYearChange((currentYear + 1).toString());
    }
  };

  const handleYearInputSubmit = () => {
    if (tempYear && !isNaN(Number(tempYear))) {
      onYearChange(tempYear);
    }
    setYearInputMode(false);
  };

  return (
    <div className={`relative month-year-picker ${className}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all text-left text-sm group"
      >
        <CalendarDays className="mr-3 text-blue-500 group-hover:text-blue-600" size={18} />
        <span className="flex-1 text-gray-800 font-medium">{selectedMonth} {selectedYear}</span>
        <ChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50">
          {/* Year Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleYearNavigate('prev')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 rotate-90" />
            </button>
            
            <div className="flex items-center space-x-2">
              {yearInputMode ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempYear}
                    onChange={(e) => setTempYear(e.target.value)}
                    className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleYearInputSubmit()}
                    autoFocus
                  />
                  <Button
                    onClick={handleYearInputSubmit}
                    variant="primary"
                    size="sm"
                    className="px-2 py-1 text-xs"
                  >
                    ✓
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setYearInputMode(true);
                    setTempYear(selectedYear);
                  }}
                  className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                >
                  {selectedYear}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleYearNavigate('next')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 -rotate-90" />
            </button>
          </div>
          
          {/* Month Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => onMonthChange(month)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-all transform hover:scale-105 ${
                    selectedMonth === month 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={onApply}
              variant="primary"
              size="sm"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};