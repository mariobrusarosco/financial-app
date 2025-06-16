import axios from 'axios';
import { ApiError, NetworkError } from '@/domains/global/utils/error-handler';

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

// Example of how you might use interceptors for request/response logging or error handling
apiClient.interceptors.request.use(
  config => {
    // You can modify the request config here, e.g., add an auth token
    // console.log('Starting Request', config);
    return config;
  },
  error => {
    // console.error('Request Error', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    // console.log('Response:', response);
    return response;
  },
  error => {
    // 🚨 Transform axios errors into our custom error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || error.message || 'An error occurred';

      throw new ApiError(message, status, data?.code, data);
    } else if (error.request) {
      // Network error - request was made but no response received
      throw new NetworkError('Network connection failed. Please check your internet connection.');
    } else {
      // Something else happened
      throw new ApiError(error.message || 'An unexpected error occurred', 0);
    }
  }
);
