/**
 * API Configuration
 * Contains API base URL, headers, and other configuration for API requests
 */

// Get the API base URL from environment variables or use the default
export const API_BASE_URL = 
  // @ts-ignore - Vite injects the import.meta.env at build time
  import.meta.env?.VITE_API_BASE_URL || 
  // Fallback for non-Vite environments
  process.env.VITE_API_BASE_URL || 
  'https://api.bettercallbuffet.com';

// API keys
export const OPENAI_API_KEY = 
  // @ts-ignore - Vite injects the import.meta.env at build time
  import.meta.env?.VITE_OPENAI_API_KEY || 
  // Fallback for non-Vite environments
  process.env.VITE_OPENAI_API_KEY;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};


export const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Configuration for API request caching
 */
export const CACHE_CONFIG = {
  // Default stale time for cached data (5 minutes)
  defaultStaleTime: 5 * 60 * 1000,
  
  // Default cache time for cached data (1 hour)
  defaultCacheTime: 60 * 60 * 1000,
  
  // Resources that should never be cached
  noCacheResources: ['/auth/login', '/auth/logout', '/auth/register'],
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
}; 