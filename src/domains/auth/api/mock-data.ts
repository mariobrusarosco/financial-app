import type { I_User } from '../types/auth.types';

export const mockUsers: Array<I_User & { password: string }> = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const generateMockTokens = (userId: string) => ({
  accessToken: `mock_access_${userId}_${Date.now()}`,
  refreshToken: `mock_refresh_${userId}_${Date.now()}`,
  expiresIn: 3600,
});

export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));