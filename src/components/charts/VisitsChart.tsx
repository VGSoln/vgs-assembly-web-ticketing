import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyVisitData } from '@/types/dashboard';
import { Legend } from '../ui/Legend';

interface VisitsChartProps {
  data: MonthlyVisitData[];
}

// Simple custom tooltip for visits
const VisitsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sortedPayload = payload
      .filter((entry: any) => entry.value > 0)
      .sort((a: any, b: any) => b.value - a.value);

    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-100 mb-2">{label} 2025</p>
        {sortedPayload.map((entry: any, index: number) => (
          <p key={index} className="font-medium text-white flex items-center mb-1">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.dataKey === 'prePaid' ? 'Pre-Paid' :
             entry.dataKey === 'paid' ? 'Paid' :
             entry.dataKey === 'partialPayment' ? 'Partial Payment' :
             entry.dataKey === 'visitedNoPayment' ? 'Visited - No Payment' :
             entry.dataKey === 'notVisited' ? 'Not Visited' :
             entry.dataKey}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const VisitsChart: React.FC<VisitsChartProps> = ({ data }) => {
  const legendItems = [
    { color: '#3b82f6', label: 'Pre-Paid' },
    { color: '#10b981', label: 'Paid' },
    { color: '#8b5cf6', label: 'Partial Payment' },
    { color: '#f59e0b', label: 'Visited - No Payment' },
    { color: '#dc2626', label: 'Not Visited' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">Monthly Visit Chart</h3>
        <p className="text-xs text-gray-500">Visit Performance Trend</p>
      </div>
      
      <Legend items={legendItems} position="top" className="mb-4" />
      
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="5%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval={0}
            />
            <YAxis 
              domain={[0, 1700]}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<VisitsTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
            <Bar dataKey="prePaid" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="paid" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="partialPayment" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="visitedNoPayment" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="notVisited" stackId="a" fill="#dc2626" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};