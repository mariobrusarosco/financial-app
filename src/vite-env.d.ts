/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string; // Optional because we have a fallback in api/index.ts
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
