/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string; // Optional because we have a fallback in api/index.ts
  // Add other environment variables exposed to the client here
  // e.g., readonly VITE_FEATURE_FLAG_X: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
