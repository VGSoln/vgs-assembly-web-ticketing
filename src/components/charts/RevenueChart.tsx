import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataItem, ActiveYears } from '@/types/dashboard';

interface RevenueChartProps {
  data: ChartDataItem[];
  activeYears: ActiveYears;
  onToggleYear: (year: number) => void;
}

// Revenue Tooltip matching original design
const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sortedPayload = payload
      .filter((entry: any) => entry.value > 0)
      .sort((a: any, b: any) => parseInt(b.dataKey) - parseInt(a.dataKey));

    return (
      <div 
        className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-500 text-sm recharts-tooltip-custom"
        style={{
          zIndex: 9999,
          position: 'relative',
          pointerEvents: 'none'
        }}
      >
        <p className="font-bold text-blue-100 mb-2">{label}</p>
        {sortedPayload.map((entry: any, index: number) => (
          <p key={index} className="font-medium text-white flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.dataKey}: GH₵{(entry.value * 1000).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  activeYears,
  onToggleYear
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Monthly Revenue Chart</h3>
          <p className="text-xs text-gray-500">Revenue Performance Trend</p>
        </div>
        <div className="flex space-x-1">
          {[2023, 2024, 2025].map((year) => (
            <button
              key={year}
              onClick={() => onToggleYear(year)}
              className={`flex items-center px-2 py-1 rounded text-xs transition-all ${
                activeYears[year] 
                  ? 'bg-gray-100 hover:bg-gray-200' 
                  : 'bg-gray-50 opacity-50 hover:opacity-75'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-1 ${
                year === 2023 ? 'bg-amber-500' :
                year === 2024 ? 'bg-blue-500' : 'bg-emerald-500'
              }`}></div>
              <span className="font-medium text-gray-700">{year}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
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
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip 
              content={<RevenueTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            {activeYears[2023] && (
              <Bar dataKey="2023" fill="#f59e0b" radius={[2, 2, 0, 0]} maxBarSize={200} />
            )}
            {activeYears[2024] && (
              <Bar dataKey="2024" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={200} />
            )}
            {activeYears[2025] && (
              <Bar dataKey="2025" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={200} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};