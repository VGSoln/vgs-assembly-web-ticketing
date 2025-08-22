import { Calendar, TrendingUp, Users, DollarSign, CreditCard, AlertTriangle, ChevronDown, ChevronRight, Menu, X, Activity, ArrowUp, ArrowDown, MoreVertical, CalendarDays, FileText, Droplet, LayoutDashboard, MapPin, Gauge, Database, Banknote, LogOut, Eye } from 'lucide-react';

export const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    color: 'text-blue-400',
    subItems: [
      { label: 'Performance Overview', page: 'performance' },
      { label: 'Debt Overview', page: 'debt' }
    ]
  },
  { 
    icon: Eye, 
    label: 'Visits', 
    color: 'text-blue-300', 
    subItems: [
      { label: 'Visits Dashboard', page: 'visits' },
      { label: 'Visits', page: 'visits-list' }
    ] 
  },
  { 
    icon: FileText, 
    label: 'Reports', 
    color: 'text-green-400', 
    subItems: [
      { label: 'Bill Generation' },
      { label: 'Field Attendance Report' },
      { label: 'Field Hours Worked' },
      { label: 'Daily Field Hours Worked' },
      { label: 'Customer Months Since Last Reading' },
      { label: 'Customer Meter Readings' },
      { label: 'Pump Station Readings' },
      { label: 'Pump Station Days Since Last Reading' },
      { label: 'System Water Losses' },
      { label: 'Storage Tanks Readings' },
      { label: 'Storage Tanks Days Since Last Reading' },
      { label: 'Monthly Bill Summary Report' },
      { label: 'Statement of Account Report' },
      { label: 'Summary Collector Reconciliation' },
      { label: 'Collector Reconciliation' }
    ] 
  },
  { 
    icon: CreditCard, 
    label: 'Payments', 
    color: 'text-purple-400',
    subItems: [
      { label: 'Payments', page: 'payments' },
      { label: 'Bank Deposits', page: 'bank-deposits' }
    ]
  },
  { 
    icon: Users, 
    label: 'Customers', 
    color: 'text-orange-400',
    subItems: [
      { label: 'Customers', page: 'customers' }
    ]
  },
  { 
    icon: MapPin, 
    label: 'GPS', 
    color: 'text-blue-400',
    subItems: [
      { label: 'Customer Locations', page: 'customer-locations' },
      { label: 'Collector Locations', page: 'collector-locations' },
      { label: 'Collector Paths', page: 'collector-paths' },
      { label: 'Pump Station Locations', page: 'pump-station-locations' },
      { label: 'Storage Tank Locations', page: 'storage-tank-locations' }
    ]
  },
  { 
    icon: Gauge, 
    label: 'Meter Readings', 
    color: 'text-cyan-400',
    subItems: [
      { label: 'Meter Readings', page: 'customer-meter-readings' },
      { label: 'Storage Tank Meter Readings', page: 'storage-tank-meter-readings' },
      { label: 'Pump Station Meter Readings', page: 'pump-station-meter-readings' }
    ]
  },
  { 
    icon: Users, 
    label: 'Staff', 
    color: 'text-pink-400',
    subItems: [
      { label: 'Staff', page: 'staff' }
    ]
  },
  { 
    icon: Database, 
    label: 'Storage Tanks', 
    color: 'text-yellow-400',
    subItems: [
      { label: 'Storage Tanks', page: 'storage-tanks' }
    ]
  },
  { 
    icon: Droplet, 
    label: 'Pump Stations', 
    color: 'text-indigo-400',
    subItems: [
      { label: 'Pump Stations', page: 'pump-stations' }
    ]
  },
];

export const chartData = [
  { month: 'JAN', 2023: 120, 2024: 95, 2025: 145 },
  { month: 'FEB', 2023: 180, 2024: 165, 2025: 235 },
  { month: 'MAR', 2023: 0, 2024: 0, 2025: 202 },
  { month: 'APR', 2023: 0, 2024: 0, 2025: 178 },
  { month: 'MAY', 2023: 0, 2024: 0, 2025: 155 },
  { month: 'JUN', 2023: 0, 2024: 130, 2025: 152 },
  { month: 'JUL', 2023: 0, 2024: 0, 2025: 201 },
  { month: 'AUG', 2023: 0, 2024: 0, 2025: 28 },
  { month: 'SEP', 2023: 0, 2024: 0, 2025: 0 },
  { month: 'OCT', 2023: 0, 2024: 0, 2025: 0 },
  { month: 'NOV', 2023: 0, 2024: 0, 2025: 0 },
  { month: 'DEC', 2023: 0, 2024: 175, 2025: 0 },
];

export const customerPaymentStatusData = [
  { name: 'Pre-Paid', value: 146, color: '#3b82f6' },
  { name: 'Paid', value: 148, color: '#10b981' },
  { name: 'Partial Payment', value: 63, color: '#8b5cf6' },
  { name: 'Visited - No Payment', value: 2, color: '#f59e0b' },
  { name: 'Not Visited', value: 1272, color: '#dc2626' }
];

export const defaulterReasonsData = [
  { name: 'No One Home', value: 0, color: '#3b82f6' },
  { name: 'Meter Disconnected', value: 1, color: '#dc2626' },
  { name: 'Water Supply Issues', value: 0, color: '#10b981' },
  { name: 'Cancelled/Stopped', value: 0, color: '#8b5cf6' },
  { name: 'Excuses', value: 0, color: '#f59e0b' },
  { name: 'Unreadable Meter', value: 0, color: '#f97316' },
  { name: 'Inaccessible Meter', value: 0, color: '#06b6d4' },
  { name: 'Faulty Meter', value: 0, color: '#1f2937' },
  { name: 'Other', value: 1, color: '#6b7280' }
];

export const monthlyVisitData = [
  { month: 'JAN', prePaid: 180, paid: 220, partialPayment: 150, visitedNoPayment: 45, notVisited: 1036 },
  { month: 'FEB', prePaid: 195, paid: 240, partialPayment: 165, visitedNoPayment: 38, notVisited: 993 },
  { month: 'MAR', prePaid: 210, paid: 260, partialPayment: 180, visitedNoPayment: 32, notVisited: 949 },
  { month: 'APR', prePaid: 400, paid: 600, partialPayment: 500, visitedNoPayment: 131, notVisited: 0 },
  { month: 'MAY', prePaid: 240, paid: 300, partialPayment: 210, visitedNoPayment: 25, notVisited: 856 },
  { month: 'JUN', prePaid: 155, paid: 320, partialPayment: 125, visitedNoPayment: 22, notVisited: 1009 },
  { month: 'JUL', prePaid: 170, paid: 340, partialPayment: 90, visitedNoPayment: 18, notVisited: 1013 },
  { month: 'AUG', prePaid: 146, paid: 148, partialPayment: 63, visitedNoPayment: 2, notVisited: 1272 },
  { month: 'SEP', prePaid: 0, paid: 0, partialPayment: 0, visitedNoPayment: 0, notVisited: 0 },
  { month: 'OCT', prePaid: 0, paid: 0, partialPayment: 0, visitedNoPayment: 0, notVisited: 0 },
  { month: 'NOV', prePaid: 0, paid: 0, partialPayment: 0, visitedNoPayment: 0, notVisited: 0 },
  { month: 'DEC', prePaid: 0, paid: 0, partialPayment: 0, visitedNoPayment: 0, notVisited: 0 },
];

export const paidCustomersData = [
  { name: 'Paid Customers', value: 118, color: '#10b981' },
  { name: 'Non Paid Customers', value: 1468, color: '#dc2626' }
];

export const totalDebtData = [
  { name: 'Current Debt', value: 162856, color: '#10b981' },
  { name: 'Old Debt', value: 234052, color: '#dc2626' }
];

export const debtByMonthsData = [
  { name: 'No Debt', value: 125, color: '#10b981' },
  { name: '1 Month Debt', value: 491, color: '#3b82f6' },
  { name: '2 Month Debt', value: 307, color: '#8b5cf6' },
  { name: '3 Month Debt', value: 174, color: '#f59e0b' },
  { name: '4+ Month Debt', value: 340, color: '#dc2626' }
];

export const visitsTransactionsData = [
  {
    id: 7342,
    customerNumber: '0525-07-00968',
    customerName: 'ANKRAH ADEDI KWAKU.',
    phone: '0244208620',
    zone: 'ZONE 6',
    staffName: 'Lydia Apanatinga',
    visitDate: '13 Aug 2025',
    visitTime: '1:59 PM',
    visitOutcome: 'Other',
    customerComments: '',
    staffComments: 'Correct name to Ankrah Abedi Kwaku',
    created: '13 Aug 2025 1:59 PM',
    gps: true,
    photo: true
  },
  {
    id: 7321,
    customerNumber: '0525-07-01173',
    customerName: 'SEGBEMON PASCALINE.',
    phone: '0243209962',
    zone: 'ZONE 3',
    staffName: 'Francis Seguri',
    visitDate: '13 Aug 2025',
    visitTime: '10:08 AM',
    visitOutcome: 'Other',
    customerComments: 'add 0243209962',
    staffComments: '',
    created: '13 Aug 2025 10:08 AM',
    gps: true,
    photo: true
  },
  {
    id: 7295,
    customerNumber: '0525-07-01266',
    customerName: 'COMFORT NANAYAA AMPADU.',
    phone: '0542373096',
    zone: 'ZONE 3',
    staffName: 'Francis Seguri',
    visitDate: '11 Aug 2025',
    visitTime: '12:59 PM',
    visitOutcome: 'Other',
    customerComments: 'change 0542373096',
    staffComments: '',
    created: '11 Aug 2025 12:59 PM',
    gps: true,
    photo: true
  },
  {
    id: 7266,
    customerNumber: '0525-07-00658',
    customerName: 'JENNIFER OPPONG.',
    phone: '0243559271',
    zone: 'ZONE 1',
    staffName: 'Kubura Abdul Rahman',
    visitDate: '07 Aug 2025',
    visitTime: '9:25 AM',
    visitOutcome: 'Other',
    customerComments: '0243559271',
    staffComments: '',
    created: '07 Aug 2025 9:25 AM',
    gps: true,
    photo: true
  },
  {
    id: 7261,
    customerNumber: '0504-07-001582',
    customerName: 'COMFORT KOUKOR AMORN 4.',
    phone: '0245118317',
    zone: 'ZONE 3',
    staffName: 'Francis Seguri',
    visitDate: '06 Aug 2025',
    visitTime: '3:00 PM',
    visitOutcome: 'Other',
    customerComments: '0245118317 please change',
    staffComments: '',
    created: '06 Aug 2025 3:00 PM',
    gps: true,
    photo: true
  },
  {
    id: 7236,
    customerNumber: '0525-07-00324',
    customerName: 'SAMUEL ATUKWEI QUAYE.',
    phone: '0244582252',
    zone: 'ZONE 4',
    staffName: 'Rapheal Kwabena Aboagye',
    visitDate: '04 Aug 2025',
    visitTime: '1:06 PM',
    visitOutcome: 'Other',
    customerComments: '',
    staffComments: 'change to 0244582252',
    created: '04 Aug 2025 1:06 PM',
    gps: true,
    photo: true
  },
  {
    id: 7233,
    customerNumber: '0525-07-01444',
    customerName: 'NAAOH HELEN 1.',
    phone: '0544963433',
    zone: 'ZONE 3',
    staffName: 'Francis Seguri',
    visitDate: '04 Aug 2025',
    visitTime: '10:41 AM',
    visitOutcome: 'Other',
    customerComments: '',
    staffComments: 'change to 0544963433',
    created: '04 Aug 2025 10:41 AM',
    gps: true,
    photo: true
  },
  {
    id: 7219,
    customerNumber: '0525-07-01142',
    customerName: 'MICHAEL DARKO.',
    phone: '0249202180',
    zone: 'ZONE 3',
    staffName: 'MICHAEL OPOKU',
    visitDate: '01 Aug 2025',
    visitTime: '10:50 AM',
    visitOutcome: 'Meter Disconnected',
    customerComments: '',
    staffComments: 'The manager says we should take this client out since he has been disconnected.',
    created: '01 Aug 2025 10:50 AM',
    gps: true,
    photo: true
  }
];

export const pumpStationsData = [
  {
    id: 4,
    pumpStationNumber: '4',
    waterSystemName: 'Kweiman-Danfa Water System',
    pumpStationName: 'Pump Station 4',
    status: 'Operational',
    throughput: 60,
    meterNumber: '20987686449',
    lastReadingDate: '30 January, 2025',
    daysSinceLastReading: 197,
    lastReading: 133262,
    location: 'Location 4',
    gps: true
  },
  {
    id: 3,
    pumpStationNumber: '3',
    waterSystemName: 'Kweiman-Danfa Water System',
    pumpStationName: 'Pump Station 3',
    status: 'Operational',
    throughput: 60,
    meterNumber: '20987638007',
    lastReadingDate: '30 January, 2025',
    daysSinceLastReading: 197,
    lastReading: 387686,
    location: 'Location 3',
    gps: true
  },
  {
    id: 2,
    pumpStationNumber: '2',
    waterSystemName: 'Kweiman-Danfa Water System',
    pumpStationName: 'Pump Station 2',
    status: 'Out of Service',
    throughput: 60,
    meterNumber: '20987589565',
    lastReadingDate: '17 April, 2025',
    daysSinceLastReading: 120,
    lastReading: 75534,
    location: 'Location 2',
    gps: true
  },
  {
    id: 1,
    pumpStationNumber: '1',
    waterSystemName: 'Kweiman-Danfa Water System',
    pumpStationName: 'Pump Station 1',
    status: 'Operational',
    throughput: 60,
    meterNumber: '20086000039',
    lastReadingDate: '30 January, 2025',
    daysSinceLastReading: 197,
    lastReading: 4370,
    location: 'Location 1',
    gps: true
  }
];

export const storageTanksData = [
  {
    id: 2,
    storageTankNumber: '2',
    waterSystemName: 'Kweiman-Danfa Water System',
    storageTankName: 'Storage Tank 2',
    throughput: 60,
    meterNumber: '80881111846',
    lastReadingDate: '',
    daysSinceLastReading: 0,
    lastReading: 0,
    location: 'Location 2',
    gps: true
  },
  {
    id: 1,
    storageTankNumber: '1',
    waterSystemName: 'Kweiman-Danfa Water System',
    storageTankName: 'Storage Tank 1',
    throughput: 60,
    meterNumber: '80887541785',
    lastReadingDate: '',
    daysSinceLastReading: 0,
    lastReading: 0,
    location: 'Location 1',
    gps: true
  }
];

export const businessLevelOptions = [
  { value: 'level1', label: 'Business Level 1' },
  { value: 'level2', label: 'Business Level 2' },
  { value: 'level3', label: 'Business Level 3' }
];

export const zoneOptions = [
  { value: 'zone1', label: 'ZONE 1' },
  { value: 'zone2', label: 'ZONE 2' },
  { value: 'zone3', label: 'ZONE 3' },
  { value: 'zone4', label: 'ZONE 4' },
  { value: 'zone5', label: 'ZONE 5' },
  { value: 'zone6', label: 'ZONE 6' }
];

export const collectorOptions = [
  { value: 'lydia', label: 'Lydia Apanatinga' },
  { value: 'francis', label: 'Francis Seguri' },
  { value: 'kubura', label: 'Kubura Abdul Rahman' },
  { value: 'rapheal', label: 'Rapheal Kwabena Aboagye' },
  { value: 'michael', label: 'MICHAEL OPOKU' }
];

export const pumpStationMeterReadingsData = [
  {
    id: 1,
    pumpStationMeterNumber: 'PSM001',
    pumpStationName: 'Pump Station 1',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    status: 'Operational',
    staffName: 'Francis Seguri',
    readingDate: '15 Aug 2025',
    serverDate: '15 Aug 2025',
    reading: 4500,
    fieldReading: 4500,
    picture: true
  },
  {
    id: 2,
    pumpStationMeterNumber: 'PSM002',
    pumpStationName: 'Pump Station 2',
    meterType: 'Analog',
    system: 'Kweiman-Danfa',
    status: 'Out of Service',
    staffName: 'Lydia Apanatinga',
    readingDate: '14 Aug 2025',
    serverDate: '14 Aug 2025',
    reading: 75800,
    fieldReading: 75800,
    picture: true
  },
  {
    id: 3,
    pumpStationMeterNumber: 'PSM003',
    pumpStationName: 'Pump Station 3',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    status: 'Operational',
    staffName: 'Kubura Abdul Rahman',
    readingDate: '13 Aug 2025',
    serverDate: '13 Aug 2025',
    reading: 388200,
    fieldReading: 388200,
    picture: true
  },
  {
    id: 4,
    pumpStationMeterNumber: 'PSM004',
    pumpStationName: 'Pump Station 4',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    status: 'Operational',
    staffName: 'Rapheal Kwabena Aboagye',
    readingDate: '12 Aug 2025',
    serverDate: '12 Aug 2025',
    reading: 133500,
    fieldReading: 133500,
    picture: true
  }
];

export const storageTankMeterReadingsData = [
  {
    id: 1,
    storageTankMeterNumber: 'STM001',
    storageTankName: 'Storage Tank 1',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    staffName: 'Francis Seguri',
    readingDate: '15 Aug 2025',
    serverDate: '15 Aug 2025',
    reading: 2500,
    fieldReading: 2500,
    picture: true
  },
  {
    id: 2,
    storageTankMeterNumber: 'STM002',
    storageTankName: 'Storage Tank 2',
    meterType: 'Analog',
    system: 'Kweiman-Danfa',
    staffName: 'Lydia Apanatinga',
    readingDate: '14 Aug 2025',
    serverDate: '14 Aug 2025',
    reading: 42300,
    fieldReading: 42300,
    picture: true
  },
  {
    id: 3,
    storageTankMeterNumber: 'STM003',
    storageTankName: 'Storage Tank 3',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    staffName: 'Kubura Abdul Rahman',
    readingDate: '13 Aug 2025',
    serverDate: '13 Aug 2025',
    reading: 156800,
    fieldReading: 156800,
    picture: true
  },
  {
    id: 4,
    storageTankMeterNumber: 'STM004',
    storageTankName: 'Storage Tank 4',
    meterType: 'Digital',
    system: 'Kweiman-Danfa',
    staffName: 'Rapheal Kwabena Aboagye',
    readingDate: '12 Aug 2025',
    serverDate: '12 Aug 2025',
    reading: 78900,
    fieldReading: 78900,
    picture: true
  }
];

export const customerMeterReadingsData = [
  {
    id: 13686,
    customerNumber: '0525-07-00837',
    customerName: 'RITA KOJO .',
    customerPhone: '0244630552',
    customerType: 'Domestic',
    meterNumber: 'O4968',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 4:55 PM',
    reading: 162,
    fieldReading: 162,
    picture: true,
    gps: true
  },
  {
    id: 13685,
    customerNumber: '0504-07-002061',
    customerName: 'DR. JONATHAN LLOYD WAYNE KPOH .',
    customerPhone: '0548961557',
    customerType: 'Domestic',
    meterNumber: '2201505104',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 4:05 PM',
    reading: 50,
    fieldReading: 50,
    picture: true,
    gps: true
  },
  {
    id: 13684,
    customerNumber: '0504-07-001758',
    customerName: 'OFOSUHENE MAAKAMAY .',
    customerPhone: '0541487935',
    customerType: 'Non-Residential',
    meterNumber: '2201513722',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 4:00 PM',
    reading: 1050,
    fieldReading: 1050,
    picture: true,
    gps: true
  },
  {
    id: 13683,
    customerNumber: '0504-07-001605',
    customerName: 'HARUNA SAANA SUMAILA .',
    customerPhone: '0207911881',
    customerType: 'Domestic',
    meterNumber: '200508369',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:58 PM',
    reading: 63,
    fieldReading: 63,
    picture: true,
    gps: true
  },
  {
    id: 13682,
    customerNumber: '0525-07-00850',
    customerName: 'ALFRED KRAH .',
    customerPhone: '0249854568',
    customerType: 'Domestic',
    meterNumber: '25169567',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:52 PM',
    reading: 2272,
    fieldReading: 2272,
    picture: true,
    gps: true
  },
  {
    id: 13681,
    customerNumber: '0525-07-00954',
    customerName: 'BEATRICE BOATEMAA .',
    customerPhone: '0248072263',
    customerType: 'Domestic',
    meterNumber: '200307959',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:43 PM',
    reading: 527,
    fieldReading: 527,
    picture: true,
    gps: true
  },
  {
    id: 13680,
    customerNumber: '0525-07-00857',
    customerName: 'MR. & MRS TSATSU .',
    customerPhone: '0242960425',
    customerType: 'Domestic',
    meterNumber: '130806398',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:42 PM',
    reading: 1327,
    fieldReading: 1327,
    picture: true,
    gps: true
  },
  {
    id: 13679,
    customerNumber: '0525-07-00910',
    customerName: 'GABRIEL NIIQUAYE .',
    customerPhone: '0545810564',
    customerType: 'Domestic',
    meterNumber: '1042',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:38 PM',
    reading: 1312,
    fieldReading: 1312,
    picture: true,
    gps: true
  },
  {
    id: 13678,
    customerNumber: '0504-07-001898',
    customerName: 'CAINSPR.BRIGHT ANNOR SACKITEY .',
    customerPhone: '0244746984',
    customerType: 'Domestic',
    meterNumber: '2201508140',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:34 PM',
    reading: 239,
    fieldReading: 239,
    picture: true,
    gps: true
  },
  {
    id: 13677,
    customerNumber: '0525-07-00859',
    customerName: 'MR. MENSAH AFHIN .',
    customerPhone: '0553587665',
    customerType: 'Domestic',
    meterNumber: 'RO14052730',
    zone: 'ZONE 6',
    staffName: 'Lydia Afuyle',
    readingDate: '14 August , 2025',
    serverDate: '14 August , 2025 3:31 PM',
    reading: 1274,
    fieldReading: 1274,
    picture: true,
    gps: true
  }
];

export const staffData = [
  {
    id: 1,
    name: 'Benjamin Bismark Forson',
    phone: '0244989297',
    email: 'kwesiamako1000@gmail.com',
    assignedZones: '10',
    role: 'Management',
    position: 'Water System Manager',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Brantuoh Osei Kwasi Lloyd',
    phone: '0594660845',
    email: 'Lbrantuoh@gmail.com',
    assignedZones: '10',
    role: 'Management',
    position: 'Information Technology Specialist',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 3,
    name: 'BRIGHT OWUSU',
    phone: '0243309465',
    email: 'bowusu@vgsolutionsltd.com',
    assignedZones: '10',
    role: 'Data_Admin',
    position: 'Data Analyst',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 4,
    name: 'CWSA Admin',
    phone: '0245335617',
    email: 'koforl@vgsolutionsltd.com',
    assignedZones: '10',
    role: 'Management,System_Admin',
    position: 'System Admin',
    created: 'Tue, 21 Jan 2025, 04:01:26 am',
    modified: '21 Jan 2025 4:01 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Elizabeth Okine',
    phone: '0244371204',
    email: 'elizabeth.okine@cwsa.gov.gh',
    assignedZones: '10',
    role: 'Management',
    position: 'Chief Accountant',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 6,
    name: 'ERIC ADDO',
    phone: '0246985423',
    email: 'ericaddo159@gmail.com',
    assignedZones: '10',
    role: 'Data_Admin',
    position: 'Data Analyst',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Esinu Tsagbey',
    phone: '0206248797',
    email: 'esinu.tsagbey@cwsa.gov.gh',
    assignedZones: '10',
    role: 'Management',
    position: 'Information Technology Coordinator',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Ezekiel Ahovi',
    phone: '0248658985',
    email: 'ziggykwab@yahoo.com',
    assignedZones: '10',
    role: 'Management',
    position: 'Hydrologist',
    created: 'Thu, 23 Jan 2025, 11:33:58 pm',
    modified: '23 Jan 2025 11:01 PM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Francis Djaba Acquaye',
    phone: '0554431223',
    email: 'djabroneghi@gmail.com',
    assignedZones: '10',
    role: 'Management',
    position: 'Revenue Officer',
    created: 'Thu, 23 Jan 2025, 11:25:06 pm',
    modified: '23 Jan 2025 11:01 PM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  },
  {
    id: 10,
    name: 'Francis Seguri',
    phone: '0246232987',
    email: 'segurifrancis@gmail.com',
    assignedZones: '10',
    role: 'Collector',
    position: 'Revenue Officer',
    created: 'Sun, 01 Dec 2024, 12:00:00 am',
    modified: '01 Dec 2024 12:12 AM',
    modifiedBy: 'CWSA Admin',
    status: 'Active'
  }
];