import React from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { DateRange } from '@/types/dashboard';
import { getDatePresets } from '@/lib/utils';
import { Button } from '../ui/Button';

interface DateRangePickerProps {
  isOpen: boolean;
  selectedDateRange: DateRange;
  displayDateRange: string;
  activePreset: string;
  onToggle: () => void;
  onPresetSelect: (presetKey: string) => void;
  onDateChange: (dateRange: DateRange) => void;
  onApplyRange: () => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  selectedDateRange,
  displayDateRange,
  activePreset,
  onToggle,
  onPresetSelect,
  onDateChange,
  onApplyRange,
  className = ''
}) => {
  const presets = getDatePresets();

  return (
    <div className={`relative date-range-picker ${className}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-blue-300 transition-all text-left text-sm"
      >
        <CalendarDays className="mr-3 text-gray-500" size={16} />
        <span className="flex-1 text-gray-700">{displayDateRange}</span>
        <ChevronDown className="text-gray-400" size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          {/* Quick Presets */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  key={key}
                  onClick={() => onPresetSelect(key)}
                  variant={activePreset === key ? 'primary' : 'outline'}
                  size="sm"
                  className="text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Custom Range */}
          <div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={selectedDateRange.start}
                  onChange={(e) => onDateChange({ ...selectedDateRange, start: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={selectedDateRange.end}
                  onChange={(e) => onDateChange({ ...selectedDateRange, end: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <Button
              onClick={onApplyRange}
              variant="primary"
              size="sm"
              className="w-full"
            >
              Apply Custom Range
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};