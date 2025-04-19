import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/domains/testing/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/domains/testing/**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
      ],
    },
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@domains': fileURLToPath(new URL('./src/domains', import.meta.url)),
      '@global': fileURLToPath(new URL('./src/domains/global', import.meta.url)),
      '@tools': fileURLToPath(new URL('./src/domains/tools', import.meta.url)),
      '@testing': fileURLToPath(new URL('./src/domains/testing', import.meta.url)),
    },
  },
}); 