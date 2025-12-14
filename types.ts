export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MECHANIC = 'MECHANIC',
  ADMIN = 'ADMIN'
}

export enum JobStatus {
  OPEN = 'OPEN',
  ACCEPTED = 'ACCEPTED',
  COMPLETED_PENDING_PAYMENT = 'COMPLETED_PENDING_PAYMENT',
  PAID_AND_CLOSED = 'PAID_AND_CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  // Mechanic specific
  isVerified?: boolean;
  skills?: string[];
  bio?: string;
  abn?: string;
  experienceYears?: number;
}

export interface Job {
  id: string;
  customerId: string;
  mechanicId?: string;
  status: JobStatus;
  category: string;
  description: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleRego?: string; // Optional Rego Number
  location: string;
  createdAt: string;
  priceEstimate?: string; // Optional, negotiated in chat
  finalPrice?: number; // Actual amount paid
  photos?: string[]; // Array of base64 strings or URLs
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Review {
  id: string;
  jobId: string;
  mechanicId: string;
  customerId: string;
  rating: number;
  comment: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'JOB_UPDATE' | 'MESSAGE' | 'SYSTEM';
  relatedJobId?: string;
}