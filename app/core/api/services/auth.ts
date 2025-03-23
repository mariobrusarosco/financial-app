import { apiClient } from '../client';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

/**
 * Service for authentication and user management operations
 */
export const authService = {
  /**
   * Log in a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout', {});
  },

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    return apiClient.put<User>('/auth/profile', data);
  },

  /**
   * Update the current user's password
   */
  async updatePassword(data: PasswordUpdateData): Promise<void> {
    return apiClient.put<void>('/auth/password', data);
  },

  /**
   * Request a password reset for a user
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    return apiClient.post<void>('/auth/password-reset/request', data);
  },

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    return apiClient.post<void>(`/auth/verify-email/${token}`, {});
  }
}; 