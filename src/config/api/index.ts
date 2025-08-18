import axios from 'axios';
import { ApiError, NetworkError } from '@/domains/global/utils/error-handler';
import { AuthStorage } from '@/domains/auth/utils/auth-storage';

// Define the base URL for the API. This can be an environment variable.
// For MSW, this might be different or not strictly needed if MSW intercepts all fetches.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; // Placeholder

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here, e.g., for authorization
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const accessToken = AuthStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized - user needs to login again
    if (typeof error === 'object' && error !== null && 'response' in error && error.response) {
      const { status } = error.response as { status: number };
      if (status === 401) {
        AuthStorage.clearAuth();
        // Redirect to login will be handled by auth guard
        window.location.href = '/login';
        return Promise.reject(new ApiError('Authentication expired. Please login again.', 401));
      }
    }
    
    // Transform axios errors into our custom error types
    if (typeof error === 'object' && error !== null) {
      if ('response' in error && error.response) {
        // Server responded with error status
        const { status, data } = error.response as { status: number; data?: any };
        const message = data?.message || data?.error || error.message || 'An error occurred';
        throw new ApiError(message, status, data?.code, data);
      } else if ('request' in error && error.request) {
        // Network error - request was made but no response received
        throw new NetworkError('Network connection failed. Please check your internet connection.');
      } else if ('message' in error) {
        throw new ApiError(
          (error as { message?: string }).message || 'An unexpected error occurred',
          0
        );
      }
    }
    throw new ApiError('An unexpected error occurred', 0);
  }
);
