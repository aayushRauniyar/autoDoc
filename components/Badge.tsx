import React from 'react';
import { JobStatus } from '../types';

interface BadgeProps {
  status: JobStatus | 'VERIFIED' | 'UNVERIFIED';
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  // Mapping statuses to new palette
  const styles: Record<string, string> = {
    [JobStatus.OPEN]: "bg-blue-100 text-primary border border-blue-200",
    [JobStatus.ACCEPTED]: "bg-secondary-light text-secondary border border-secondary/20", // Auto Green
    [JobStatus.COMPLETED_PENDING_PAYMENT]: "bg-accent-light text-yellow-800 border border-accent/20", // Warm Amber
    [JobStatus.PAID_AND_CLOSED]: "bg-gray-100 text-gray-600 border border-gray-200",
    [JobStatus.CANCELLED]: "bg-red-50 text-red-700 border border-red-100",
    'VERIFIED': "bg-secondary text-white", // Solid Green for verified badge
    'UNVERIFIED': "bg-gray-200 text-gray-600"
  };

  const labels: Record<string, string> = {
    [JobStatus.OPEN]: "Open",
    [JobStatus.ACCEPTED]: "In Progress",
    [JobStatus.COMPLETED_PENDING_PAYMENT]: "Payment Due",
    [JobStatus.PAID_AND_CLOSED]: "Closed",
    [JobStatus.CANCELLED]: "Cancelled",
    'VERIFIED': "Verified",
    'UNVERIFIED': "Unverified"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {labels[status] || status}
    </span>
  );
};