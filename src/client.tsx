/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { StartClient } from '@tanstack/react-start';
import { createRouter } from './router';
import { initializeObservability } from '@/config/observability';

const router = createRouter();

initializeObservability(router);

hydrateRoot(document, <StartClient router={router} />, {
  onCaughtError: Sentry.reactErrorHandler(),
  onUncaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
});
