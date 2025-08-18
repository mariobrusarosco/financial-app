import { apiClient } from '@/config/api';
import type {
  I_LoginRequest,
  I_SignupRequest,
  I_AuthResponse,
  I_RefreshTokenRequest,
  I_AuthTokens,
  I_User,
} from '../types/auth.types';
import { mockUsers, generateMockTokens, delay } from './mock-data';
import { AuthStorage } from '../utils/auth-storage';

const login = async (credentials: I_LoginRequest): Promise<I_AuthResponse> => {
  await delay(500);
  
  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const tokens = generateMockTokens(user.id);
  
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    tokens,
  };
};

const signup = async (data: I_SignupRequest): Promise<I_AuthResponse> => {
  await delay(500);
  
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (!data.acceptTerms) {
    throw new Error('You must accept the terms and conditions');
  }
  
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const newUser: I_User = {
    id: String(mockUsers.length + 1),
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockUsers.push({
    ...newUser,
    password: data.password,
  });
  
  const tokens = generateMockTokens(newUser.id);
  
  return {
    user: newUser,
    tokens,
  };
};

const refreshToken = async (data: I_RefreshTokenRequest): Promise<I_AuthTokens> => {
  await delay(300);
  
  if (!data.refreshToken || !data.refreshToken.startsWith('mock_refresh_')) {
    throw new Error('Invalid refresh token');
  }
  
  const parts = data.refreshToken.split('_');
  const userId = parts[2];
  
  if (!userId) {
    throw new Error('Invalid refresh token format');
  }
  
  return generateMockTokens(userId);
};

const logout = async (): Promise<void> => {
  await delay(200);
  AuthStorage.clearAuth();
};

const getCurrentUser = async (): Promise<I_User | null> => {
  await delay(200);
  
  const accessToken = AuthStorage.getAccessToken();
  if (!accessToken) {
    return null;
  }
  
  if (accessToken.startsWith('mock_access_')) {
    const parts = accessToken.split('_');
    const userId = parts[2];
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  
  return null;
};

const validateSession = async (): Promise<boolean> => {
  await delay(100);
  
  const accessToken = AuthStorage.getAccessToken();
  if (!accessToken) {
    return false;
  }
  
  return accessToken.startsWith('mock_access_');
};

export const authApi = {
  login,
  signup,
  refreshToken,
  logout,
  getCurrentUser,
  validateSession,
};