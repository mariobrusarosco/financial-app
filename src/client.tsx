/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { StartClient } from '@tanstack/react-start';
import { createRouter } from './router';
import { initializeObservability } from '@/config/observability';

const router = createRouter();
const onReactRootError = Sentry.reactErrorHandler((error, errorInfo, eventId) => {
  if (import.meta.env.DEV) {
    console.error('React root error:', error, {
      componentStack: errorInfo.componentStack,
      eventId,
    });
  }
});

initializeObservability(router);

hydrateRoot(document, <StartClient router={router} />, {
  onCaughtError: onReactRootError,
  onUncaughtError: onReactRootError,
  onRecoverableError: onReactRootError,
});
