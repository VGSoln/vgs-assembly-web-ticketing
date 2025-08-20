'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface ModernSelectProps {
  placeholder: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showClear?: boolean;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
  className = '',
  showClear = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    value ? options.find(opt => opt.value === value) || null : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleClear = () => {
    setSelectedOption(null);
    onChange?.('');
  };

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
          ${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-500'}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[99999] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="max-h-60 overflow-auto">
            {/* Clear option */}
            {selectedOption && showClear && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-4 py-3 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
              >
                Clear selection
              </button>
            )}
            
            {/* Options */}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left text-sm
                  transition-colors duration-150
                  ${selectedOption?.value === option.value
                    ? 'bg-blue-50 text-blue-900 font-medium'
                    : 'text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="truncate">{option.label}</span>
                {selectedOption?.value === option.value && (
                  <Check className="h-4 w-4 text-blue-600 ml-2 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};