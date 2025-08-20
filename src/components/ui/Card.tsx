import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  padding = 'sm'
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5'
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};