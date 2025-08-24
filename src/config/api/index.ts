import axios from 'axios';
import { ApiError, NetworkError } from '@/domains/global/utils/error-handler';
import { AuthStorage } from '@/domains/auth/utils/auth-storage';
import { TokenManager } from '@/domains/auth/utils/token-manager';

// Define the base URL for the API. This can be an environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = AuthStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;

    AuthStorage.setTokens(
      {
        accessToken: access_token,
        refreshToken: newRefreshToken || refreshToken,
        expiresIn: expires_in,
      },
      AuthStorage.isRememberMe()
    );

    return access_token;
  } catch (error) {
    AuthStorage.clearAuth();
    throw error;
  }
};

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
  async error => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized with token refresh
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        processQueue(null, newToken);

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        AuthStorage.clearAuth();
        window.location.href = '/login';
        return Promise.reject(new ApiError('Session expired. Please login again.', 401));
      } finally {
        isRefreshing = false;
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
