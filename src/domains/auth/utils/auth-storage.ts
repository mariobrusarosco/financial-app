import type { I_User, I_AuthTokens } from '../types/auth.types';

const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
} as const;

export class AuthStorage {
  static setTokens(tokens: I_AuthTokens, rememberMe = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, 'true');
    }
  }

  static getAccessToken(): string | null {
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    );
  }

  static getRefreshToken(): string | null {
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    );
  }

  static setUser(user: I_User): void {
    const rememberMe = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): I_User | null {
    const userString =
      localStorage.getItem(AUTH_STORAGE_KEYS.USER) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
    
    if (!userString) return null;
    
    try {
      return JSON.parse(userString) as I_User;
    } catch {
      return null;
    }
  }

  static clearAuth(): void {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  static isRememberMe(): boolean {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
  }
}