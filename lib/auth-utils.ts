import { signOut } from 'next-auth/react';
import { clearAuthData } from '../app/utils/auth';

/**
 * Handles 401 unauthorized responses by redirecting to the unauthorized page
 */
export const handleUnauthorized = () => {
  // Clear session_id cookie and other auth data
  if (typeof document !== 'undefined') {
    clearAuthData();
  }

  // Sign out from NextAuth
  signOut({ 
    callbackUrl: '/unauthorized',
    redirect: true 
  });
};

/**
 * Enhanced fetch function that automatically handles 401 responses
 */
export const authFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized - redirecting to login');
  }

  return response;
};

/**
 * Enhanced fetch function that returns JSON and handles 401 responses
 */
export const authFetchJson = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  const response = await authFetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Check if a response is a 401 unauthorized response
 */
export const isUnauthorizedResponse = (response: Response): boolean => {
  return response.status === 401;
};

/**
 * Clear all cookies and session data
 */
export const clearAllSessionData = () => {
  if (typeof document !== 'undefined') {
    // Clear session_id cookie and other auth data
    clearAuthData();
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
  }
}; 