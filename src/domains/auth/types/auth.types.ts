export interface I_User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface I_LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface I_SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface I_AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface I_AuthResponse {
  user: I_User;
  tokens: I_AuthTokens;
}

export interface I_RefreshTokenRequest {
  refreshToken: string;
}

export interface I_AuthState {
  user: I_User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface I_AuthError {
  message: string;
  code?: string;
  field?: string;
}