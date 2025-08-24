import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    tanstackStart({
      customViteReactPlugin: true,
    }),
    react(),
    tailwindcss(),
    tsConfigPaths({
      projects: [path.resolve(__dirname, 'tsconfig.json')],
    }),
  ],
  server: {
    port: 2000,
  },
});
