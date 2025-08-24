export interface YearlyWaterConnectionData {
  id: string;
  transId: string;
  customerName: string;
  customerNumber: string;
  phone: string;
  amount: number;
  staff: string;
  type: string;
  zone: string;
  customerType: string;
  meterNumber: string;
  dateTime: string;
  created: string;
  gps?: boolean;
  photo?: boolean;
}

export const yearlyWaterConnectionsData: YearlyWaterConnectionData[] = [
  {
    id: 'R-000001',
    transId: 'R-000001',
    customerName: 'VGS CUSTOMER',
    customerNumber: '0504-07-001234',
    phone: '0243309465',
    amount: 250,
    staff: 'BRIGHT OWUSU',
    type: 'ACH',
    zone: 'ZONE 1',
    customerType: 'D',
    meterNumber: '2201513583',
    dateTime: '06/02/2025 9:39:36 AM',
    created: 'Mon, 02 Jun 2025, 09:39:36 am',
    gps: true,
    photo: true
  },
  {
    id: 'R-000005',
    transId: 'R-000005',
    customerName: 'Sarah .K. Quartey Stand Pipe 3',
    customerNumber: '0525-07-00795',
    phone: '2026599200',
    amount: 150,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'ZONE 9',
    customerType: 'S',
    meterNumber: '160300375',
    dateTime: '05/04/2025 8:54:27 PM',
    created: 'Sun, 04 May 2025, 08:54:27 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000015',
    transId: 'R-000015',
    customerName: 'Rebecca Doe Stand Pipe 15',
    customerNumber: '0525-07-00682',
    phone: '577429105',
    amount: 175,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: 'H.03122463',
    dateTime: '05/04/2025 9:22:51 PM',
    created: 'Sun, 04 May 2025, 09:22:51 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000011',
    transId: 'R-000011',
    customerName: 'Philomena Abam Sowah Stand Pipe 11',
    customerNumber: '0525-07-00685',
    phone: '1111111111',
    amount: 200,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: 'M.4852',
    dateTime: '05/04/2025 9:14:17 PM',
    created: 'Sun, 04 May 2025, 09:14:17 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000010',
    transId: 'R-000010',
    customerName: 'Muwusi Avedzo Stand Pipe 10',
    customerNumber: '0525-07-01203',
    phone: '0543120399',
    amount: 180,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: '200309827',
    dateTime: '05/04/2025 9:12:43 PM',
    created: 'Sun, 04 May 2025, 09:12:43 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000017',
    transId: 'R-000017',
    customerName: 'Mawusi Avedzo Poly Tank',
    customerNumber: '0504-07-001860',
    phone: '0543120399',
    amount: 225,
    staff: 'BRIGHT OWUSU',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: '2201508224',
    dateTime: '05/05/2025 12:06:44 PM',
    created: 'Mon, 05 May 2025, 12:06:44 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000013',
    transId: 'R-000013',
    customerName: 'Lydia Okai Okailey Stand Pipe 13',
    customerNumber: '0504-07-001551',
    phone: '542726290',
    amount: 195,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: '200506624',
    dateTime: '05/04/2025 9:20:03 PM',
    created: 'Sun, 04 May 2025, 09:20:03 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000006',
    transId: 'R-000006',
    customerName: 'Juliana Layea Stand Pipe 4',
    customerNumber: '0525-07-00033',
    phone: '205502545',
    amount: 160,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: '29157734',
    dateTime: '05/04/2025 8:58:50 PM',
    created: 'Sun, 04 May 2025, 08:58:50 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000012',
    transId: 'R-000012',
    customerName: 'Joshua Armah Stand Pipe 12',
    customerNumber: '0525-07-00234',
    phone: '244632222',
    amount: 210,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'Stand Pipes',
    customerType: 'S',
    meterNumber: '180605432',
    dateTime: '05/04/2025 9:17:52 PM',
    created: 'Sun, 04 May 2025, 09:17:52 pm',
    gps: true,
    photo: true
  },
  {
    id: 'R-000004',
    transId: 'R-000004',
    customerName: 'Helen Afutu Kai Stand Pipe 2',
    customerNumber: '0504-07-001234',
    phone: '262896531',
    amount: 185,
    staff: 'CWSA Admin',
    type: 'ACH',
    zone: 'ZONE 9',
    customerType: 'S',
    meterNumber: '2201509876',
    dateTime: '05/04/2025 8:52:15 PM',
    created: 'Sun, 04 May 2025, 08:52:15 pm',
    gps: true,
    photo: true
  }
];