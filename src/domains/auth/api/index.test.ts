import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/domains/testing/msw/server';
import { AuthStorage } from '@/domains/auth/utils/auth-storage';
import { authApi } from './index';

const TEST_EMAIL = 'mario@example.com';

describe('authApi.getCurrentUser', () => {
  beforeEach(() => {
    AuthStorage.setTokens({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 3600,
    });
  });

  afterEach(() => {
    AuthStorage.clearAuth();
  });

  it('normalizes the API user response for frontend consumers', async () => {
    server.use(
      http.get('*/auth/me', () =>
        HttpResponse.json({
          id: 'user-1',
          email: TEST_EMAIL,
          full_name: 'Mario Brusarosco',
          is_active: true,
        })
      )
    );

    await expect(authApi.getCurrentUser()).resolves.toEqual({
      id: 'user-1',
      email: TEST_EMAIL,
      name: 'Mario Brusarosco',
      createdAt: '',
      updatedAt: '',
    });
  });

  it('uses a stable display name when the optional full name is absent', async () => {
    server.use(
      http.get('*/auth/me', () =>
        HttpResponse.json({
          id: 'user-2',
          email: TEST_EMAIL,
          full_name: null,
          is_active: true,
        })
      )
    );

    await expect(authApi.getCurrentUser()).resolves.toMatchObject({
      name: 'mario',
    });
  });
});
