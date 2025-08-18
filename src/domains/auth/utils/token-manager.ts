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
    
    if (token.startsWith('mock_')) {
      return true;
    }
    
    const parts = token.split('.');
    return parts.length === 3;
  }

  static hasValidToken(): boolean {
    const accessToken = AuthStorage.getAccessToken();
    return this.validateToken(accessToken);
  }
}