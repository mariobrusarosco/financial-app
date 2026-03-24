import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    tanstackStart({
      customViteReactPlugin: true,
    }),
    react(),
    tailwindcss(),
    tsConfigPaths({
      projects: [path.resolve(__dirname, 'tsconfig.json')],
    }),
    ...(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
      ? sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          release: {
            name: process.env.SENTRY_RELEASE,
            inject: true,
          },
        })
      : []),
  ],
  server: {
    port: 2000,
  },
});
