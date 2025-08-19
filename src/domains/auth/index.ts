// Auth domain exports
export { useAuth } from './hooks/use-auth';
export { useLogin } from './hooks/use-login';
export { useSignup } from './hooks/use-signup';
export { useLogout } from './hooks/use-logout';

export { AuthGuard } from './components/auth-guard';
export { LoginForm } from './components/login-form';
export { SignupForm } from './components/signup-form';

export { authApi } from './api';
export { AuthStorage } from './utils/auth-storage';
export { TokenManager } from './utils/token-manager';

export type {
  I_User,
  I_LoginRequest,
  I_SignupRequest,
  I_AuthResponse,
  I_AuthTokens,
  I_AuthState,
} from './types/auth.types';

// Development utilities
if (import.meta.env.DEV) {
  import('./utils/integration-test');
}