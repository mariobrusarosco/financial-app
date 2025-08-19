import { AuthStorage } from './auth-storage';

export class TokenManager {
  private static tokenExpiryTimeout: NodeJS.Timeout | null = null;

  static isTokenExpired(expiresIn: number, issuedAt: number = Date.now()): boolean {
    const expiryTime = issuedAt + expiresIn * 1000;
    return Date.now() >= expiryTime;
  }

  static getTokenPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  static scheduleTokenRefresh(expiresIn: number, onRefresh: () => void): void {
    this.clearTokenRefreshTimer();
    
    const refreshTime = (expiresIn - 60) * 1000;
    
    if (refreshTime > 0) {
      this.tokenExpiryTimeout = setTimeout(() => {
        onRefresh();
      }, refreshTime);
    }
  }

  static clearTokenRefreshTimer(): void {
    if (this.tokenExpiryTimeout) {
      clearTimeout(this.tokenExpiryTimeout);
      this.tokenExpiryTimeout = null;
    }
  }

  static validateToken(token: string | null): boolean {
    if (!token) return false;
    
    // Handle mock tokens for development
    if (token.startsWith('mock_')) {
      return true;
    }
    
    // Validate JWT structure
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      const payload = this.getTokenPayload(token);
      if (!payload) return false;
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  static hasValidToken(): boolean {
    const accessToken = AuthStorage.getAccessToken();
    return this.validateToken(accessToken);
  }

  static getTokenExpiryTime(token: string): number | null {
    try {
      const payload = this.getTokenPayload(token);
      return payload?.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  static getTimeUntilExpiry(token: string): number {
    const expiryTime = this.getTokenExpiryTime(token);
    if (!expiryTime) return 0;
    return Math.max(0, expiryTime - Date.now());
  }

  static shouldRefreshToken(token: string, refreshThresholdMinutes = 5): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    const refreshThreshold = refreshThresholdMinutes * 60 * 1000; // Convert to milliseconds
    return timeUntilExpiry > 0 && timeUntilExpiry <= refreshThreshold;
  }

  static setupAutoRefresh(onRefresh: () => Promise<void>): void {
    const accessToken = AuthStorage.getAccessToken();
    if (!accessToken || !this.validateToken(accessToken)) return;

    // Clear any existing timer
    this.clearTokenRefreshTimer();

    const timeUntilExpiry = this.getTimeUntilExpiry(accessToken);
    if (timeUntilExpiry <= 0) return;

    // Schedule refresh 5 minutes before expiry
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);

    this.tokenExpiryTimeout = setTimeout(async () => {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Auto refresh failed:', error);
      }
    }, refreshTime);
  }
}