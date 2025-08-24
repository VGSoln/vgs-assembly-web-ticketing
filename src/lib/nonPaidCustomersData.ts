export interface NonPaidCustomerData {
  id: string;
  customerNumber: string;
  customerName: string;
  phone: string;
  meterNumber: string;
  customerType: string;
  zone: string;
  unpaidBills: number;
  totalAmountOwed: string;
  createdDate: string;
  gps?: boolean;
  photo?: boolean;
}

export const nonPaidCustomersData: NonPaidCustomerData[] = [
  {
    id: '0504-07-001671',
    customerNumber: '0504-07-001671',
    customerName: 'ABDALLAH MOHAMMED SAANI',
    phone: '0243114560',
    meterNumber: '200508606-A',
    customerType: 'Domestic',
    zone: 'ZONE 8',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 337.34',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: true
  },
  {
    id: '0504-07-001733',
    customerNumber: '0504-07-001733',
    customerName: 'ABDUL HAMMED MUMIN AKANDE',
    phone: '0553467420',
    meterNumber: '2201508737',
    customerType: 'Domestic',
    zone: 'ZONE 2',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 388.65',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: false
  },
  {
    id: '0504-07-001966',
    customerNumber: '0504-07-001966',
    customerName: 'ABDUL KARIM IDRIS 1',
    phone: '0532612960',
    meterNumber: '2201509287',
    customerType: 'Domestic',
    zone: 'ZONE 3',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 674.08',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: false,
    photo: true
  },
  {
    id: '0504-07-001965',
    customerNumber: '0504-07-001965',
    customerName: 'ABDUL KARIM IDRIS 2',
    phone: '111111111111',
    meterNumber: '2201504956',
    customerType: 'Domestic',
    zone: 'ZONE 3',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 93.80',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: true
  },
  {
    id: '0504-07-001964',
    customerNumber: '0504-07-001964',
    customerName: 'ABDUL KARIM IDRIS 3',
    phone: '11111111111',
    meterNumber: '2201504958',
    customerType: 'Domestic',
    zone: 'ZONE 3',
    unpaidBills: 9,
    totalAmountOwed: 'GHS -75.88',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: false,
    photo: false
  },
  {
    id: '0504-07-001958',
    customerNumber: '0504-07-001958',
    customerName: 'ABDUL KARIM IDRIS 4',
    phone: '0558682403',
    meterNumber: '2201509391',
    customerType: 'Domestic',
    zone: 'ZONE 3',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 201.44',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: false
  },
  {
    id: '0504-07-001576',
    customerNumber: '0504-07-001576',
    customerName: 'ABDUL SALAM ALHASSAN',
    phone: '0244465447',
    meterNumber: '200506628',
    customerType: 'Domestic',
    zone: 'ZONE 6',
    unpaidBills: 9,
    totalAmountOwed: 'GHS -37.67',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: true
  },
  {
    id: '0504-07-001637',
    customerNumber: '0504-07-001637',
    customerName: 'ABDUL SEIDU FATAWU',
    phone: '0243258012',
    meterNumber: '200511075',
    customerType: 'Domestic',
    zone: 'ZONE 3',
    unpaidBills: 9,
    totalAmountOwed: 'GHS 192.90',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: false,
    photo: true
  },
  {
    id: '0525-07-01371',
    customerNumber: '0525-07-01371',
    customerName: 'ABDUL- HALIK AWUDU',
    phone: '0243283212',
    meterNumber: '200307960',
    customerType: 'Domestic',
    zone: 'ZONE 2',
    unpaidBills: 9,
    totalAmountOwed: 'GHS -271.19',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: false
  },
  {
    id: '0525-07-00109',
    customerNumber: '0525-07-00109',
    customerName: 'ABENA DUNCAN',
    phone: '0244683681',
    meterNumber: '200308276',
    customerType: 'Domestic',
    zone: 'ZONE 5',
    unpaidBills: 9,
    totalAmountOwed: 'GHS -173.86',
    createdDate: 'Fri, 01 Nov 2024, 12:00:00 am',
    gps: true,
    photo: true
  }
];