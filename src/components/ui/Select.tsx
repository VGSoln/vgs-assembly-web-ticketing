import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
    </div>
  );
};