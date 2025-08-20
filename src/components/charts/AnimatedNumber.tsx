import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  isCurrency?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 1000, 
  isCurrency = false 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    const endValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  const formattedValue = isCurrency 
    ? displayValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : displayValue.toFixed(value.toString().includes('.') ? 2 : 0).toLocaleString();
  
  return (
    <span>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};