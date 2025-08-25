import React, { useState, useRef, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { PieDataItem } from '@/types/dashboard';
import { Legend } from '../ui/Legend';
import { SimplePieChart } from './SimplePieChart';

interface PieChartCardProps {
  title: string;
  data: PieDataItem[];
  legendItems?: { color: string; label: string }[];
  legendValues?: { color: string; label: string; value: string; onClick?: () => void }[];
  width?: number;
  height?: number;
  className?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  data: PieDataItem | null;
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  legendItems,
  legendValues,
  width = 280,
  height = 280,
  className = ''
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleMouseEnter = (entry: PieDataItem, event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        data: entry
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip(prev => ({
        ...prev,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }));
    }
  };

  const handleCellMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePieEnter = useCallback((_, index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handlePieClick = useCallback((data: any, index: number) => {
    if (!data) return;
    
    const legendValue = legendValues?.find(lv => lv.color === data.color);
    
    if (legendValue?.onClick) {
      legendValue.onClick();
    }
  }, [legendValues]);

  const renderTooltip = () => {
    if (!tooltip.visible || !tooltip.data) return null;

    const percentage = ((tooltip.data.value / total) * 100).toFixed(2);
    let formattedValue = tooltip.data.value.toLocaleString();
    
    // Format currency values
    if (tooltip.data.name === 'Current Debt' || tooltip.data.name === 'Old Debt') {
      formattedValue = `GH₵ ${tooltip.data.value.toLocaleString()}`;
    }

    return (
      <div
        className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-50"
        style={{
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-100%, -100%)'
        }}
      >
        <p className="font-medium">{tooltip.data.name}</p>
        <p className="text-blue-300">Value: {formattedValue}</p>
        <p className="text-green-300">Percentage: {percentage}%</p>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-3 ${className}`} ref={containerRef}>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      
      {legendItems && (
        <Legend 
          items={legendItems}
          position="top"
          className="mb-2"
        />
      )}
      
      <div className="flex items-center justify-center mb-2">
        <div className="relative" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}>
          <SimplePieChart
            data={data}
            width={width}
            height={height}
            onSectionClick={(index, clickedData) => {
              const legendValue = legendValues?.find(lv => lv.color === clickedData.color);
              if (legendValue?.onClick) {
                legendValue.onClick();
              }
            }}
          />
          {renderTooltip()}
        </div>
      </div>
      
      {legendValues && (
        <div className="flex flex-wrap gap-2 justify-center">
          {legendValues.map((item, index) => (
            <button 
              key={index} 
              className={`text-white px-3 py-1 rounded text-xs font-medium ${item.onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
              style={{ backgroundColor: item.color }}
              onClick={item.onClick}
              disabled={!item.onClick}
            >
              {item.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};