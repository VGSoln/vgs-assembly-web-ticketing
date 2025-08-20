export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
};

export const getDatePresets = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  
  const thisYearStart = new Date(today.getFullYear(), 0, 1);
  const thisYearEnd = new Date(today.getFullYear(), 11, 31);
  
  const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

  const formatForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    today: {
      label: 'Today',
      start: formatForInput(today),
      end: formatForInput(today)
    },
    yesterday: {
      label: 'Yesterday',
      start: formatForInput(yesterday),
      end: formatForInput(yesterday)
    },
    thisMonth: {
      label: 'This Month',
      start: formatForInput(thisMonthStart),
      end: formatForInput(thisMonthEnd)
    },
    lastMonth: {
      label: 'Last Month',
      start: formatForInput(lastMonthStart),
      end: formatForInput(lastMonthEnd)
    },
    thisYear: {
      label: 'This Year',
      start: formatForInput(thisYearStart),
      end: formatForInput(thisYearEnd)
    },
    lastYear: {
      label: 'Last Year',
      start: formatForInput(lastYearStart),
      end: formatForInput(lastYearEnd)
    }
  };
};

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 10; year <= currentYear + 5; year++) {
    years.push(year.toString());
  }
  return years;
};