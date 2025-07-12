# ADR 0001: Relocate `app/` directory under `src/`

Date: 2024-06-XX

## Status

Accepted

## Context

Our TanStack Start setup by default expects an `app/` folder at the project root, containing:

- `routes/` for file-based route definitions
- `ssr.tsx` and `client.tsx` entry points
- `router.ts(x)` for configuring TanStack Router
- The auto-generated `routeTree.gen.ts` manifest

However, our existing code follows a `src/`-first convention. Placing `app/` at the top level clutters the root and creates two parallel source trees. To keep all source files under `src/`, we must move the entire `app/` directory into `src/app/` and update our configuration accordingly.

## Decision

1. Relocate all `app/` assets under `src/app/`:
   - `src/app/routes/` (route files)
   - `src/app/ssr.tsx`
   - `src/app/client.tsx`
   - `src/app/router.ts`
   - `src/app/routeTree.gen.ts`

2. Update **`app.config.ts`** via `defineConfig`:

   ```ts
   export default defineConfig({
     vite: {
       /* existing Vite + Tailwind + paths config */
     },
     tsr: {
       appDirectory: 'src/app',
       routesDirectory: 'src/app/routes',
       generatedRouteTree: 'src/app/routeTree.gen.ts',
       routeFileIgnorePattern: '\\.gen\\.ts$',
     },
     routers: {
       ssr: { entry: 'src/app/ssr.tsx' },
       client: { entry: 'src/app/client.tsx' },
     },
     server: { preset: 'node-server' },
   });
   ```

3. Rename `router.tsx` → `router.ts` so that imports (`import './router'`) resolve without special extension flags.

4. Tweak **`tsconfig.json`** to support `.ts` imports and our `src/` base:
   ```jsonc
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": { "@/*": ["src/*"] },
       "noEmit": true,
       "allowImportingTsExtensions": true,
       /* ...other strict options... */
     },
     "include": ["src/**/*.ts", "src/**/*.tsx"],
   }
   ```

## Consequences

- All Start framework files now live under `src/app/`, fitting our mono-source layout.
- The custom route manifest (`routeTree.gen.ts`) is ignored from route scanning to avoid self-inclusion.
- Build and dev commands (`vinxi dev`, `vite build`) seamlessly find entries in `src/app/` without additional CLI flags.
- Importing `.tsx` extensions is no longer necessary.

### Alternatives Considered

- **Leave `app/` at root**: Easier but clashes with our `src/`-centric code structure.
- **Create symlink**: Messy on cross-platform environments and CI.
- **Custom Vinxi CLI flags** each run: Error-prone and inconvenient for team on-boarding.

This ADR ensures a clean, consolidated source layout and maintainable configuration.
