export type PoleStatus = 'working' | 'fused' | 'daytime_on' | 'no_data';
export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'fixed' | 'rejected';
export type ComplaintType = 'not_working' | 'daytime_on' | 'flickering' | 'broken_pole' | 'wiring' | 'physical_damage';
export type UserRole = 'villager' | 'admin' | 'worker';

export interface Pole {
  id: string;
  poleId: string;
  lat: number;
  lng: number;
  location: string;
  status: PoleStatus;
  installDate: string;
  lastMaintenance: string;
  complaintCount: number;
  wattage: number;
}

export interface Complaint {
  id: string;
  poleId: string;
  poleLocation: string;
  type: ComplaintType;
  description: string;
  status: ComplaintStatus;
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  submittedBy: string;
  imageUri?: string;
  estimatedTime?: string;
}

export interface AnalyticsMonth {
  month: string;
  wastekWh: number;
  savedkWh: number;
  complaints: number;
  resolved: number;
}

export const MOCK_POLES: Pole[] = [
  {
    id: 'p1', poleId: 'GL-001', lat: 15.2993, lng: 74.1240,
    location: 'Near Gram Panchayat Office', status: 'working',
    installDate: '2022-03-15', lastMaintenance: '2024-08-10',
    complaintCount: 2, wattage: 70,
  },
  {
    id: 'p2', poleId: 'GL-002', lat: 15.3001, lng: 74.1255,
    location: 'Main Road Junction', status: 'fused',
    installDate: '2021-11-20', lastMaintenance: '2024-01-05',
    complaintCount: 8, wattage: 70,
  },
  {
    id: 'p3', poleId: 'GL-003', lat: 15.2978, lng: 74.1230,
    location: 'Near Primary School', status: 'daytime_on',
    installDate: '2022-06-01', lastMaintenance: '2024-06-20',
    complaintCount: 5, wattage: 100,
  },
  {
    id: 'p4', poleId: 'GL-004', lat: 15.2985, lng: 74.1270,
    location: 'Market Area', status: 'fused',
    installDate: '2020-09-10', lastMaintenance: '2023-12-15',
    complaintCount: 12, wattage: 150,
  },
  {
    id: 'p5', poleId: 'GL-005', lat: 15.3010, lng: 74.1235,
    location: 'Temple Road', status: 'working',
    installDate: '2023-01-18', lastMaintenance: '2024-09-01',
    complaintCount: 1, wattage: 70,
  },
  {
    id: 'p6', poleId: 'GL-006', lat: 15.2965, lng: 74.1260,
    location: 'Water Tank Area', status: 'no_data',
    installDate: '2019-05-22', lastMaintenance: '2022-08-30',
    complaintCount: 3, wattage: 70,
  },
  {
    id: 'p7', poleId: 'GL-007', lat: 15.2990, lng: 74.1285,
    location: 'Bus Stop', status: 'daytime_on',
    installDate: '2021-07-14', lastMaintenance: '2024-04-12',
    complaintCount: 7, wattage: 100,
  },
  {
    id: 'p8', poleId: 'GL-008', lat: 15.3005, lng: 74.1248,
    location: 'Health Centre Road', status: 'working',
    installDate: '2023-08-05', lastMaintenance: '2024-10-20',
    complaintCount: 0, wattage: 70,
  },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'c1', poleId: 'GL-002', poleLocation: 'Main Road Junction',
    type: 'not_working', description: 'Light not working since 3 days',
    status: 'in_progress', submittedAt: '2024-11-10T09:30:00Z',
    updatedAt: '2024-11-11T14:00:00Z', submittedBy: 'Ramesh Kumar',
    assignedTo: 'Suresh (Worker)', estimatedTime: '2 days',
  },
  {
    id: 'c2', poleId: 'GL-003', poleLocation: 'Near Primary School',
    type: 'daytime_on', description: 'Light stays ON even after 10AM',
    status: 'submitted', submittedAt: '2024-11-12T07:15:00Z',
    updatedAt: '2024-11-12T07:15:00Z', submittedBy: 'Meena Devi',
  },
  {
    id: 'c3', poleId: 'GL-004', poleLocation: 'Market Area',
    type: 'broken_pole', description: 'Pole is leaning dangerously',
    status: 'assigned', submittedAt: '2024-11-08T16:45:00Z',
    updatedAt: '2024-11-09T10:00:00Z', submittedBy: 'Vijay Singh',
    assignedTo: 'Ravi (Worker)', estimatedTime: '5 days',
  },
  {
    id: 'c4', poleId: 'GL-007', poleLocation: 'Bus Stop',
    type: 'daytime_on', description: 'Wasting energy since last week',
    status: 'fixed', submittedAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-05T12:00:00Z', resolvedAt: '2024-11-05T12:00:00Z',
    submittedBy: 'Arun Patil', assignedTo: 'Suresh (Worker)',
  },
  {
    id: 'c5', poleId: 'GL-001', poleLocation: 'Near Gram Panchayat Office',
    type: 'flickering', description: 'Light flickers every night',
    status: 'submitted', submittedAt: '2024-11-13T20:30:00Z',
    updatedAt: '2024-11-13T20:30:00Z', submittedBy: 'Sunita Bai',
  },
  {
    id: 'c6', poleId: 'GL-002', poleLocation: 'Main Road Junction',
    type: 'wiring', description: 'Exposed wires visible near pole base',
    status: 'rejected', submittedAt: '2024-10-28T11:00:00Z',
    updatedAt: '2024-10-30T09:00:00Z', submittedBy: 'Deepak Rao',
  },
];

export const MOCK_ANALYTICS: AnalyticsMonth[] = [
  { month: 'Jun', wastekWh: 480, savedkWh: 120, complaints: 8, resolved: 5 },
  { month: 'Jul', wastekWh: 520, savedkWh: 180, complaints: 11, resolved: 8 },
  { month: 'Aug', wastekWh: 390, savedkWh: 260, complaints: 9, resolved: 7 },
  { month: 'Sep', wastekWh: 310, savedkWh: 340, complaints: 7, resolved: 6 },
  { month: 'Oct', wastekWh: 250, savedkWh: 420, complaints: 5, resolved: 5 },
  { month: 'Nov', wastekWh: 190, savedkWh: 480, complaints: 6, resolved: 3 },
];

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  not_working: 'Not Working at Night',
  daytime_on: 'ON During Daytime',
  flickering: 'Flickering',
  broken_pole: 'Broken Pole',
  wiring: 'Wiring Issue',
  physical_damage: 'Physical Damage',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  fixed: 'Fixed',
  rejected: 'Rejected',
};

export const POLE_STATUS_LABELS: Record<PoleStatus, string> = {
  working: 'Working',
  fused: 'Fused / Off',
  daytime_on: 'ON in Daytime',
  no_data: 'No Data',
};

export function getPoleStatusColor(status: PoleStatus): string {
  switch (status) {
    case 'working': return '#00E676';
    case 'fused': return '#FF3B6F';
    case 'daytime_on': return '#FFB800';
    case 'no_data': return '#8899BB';
  }
}

export function getComplaintStatusColor(status: ComplaintStatus): string {
  switch (status) {
    case 'submitted': return '#00B4D8';
    case 'assigned': return '#9B59B6';
    case 'in_progress': return '#FFB800';
    case 'fixed': return '#00E676';
    case 'rejected': return '#FF3B6F';
  }
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
