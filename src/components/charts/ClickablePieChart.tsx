import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieDataItem } from '@/types/dashboard';

interface ClickablePieChartProps {
  data: PieDataItem[];
  width?: number;
  height?: number;
  onSectionClick?: (index: number, data: PieDataItem) => void;
}

export const ClickablePieChart: React.FC<ClickablePieChartProps> = ({
  data,
  width = 280,
  height = 280,
  onSectionClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate angles for each section
  // Recharts startAngle of 90 means it starts from top (12 o'clock) and goes clockwise
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 90; // Match Recharts startAngle
  
  const sections = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angleSpan = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle = endAngle;
    
    console.log(`Section ${index} - ${item.name}:`, {
      color: item.color,
      value: item.value,
      percentage: percentage.toFixed(2) + '%',
      startAngle: startAngle.toFixed(2),
      endAngle: endAngle.toFixed(2),
      angleSpan: angleSpan.toFixed(2)
    });
    
    return {
      ...item,
      index,
      startAngle,
      endAngle,
      angleSpan,
      percentage
    };
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onSectionClick) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;
    
    // Calculate angle from center
    // Math.atan2 returns angle where: 0° is right, 90° is bottom, 180° is left, -90° is top
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    
    // Convert to match Recharts coordinate system
    // Recharts uses 90° as top (12 o'clock) going clockwise
    angle = (angle + 90 + 360) % 360;
    
    // Debug logging
    console.log('Click position:', { x, y });
    console.log('Calculated angle (from top, clockwise):', angle);
    console.log('Sections:', sections.map(s => ({ 
      name: s.name, 
      start: s.startAngle, 
      end: s.endAngle,
      span: s.angleSpan,
      color: s.color 
    })));
    
    // Find which section was clicked
    const clickedSection = sections.find((section, idx) => {
      const start = section.startAngle % 360;
      const end = section.endAngle % 360;
      
      console.log(`Checking section ${idx} - ${section.name}: angle ${angle.toFixed(2)} in range [${start.toFixed(2)}, ${end.toFixed(2)})?`);
      
      // Check if angle falls within this section's range
      if (section.endAngle > 360 && section.startAngle < 360) {
        // Section crosses 0°
        const inRange = angle >= start || angle < end;
        console.log(`  Cross-zero check: ${inRange}`);
        return inRange;
      } else if (section.startAngle >= 360) {
        // Entire section is past 360°, need to check wrapped angles
        const wrappedStart = start;
        const wrappedEnd = end;
        const inRange = angle >= wrappedStart && angle < wrappedEnd;
        console.log(`  Wrapped section check: ${inRange}`);
        return inRange;
      } else {
        // Normal range check
        const inRange = angle >= start && angle < end;
        console.log(`  Normal range check: ${inRange}`);
        return inRange;
      }
    });
    
    if (clickedSection) {
      console.log('Section clicked:', clickedSection.name, clickedSection.index);
      onSectionClick(clickedSection.index, clickedSection);
    } else {
      console.log('No section found for angle:', angle);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative cursor-pointer" 
      style={{ width, height }}
      onClick={handleClick}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
            innerRadius={0}
            outerRadius={120}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};