import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { months } from '@/lib/utils';
import { Button } from './Button';

interface MonthYearPickerPortalProps {
  isOpen: boolean;
  selectedMonth: string;
  selectedYear: string;
  onToggle: () => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onApply: () => void;
  className?: string;
}

export const MonthYearPickerPortal: React.FC<MonthYearPickerPortalProps> = ({
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 350; // Approximate height of the dropdown
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determine if dropdown should open upward or downward
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      setPosition({
        top: shouldOpenUpward 
          ? rect.top + window.scrollY - dropdownHeight - 8
          : rect.bottom + window.scrollY + 8,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 340) // Ensure it doesn't go off right edge
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          buttonRef.current && 
          dropdownRef.current &&
          !buttonRef.current.contains(event.target as Node) &&
          !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

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

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '320px',
        maxHeight: '350px'
      }}
    >
      <div className="p-4 overflow-y-auto max-h-[350px]">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleYearNavigate('prev')}
          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
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
          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
        >
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 -rotate-90" />
        </button>
      </div>
      
      {/* Month Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedMonth === month 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
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
    </div>
  ) : null;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="w-full flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all text-left text-sm group"
      >
        <CalendarDays className="mr-3 text-blue-500 group-hover:text-blue-600" size={18} />
        <span className="flex-1 text-gray-800 font-medium">{selectedMonth} {selectedYear}</span>
        <ChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
      </button>
      
      {typeof document !== 'undefined' && ReactDOM.createPortal(dropdownContent, document.body)}
    </div>
  );
};