import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
    ],
    build: { ssr: true },
  },
  tsr: {
    // point to the relocated app folder and route files
    appDirectory: 'src/app',
    routesDirectory: 'src/app/routes',
    generatedRouteTree: 'src/app/routeTree.gen.ts',
    // ignore generated scaffolding files in routes
    routeFileIgnorePattern: '\\.gen\\.ts$',
  },
  routers: {
    // override entry points for SSR and client bundles
    ssr: { entry: 'src/app/ssr.tsx' },
    client: { entry: 'src/app/client.tsx' },
  },
})

