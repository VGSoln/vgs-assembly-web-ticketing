'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ModernDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select Date",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date for display
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      // Add one day to handle timezone offset issues
      date.setDate(date.getDate() + 1);
      setDisplayValue(date.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    } else {
      // If no value, show today's date
      const today = new Date();
      setDisplayValue(today.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const [currentMonth, setCurrentMonth] = useState(() => {
    // Always start with current month, but if there's a selected value, show that month
    const date = value ? new Date(value) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  // Update currentMonth when value changes to ensure the calendar shows the selected date's month
  useEffect(() => {
    if (value) {
      const selectedDate = new Date(value);
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Initialize with today's date if no value provided
  useEffect(() => {
    if (!value) {
      const today = getTodayDate();
      onChange(today);
    }
  }, []);

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const getLastWeekDate = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return lastWeek.toISOString().split('T')[0];
  };

  const presetDates = [
    { label: 'Today', value: getTodayDate() },
    { label: 'Yesterday', value: getYesterdayDate() },
    { label: 'Last Week', value: getLastWeekDate() }
  ];

  // Calendar generation functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    handleDateChange(dateString);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    // Add one day to handle timezone offset
    selectedDate.setDate(selectedDate.getDate() + 1);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white border border-gray-200 rounded-xl
          text-left text-sm transition-all duration-200
          hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20' : ''}
          ${displayValue ? 'text-gray-900 font-medium' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center">
          <Calendar className="mr-3 text-gray-400" size={16} />
          <span className="truncate">
            {displayValue || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[9999] w-80 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-4">
            {/* Quick Presets */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-3 font-medium">Quick Select</div>
              <div className="grid grid-cols-3 gap-2">
                {presetDates.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleDateChange(preset.value)}
                    className={`
                      px-3 py-2 text-xs rounded-lg font-medium transition-all duration-150
                      ${value === preset.value 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Calendar */}
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <div className="text-sm font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`
                          w-full h-full flex items-center justify-center text-sm rounded-lg
                          transition-all duration-150 hover:bg-blue-50
                          ${
                            isSelected(day)
                              ? 'bg-blue-500 text-white font-semibold shadow-sm'
                              : isToday(day)
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-700 hover:text-blue-600'
                          }
                        `}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};