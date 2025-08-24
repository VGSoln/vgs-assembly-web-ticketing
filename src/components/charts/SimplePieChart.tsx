import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { PieDataItem } from '@/types/dashboard';
import '@/styles/pie-chart.css';

interface SimplePieChartProps {
  data: PieDataItem[];
  width?: number;
  height?: number;
  onSectionClick?: (index: number, data: PieDataItem) => void;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  width = 280,
  height = 280,
  onSectionClick
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(undefined);
  };

  const handleClick = (data: any, index: number) => {
    if (onSectionClick) {
      onSectionClick(index, data);
    }
  };

  return (
    <>
      <style>{`
        .pie-chart-container,
        .pie-chart-container *,
        .pie-chart-container *:focus,
        .pie-chart-container *:active,
        .pie-chart-container svg,
        .pie-chart-container svg:focus,
        .recharts-wrapper,
        .recharts-wrapper:focus,
        .recharts-surface,
        .recharts-surface:focus,
        .recharts-layer,
        .recharts-layer:focus,
        .recharts-pie,
        .recharts-pie:focus,
        .recharts-pie-sector,
        .recharts-pie-sector:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        .recharts-pie-sector {
          cursor: pointer !important;
        }
        .recharts-pie-sector:hover {
          cursor: pointer !important;
        }
        .recharts-layer {
          cursor: pointer !important;
        }
      `}</style>
      <div 
        className="pie-chart-container"
        style={{ 
          width, 
          height, 
          cursor: 'pointer', 
          outline: 'none',
          border: 'none',
          boxShadow: 'none'
        }}
        onFocus={(e) => e.preventDefault()}
        tabIndex={-1}
      >
        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
          <PieChart style={{ outline: 'none' }}>
            <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={120}
            dataKey="value"
            onClick={handleClick}
            onMouseEnter={handlePieEnter}
            onMouseLeave={handlePieLeave}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    </>
  );
};