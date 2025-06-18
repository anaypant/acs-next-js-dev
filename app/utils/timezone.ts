/**
 * Timezone utility functions for consistent local timezone handling
 */

/**
 * Formats a timestamp to display in the user's local timezone
 * @param timestamp - ISO timestamp string
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string in local timezone
 */
export function formatLocalTime(
  timestamp: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, options);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
}

/**
 * Formats a timestamp to show relative time (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp string
 * @returns Relative time string
 */
export function getTimeAgo(timestamp: string): string {
  if (!timestamp) return '';
  
  try {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    // For older dates, show the actual date in local timezone
    return messageDate.toLocaleDateString();
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return '';
  }
}

/**
 * Formats a timestamp to show only the date in local timezone
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string
 */
export function formatLocalDate(timestamp: string): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Formats a timestamp to show only the time in local timezone
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
export function formatLocalTimeOnly(timestamp: string): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
}

/**
 * Gets the user's timezone offset in minutes
 * @returns Timezone offset in minutes
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset();
}

/**
 * Checks if a timestamp is valid
 * @param timestamp - ISO timestamp string
 * @returns boolean indicating if timestamp is valid
 */
export function isValidTimestamp(timestamp: string): boolean {
  if (!timestamp) return false;
  
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
} 