import { Job, JobStatus, User, UserRole, Notification } from './types';

export const JOB_CATEGORIES = [
  "Emergency Breakdown",
  "General Repair",
  "Logbook Servicing",
  "Diagnostics",
  "Battery Replacement",
  "Pre-purchase Inspection"
];

export const MECHANIC_SKILLS = [
  "General Repair",
  "Logbook Servicing",
  "Diagnostics",
  "Diesel Engines",
  "Brakes & Clutch",
  "Auto Electrical",
  "Air Conditioning",
  "Tyres & Wheels",
  "Suspension",
  "Transmission"
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: UserRole.CUSTOMER,
    phone: '0400 123 456'
  },
  {
    id: 'u2',
    name: 'Mike "The Wrench" O\'Connor',
    email: 'mike@mechanic.com',
    role: UserRole.MECHANIC,
    isVerified: true,
    skills: ['Diesel Engines', 'Toyota Specialist', 'Emergency Starts'],
    bio: 'Mobile mechanic with 15 years experience. Servicing North Adelaide.',
    phone: '0411 222 333'
  },
  {
    id: 'u3',
    name: 'Admin Alice',
    email: 'admin@autodoc.com',
    role: UserRole.ADMIN
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    customerId: 'u1',
    status: JobStatus.OPEN,
    category: 'Emergency Breakdown',
    description: 'Car wont start, clicking noise. Need help ASAP.',
    vehicleMake: 'Mazda',
    vehicleModel: '3',
    vehicleYear: '2015',
    vehicleRego: 'S123-ABC',
    location: 'Glenelg, SA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    photos: ["https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=300&h=300"]
  },
  {
    id: 'j2',
    customerId: 'u1',
    mechanicId: 'u2',
    status: JobStatus.ACCEPTED,
    category: 'Logbook Servicing',
    description: '60,000km service needed.',
    vehicleMake: 'Toyota',
    vehicleModel: 'Hilux',
    vehicleYear: '2018',
    vehicleRego: 'WORK-UTE',
    location: 'North Adelaide, SA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  // --- Historical Completed Jobs for Analytics ---
  {
    id: 'j3',
    customerId: 'u1',
    mechanicId: 'u2',
    status: JobStatus.PAID_AND_CLOSED,
    category: 'Battery Replacement',
    description: 'Battery dead, need replacement.',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: '2012',
    location: 'Prospect, SA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    finalPrice: 180
  },
  {
    id: 'j4',
    customerId: 'u1',
    mechanicId: 'u2',
    status: JobStatus.PAID_AND_CLOSED,
    category: 'General Repair',
    description: 'Brake pads replacement.',
    vehicleMake: 'Ford',
    vehicleModel: 'Ranger',
    vehicleYear: '2019',
    location: 'Mawson Lakes, SA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    finalPrice: 350
  },
  {
    id: 'j5',
    customerId: 'u1',
    mechanicId: 'u2',
    status: JobStatus.PAID_AND_CLOSED,
    category: 'Diagnostics',
    description: 'Check engine light is on.',
    vehicleMake: 'Hyundai',
    vehicleModel: 'i30',
    vehicleYear: '2016',
    location: 'North Adelaide, SA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(), // 40 days ago
    finalPrice: 120
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Job Accepted',
    message: 'Mike "The Wrench" O\'Connor accepted your Logbook Servicing request.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false,
    type: 'JOB_UPDATE',
    relatedJobId: 'j2'
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'New Message',
    message: 'Mike: I can be there in 20 mins.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    type: 'MESSAGE',
    relatedJobId: 'j2'
  },
  {
    id: 'n3',
    userId: 'u2',
    title: 'New Job Alert',
    message: 'Emergency Breakdown reported near Glenelg matching your skills.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    read: true,
    type: 'JOB_UPDATE',
    relatedJobId: 'j1'
  },
  {
    id: 'n4',
    userId: 'u2',
    title: 'Profile Verified',
    message: 'Your mechanic profile has been verified by Admin.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
    type: 'SYSTEM'
  }
];