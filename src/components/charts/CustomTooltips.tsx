import React from 'react';

// Custom Tooltip for Revenue Charts (matching original design)
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sortedPayload = payload
      .filter((entry: any) => entry.value > 0)
      .sort((a: any, b: any) => parseInt(b.dataKey) - parseInt(a.dataKey));

    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-500 text-sm">
        <p className="font-bold text-blue-100 mb-2">{label}</p>
        {sortedPayload.map((entry: any, index: number) => (
          <p key={index} className="font-medium text-white flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.dataKey}: GHS {(entry.value * 1000).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Visits Charts (unique modern card design)
export const CustomVisitsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalCustomers = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white rounded-xl shadow-2xl border border-blue-100 p-4 text-sm min-w-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <h4 className="font-bold text-gray-800 text-base">{label} 2025</h4>
          <div className="bg-blue-50 px-2 py-1 rounded-full">
            <span className="text-blue-600 font-medium text-xs">Total: {totalCustomers}</span>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-sm mr-3 border border-white shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="font-medium text-gray-700 text-sm">
                    {entry.dataKey === 'prePaid' ? 'Pre-Paid' :
                     entry.dataKey === 'paid' ? 'Paid' :
                     entry.dataKey === 'partialPayment' ? 'Partial Payment' :
                     entry.dataKey === 'visitedNoPayment' ? 'Visited - No Payment' :
                     entry.dataKey === 'notVisited' ? 'Not Visited' :
                     entry.dataKey}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{entry.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">
                    {((entry.value / totalCustomers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            Customer Visit Distribution
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Pie Charts (matching original design)
export const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const name = data.name || 'Unknown';
    const value = data.value || 0;
    
    // Calculate percentage from total
    let percentage = '0';
    if (data.payload) {
      const total = data.payload.payload?.total || data.value;
      if (total && total > 0) {
        percentage = ((value / total) * 100).toFixed(2);
      }
    }
    
    // Format value
    let formattedValue = value.toLocaleString();
    if (name === 'Current Debt' || name === 'Old Debt') {
      formattedValue = `GHS ${value.toLocaleString()}`;
    }

    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-blue-300">Value: {formattedValue}</p>
        <p className="text-green-300">Percentage: {percentage}%</p>
      </div>
    );
  }
  return null;
};