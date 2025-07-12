import { toast } from 'sonner';

// 🎯 API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

export enum ErrorSeverity {
  LOW = 'low', // Minor issues, app still functional
  MEDIUM = 'medium', // Important but not critical
  HIGH = 'high', // Critical errors affecting core functionality
  CRITICAL = 'critical', // Data integrity or security issues
}

interface ErrorContext {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage?: string;
  action?: string;
  retry?: boolean;
}

export function classifyError(error: unknown): ErrorContext {
  // Network errors
  if (
    error instanceof NetworkError ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'NETWORK_ERROR')
  ) {
    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'Connection problem. Please check your internet and try again.',
      action: 'retry',
      retry: true,
    };
  }

  // API errors
  if (error instanceof ApiError) {
    const status = error.status;

    if (status === 401) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        userMessage: 'Your session has expired. Please log in again.',
        action: 'login',
        retry: false,
      };
    }

    if (status === 403) {
      return {
        category: ErrorCategory.AUTHORIZATION,
        severity: ErrorSeverity.HIGH,
        userMessage: "You don't have permission to perform this action.",
        retry: false,
      };
    }

    if (status >= 400 && status < 500) {
      return {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.MEDIUM,
        userMessage: error.message || 'Please check your input and try again.',
        technicalMessage: error.message,
        retry: false,
      };
    }

    if (status >= 500) {
      return {
        category: ErrorCategory.SERVER,
        severity: ErrorSeverity.HIGH,
        userMessage: 'Server error. Our team has been notified. Please try again later.',
        technicalMessage: error.message,
        action: 'retry',
        retry: true,
      };
    }
  }

  // Validation errors
  if (error instanceof ValidationError) {
    return {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      userMessage: error.message,
      retry: false,
    };
  }

  // Default unknown error
  return {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Something went wrong. Please try again.',
    technicalMessage: error instanceof Error ? error.message : String(error),
    action: 'retry',
    retry: true,
  };
}

export function handleErrorWithToast(error: unknown, context?: Partial<ErrorContext>) {
  const errorInfo = { ...classifyError(error), ...context };

  // Choose toast style based on severity
  switch (errorInfo.severity) {
    case ErrorSeverity.LOW:
      toast.info(errorInfo.userMessage);
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(errorInfo.userMessage);
      break;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      toast.error(errorInfo.userMessage, {
        duration: 6000, // Longer duration for critical errors
        action:
          errorInfo.action === 'retry'
            ? {
                label: 'Retry',
                onClick: () => window.location.reload(),
              }
            : undefined,
      });
      break;
  }

  // Log technical details for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      error,
      context: errorInfo,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  return errorInfo;
}

// 🔄 Retry Logic
export function createRetryHandler<T>(fn: () => Promise<T>, maxRetries = 3) {
  return async (): Promise<T> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const errorInfo = classifyError(error);

        if (!errorInfo.retry || attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));

        toast.info(`Retrying... (Attempt ${attempt + 1}/${maxRetries})`);
      }
    }

    throw lastError;
  };
}
