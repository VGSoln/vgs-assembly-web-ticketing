import React from 'react';

interface LegendItem {
  color: string;
  label: string;
  value?: string | number;
}

interface LegendProps {
  items: LegendItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Legend: React.FC<LegendProps> = ({
  items,
  position = 'top',
  className = ''
}) => {
  const positionClasses = {
    top: 'justify-end mb-4',
    bottom: 'justify-center mt-4',
    left: 'flex-col items-start mr-4',
    right: 'flex-col items-end ml-4'
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${positionClasses[position]} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-xs font-medium text-gray-700">
            {item.label}
            {item.value && `: ${item.value}`}
          </span>
        </div>
      ))}
    </div>
  );
};