import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return formatDate(d);
  }
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  if (diffMins > 0) {
    return `${diffMins}m ago`;
  }
  return 'Just now';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

export function getRiskColor(level: string): string {
  switch (level.toUpperCase()) {
    case 'CRITICAL':
      return 'text-red-600 bg-red-100';
    case 'HIGH':
      return 'text-orange-600 bg-orange-100';
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100';
    case 'LOW':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'text-green-600 bg-green-100';
    case 'REJECTED':
    case 'REVOKED':
      return 'text-red-600 bg-red-100';
    case 'PENDING':
    case 'PENDING_REVIEW':
      return 'text-yellow-600 bg-yellow-100';
    case 'DRAFT':
      return 'text-gray-600 bg-gray-100';
    case 'DEPRECATED':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return crypto.randomUUID();
}
