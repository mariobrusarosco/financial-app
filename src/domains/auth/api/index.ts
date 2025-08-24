import { apiClient } from '@/config/api';
import type {
  I_LoginRequest,
  I_SignupRequest,
  I_AuthResponse,
  I_RefreshTokenRequest,
  I_AuthTokens,
  I_User,
} from '../types/auth.types';
import { AuthStorage } from '../utils/auth-storage';

const login = async (credentials: I_LoginRequest): Promise<I_AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      device_name: navigator.userAgent || 'Unknown Device',
    });

    // Backend returns: { access_token, refresh_token, expires_in }
    const { access_token, refresh_token, expires_in } = response.data;

    // Store tokens temporarily to make authenticated request
    const tokens = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    };

    // Get user data with the new token
    const userResponse = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
      user: userResponse.data,
      tokens,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const signup = async (data: I_SignupRequest): Promise<I_AuthResponse> => {
  try {
    const response = await apiClient.post('/users', {
      full_name: data.name,
      email: data.email,
      password: data.password,
      is_active: true,
    });

    // Backend returns: { access_token, refresh_token, expires_in, user }
    const { access_token, refresh_token, expires_in, user } = response.data;

    return {
      user,
      tokens: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      },
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

const refreshToken = async (data: I_RefreshTokenRequest): Promise<I_AuthTokens> => {
  try {
    const response = await apiClient.post<I_AuthTokens>('/auth/refresh', {
      refresh_token: data.refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    const refreshToken = AuthStorage.getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    AuthStorage.clearAuth();
  }
};

const getCurrentUser = async (): Promise<I_User | null> => {
  try {
    const accessToken = AuthStorage.getAccessToken();
    if (!accessToken) {
      return null;
    }

    const response = await apiClient.get<I_User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

const validateSession = async (): Promise<boolean> => {
  try {
    const accessToken = AuthStorage.getAccessToken();
    if (!accessToken) {
      return false;
    }

    const response = await apiClient.get('/auth/sessions');
    return response.status === 200;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

export const authApi = {
  login,
  signup,
  refreshToken,
  logout,
  getCurrentUser,
  validateSession,
};
