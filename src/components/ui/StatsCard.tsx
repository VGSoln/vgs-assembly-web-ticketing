import React from 'react';
import { StatsCardProps } from '@/types/dashboard';
import { AnimatedNumber } from '../charts/AnimatedNumber';

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  percentage,
  gradient,
  icon: Icon,
  animated = true,
  isCurrency = false
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 text-white shadow-lg`}>
      <div className="text-sm font-medium opacity-90 mb-1">{title}</div>
      <div className="text-xl font-bold mb-1">
        {animated && typeof value === 'number' ? (
          <AnimatedNumber value={value} isCurrency={isCurrency} />
        ) : (
          value
        )}
        {percentage && (
          <span className="text-lg font-normal opacity-90 ml-2">({percentage})</span>
        )}
      </div>
      {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
      {Icon && (
        <div className="absolute top-4 right-4 opacity-50">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};