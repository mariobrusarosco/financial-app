import axios from 'axios';

// Define the base URL for the API. This can be an environment variable.
// For MSW, this might be different or not strictly needed if MSW intercepts all fetches.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'; // Placeholder

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here, e.g., for authorization
  },
});

// Example of how you might use interceptors for request/response logging or error handling
apiClient.interceptors.request.use(
  (config) => {
    // You can modify the request config here, e.g., add an auth token
    // console.log('Starting Request', config);
    return config;
  },
  (error) => {
    // console.error('Request Error', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // console.log('Response:', response);
    return response;
  },
  (error) => {
    // Handle global errors here
    // For example, redirect to login if 401 Unauthorized
    // console.error('Response Error', error.response || error.message);
    return Promise.reject(error);
  }
);
