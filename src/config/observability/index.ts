import * as Sentry from '@sentry/react';
import { ApiError, NetworkError, ValidationError } from '@/domains/global/utils/error-handler';

type T_RouterLike = unknown;

type T_ObservabilityContext = Record<string, string | number | boolean | null | undefined>;

interface T_CaptureHandledErrorDetails {
  domain: string;
  operation: string;
  context?: T_ObservabilityContext;
  tags?: Record<string, string>;
  fingerprint?: string[];
  forceCapture?: boolean;
  level?: Sentry.SeverityLevel;
}

const SENSITIVE_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
]);

const SENSITIVE_OBJECT_KEYS = new Set([
  'access_token',
  'auth',
  'authorization',
  'cookie',
  'cookies',
  'email',
  'full_name',
  'name',
  'password',
  'raw_statement',
  'refresh_token',
  'statement',
  'token',
  'transactions',
  'user',
  'username',
]);

const SENSITIVE_PAYLOAD_KEYS = new Set([
  'body',
  'data',
  'formData',
  'payload',
  'requestBody',
  'responseBody',
]);

const REDACTED = '[redacted]';
const DEFAULT_TRACE_SAMPLE_RATE = 0.1;

let isInitialized = false;

const getIsTestMode = () => import.meta.env.MODE === 'test';
const getIsLocalDevelopment = () => import.meta.env.DEV;

const getIsObservabilityEnabled = () => {
  const isExplicitlyDisabled = import.meta.env.VITE_SENTRY_ENABLED === 'false';
  return (
    Boolean(import.meta.env.VITE_SENTRY_DSN) &&
    !isExplicitlyDisabled &&
    !getIsTestMode() &&
    !getIsLocalDevelopment()
  );
};

const stripSearchFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url.split('?')[0] ?? url;
  }
};

const sanitizeHeaders = (headers: Record<string, unknown> | undefined) => {
  if (!headers) {
    return headers;
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => {
      if (SENSITIVE_HEADER_KEYS.has(key.toLowerCase())) {
        return [key, REDACTED];
      }

      return [key, value];
    })
  );
};

const sanitizeValue = (key: string, value: unknown): unknown => {
  const normalizedKey = key.toLowerCase();

  if (SENSITIVE_HEADER_KEYS.has(normalizedKey) || SENSITIVE_OBJECT_KEYS.has(normalizedKey)) {
    return REDACTED;
  }

  if (SENSITIVE_PAYLOAD_KEYS.has(normalizedKey)) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(key, item));
  }

  if (value && typeof value === 'object') {
    return sanitizeRecord(value as Record<string, unknown>);
  }

  return value;
};

const sanitizeRecord = (record: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(record)
      .map(([key, value]) => [key, sanitizeValue(key, value)] as const)
      .filter(([, value]) => value !== undefined)
  );
};

const sanitizeEvent = (event: Sentry.Event) => {
  if (event.user) {
    event.user = event.user.id ? { id: event.user.id } : undefined;
  }

  if (event.request) {
    event.request = {
      ...event.request,
      data: undefined,
      cookies: undefined,
      headers: sanitizeHeaders(event.request.headers as Record<string, unknown> | undefined) as
        | Record<string, string>
        | undefined,
      url: event.request.url ? stripSearchFromUrl(event.request.url) : event.request.url,
    };
  }

  if (event.contexts) {
    event.contexts = sanitizeRecord(event.contexts as Record<string, unknown>) as Sentry.Contexts;
  }

  if (event.extra) {
    event.extra = sanitizeRecord(event.extra as Record<string, unknown>);
  }

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(sanitizeBreadcrumb);
  }

  return event;
};

const sanitizeErrorEvent = (event: Sentry.ErrorEvent) => {
  return sanitizeEvent(event as Sentry.Event) as Sentry.ErrorEvent;
};

const sanitizeBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  const sanitizedData =
    breadcrumb.data && typeof breadcrumb.data === 'object'
      ? sanitizeRecord(breadcrumb.data as Record<string, unknown>)
      : breadcrumb.data;

  return {
    ...breadcrumb,
    data: sanitizedData,
  };
};

const filterContext = (context: T_ObservabilityContext | undefined) => {
  if (!context) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).filter(
      ([, value]) => ['string', 'number', 'boolean'].includes(typeof value) || value === null
    )
  );
};

const toError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(typeof error === 'string' ? error : 'Unknown error');
};

const isApiError = (error: unknown): error is ApiError => {
  return (
    error instanceof ApiError ||
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      'status' in error &&
      (error as { name?: string }).name === 'ApiError')
  );
};

const isValidationError = (error: unknown): error is ValidationError => {
  return (
    error instanceof ValidationError ||
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'ValidationError')
  );
};

const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    error instanceof NetworkError ||
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'NetworkError')
  );
};

const shouldCaptureHandledError = (
  error: unknown,
  details: Pick<T_CaptureHandledErrorDetails, 'forceCapture'>
) => {
  if (details.forceCapture) {
    return true;
  }

  if (isValidationError(error)) {
    return false;
  }

  return !isApiError(error) || error.status >= 500 || error.status === 0 || isNetworkError(error);
};

const getTracingIntegrations = (router: T_RouterLike) => {
  return [
    Sentry.tanstackRouterBrowserTracingIntegration(router, {
      instrumentPageLoad: true,
      instrumentNavigation: true,
    }),
    Sentry.replayIntegration(),
  ];
};

export function initializeObservability(router: T_RouterLike) {
  if (isInitialized || !getIsObservabilityEnabled()) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    enabled: true,
    sendDefaultPii: false,
    tracesSampleRate: DEFAULT_TRACE_SAMPLE_RATE,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: getTracingIntegrations(router),
    beforeSend: event => sanitizeErrorEvent(event),
    beforeBreadcrumb: breadcrumb => sanitizeBreadcrumb(breadcrumb),
    initialScope: {
      tags: {
        app: 'better-call-buffet-front',
      },
    },
  });

  isInitialized = true;
}

export function setObservabilityUser(user: { id: string }) {
  if (!getIsObservabilityEnabled()) {
    return;
  }

  Sentry.setUser({
    id: user.id,
  });
}

export function clearObservabilityUser() {
  if (getIsObservabilityEnabled()) {
    Sentry.setUser(null);
  }
}

export function captureHandledError(error: unknown, details: T_CaptureHandledErrorDetails) {
  if (!getIsObservabilityEnabled() || !shouldCaptureHandledError(error, details)) {
    return undefined;
  }

  const safeContext = filterContext(details.context);

  return Sentry.withScope(scope => {
    scope.setTag('domain', details.domain);
    scope.setTag('operation', details.operation);
    scope.setTag('handled', 'true');

    if (details.tags) {
      Object.entries(details.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (details.level) {
      scope.setLevel(details.level);
    }

    if (details.fingerprint) {
      scope.setFingerprint(details.fingerprint);
    }

    if (safeContext && Object.keys(safeContext).length > 0) {
      scope.setContext('handled_error', safeContext);
    }

    return Sentry.captureException(toError(error), {
      mechanism: {
        handled: true,
        type: 'observability',
      },
    });
  });
}
