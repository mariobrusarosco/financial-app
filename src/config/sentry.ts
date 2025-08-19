import * as Sentry from '@sentry/react';

// Sentry configuration
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development';
  
  // Only initialize Sentry if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not found. Sentry will not be initialized.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    
    // Performance monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Release tracking
    release: `better-call-buffet@${import.meta.env.VITE_APP_VERSION || '0.0.2'}`,
    
    // Integration configuration
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    
    // Filter out noise
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      const error = hint.originalException;
      if (error instanceof Error) {
        // Filter out React DevTools errors
        if (error.message.includes('_reactInternalInstance')) {
          return null;
        }
      }
      
      return event;
    },
  });
  
  console.log(`✅ Sentry initialized for ${environment}`);
};



// Performance monitoring helpers
export const startSpan = (name: string, operation: string) => {
  return Sentry.startInactiveSpan({ 
    name, 
    op: operation,
    forceTransaction: true 
  });
};

// React Error Boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

