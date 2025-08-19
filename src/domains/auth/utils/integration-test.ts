/**
 * Integration test helper for authentication
 * Use this to test your backend integration
 */

import { authApi } from '../api';
import { AuthStorage } from './auth-storage';
import { TokenManager } from './token-manager';

export const testAuthIntegration = async () => {
  console.group('🔧 Auth Integration Test');
  
  const testEmail = 'test@example.com';
  const testPassword = 'test123456';
  const testName = 'Test User';

  try {
    // Test 1: Health check
    console.log('1. Testing API connectivity...');
    const isSessionValid = await authApi.validateSession();
    console.log('✅ API connection:', isSessionValid ? 'Valid session' : 'No active session');

    // Test 2: Login (or signup if user doesn't exist)
    console.log('2. Testing login...');
    try {
      const loginResult = await authApi.login({
        email: testEmail,
        password: testPassword,
      });
      console.log('✅ Login successful:', loginResult.user.email);
      console.log('✅ Tokens received:', {
        accessToken: loginResult.tokens.accessToken.substring(0, 20) + '...',
        refreshToken: loginResult.tokens.refreshToken.substring(0, 20) + '...',
        expiresIn: loginResult.tokens.expiresIn,
      });
    } catch (loginError) {
      console.log('ℹ️ Login failed, trying signup...');
      
      const signupResult = await authApi.signup({
        name: testName,
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        acceptTerms: true,
      });
      console.log('✅ Signup successful:', signupResult.user.email);
    }

    // Test 3: Get current user
    console.log('3. Testing get current user...');
    const currentUser = await authApi.getCurrentUser();
    console.log('✅ Current user:', currentUser?.email || 'None');

    // Test 4: Token validation
    console.log('4. Testing token validation...');
    const accessToken = AuthStorage.getAccessToken();
    if (accessToken) {
      const isValidToken = TokenManager.validateToken(accessToken);
      const timeUntilExpiry = TokenManager.getTimeUntilExpiry(accessToken);
      console.log('✅ Token valid:', isValidToken);
      console.log('✅ Time until expiry:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
    }

    // Test 5: Refresh token (if applicable)
    const refreshToken = AuthStorage.getRefreshToken();
    if (refreshToken) {
      console.log('5. Testing token refresh...');
      try {
        const newTokens = await authApi.refreshToken({ refreshToken });
        console.log('✅ Token refresh successful');
        console.log('✅ New access token:', newTokens.accessToken.substring(0, 20) + '...');
      } catch (refreshError) {
        console.log('⚠️ Token refresh failed:', refreshError);
      }
    }

    // Test 6: Logout
    console.log('6. Testing logout...');
    await authApi.logout();
    console.log('✅ Logout successful');

    console.log('🎉 All authentication tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    console.error('💡 Check:');
    console.error('  - Backend is running on configured URL');
    console.error('  - CORS is properly configured');
    console.error('  - Endpoints match expected format');
    console.error('  - JWT tokens are properly formatted');
  }
  
  console.groupEnd();
};

// Utility to test specific functionality
export const testSpecificFeature = {
  async validateTokenStructure() {
    const token = AuthStorage.getAccessToken();
    if (!token) {
      console.log('❌ No token found');
      return;
    }

    console.log('🔍 Token Analysis:');
    console.log('  Structure valid:', TokenManager.validateToken(token));
    
    try {
      const payload = TokenManager.getTokenPayload(token);
      console.log('  Payload:', payload);
      console.log('  Expires at:', new Date((payload?.exp || 0) * 1000));
      console.log('  Issued at:', new Date((payload?.iat || 0) * 1000));
    } catch (error) {
      console.log('  Payload parse error:', error);
    }
  },

  async testAutoRefresh() {
    console.log('🔄 Testing auto-refresh setup...');
    TokenManager.setupAutoRefresh(async () => {
      console.log('🔄 Auto-refresh triggered!');
      const refreshToken = AuthStorage.getRefreshToken();
      if (refreshToken) {
        const newTokens = await authApi.refreshToken({ refreshToken });
        console.log('✅ Auto-refresh completed');
        return newTokens;
      }
    });
    console.log('✅ Auto-refresh scheduled');
  },
};

// Run integration test in development mode
if (import.meta.env.DEV) {
  // Expose to window for manual testing in console
  (window as any).authTest = {
    run: testAuthIntegration,
    specific: testSpecificFeature,
  };
  
  console.log('🧪 Auth integration test available:');
  console.log('  - Run: authTest.run()');
  console.log('  - Token analysis: authTest.specific.validateTokenStructure()');
  console.log('  - Auto-refresh test: authTest.specific.testAutoRefresh()');
}