# TanStack Start Guide

A comprehensive low-level guide to **TanStack Start**, the full-stack React (and Solid) framework powered by TanStack Router and Vite.

---

## 1. Architecture Overview

TanStack Start stitches together three major layers:

- **Routing**: File-based, fully inferred type-safe routing via [TanStack Router][1].
- **Server**: SSR, streaming, and server functions/RPCs through `@tanstack/react-start` and a Vite plugin (Vinxi).
- **Client**: A lightweight hydration and router client that seamlessly continues where the server left off.

---

## 2. Core Packages & Their Roles

1. **@tanstack/react-router**  
   • Core router engine: file-based or code-based routing, nested layouts, loaders, and mutations.  
   • Fully inferred TypeScript types for paths, parameters, loader data, and search params.

2. **@tanstack/react-start**
   - **Server Side**  
     • `createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)`  
      – Integrates into your runtime to match routes, execute loaders, and stream HTML.  
     • `createServerFn({ method }).handler()`  
      – Define server-only RPC endpoints alongside your routes.  
     • `getRouterManifest()`  
      – Serializes your route tree (paths, input/output schemas) into a manifest.

   - **Client Side**  
     • `<StartClient router={router} />`  
      – Hydrates server-rendered HTML, restores loader data, and enables client navigation.

3. **Vinxi (temporary)**  
   • A Vite plugin that auto-generates the router manifest by scanning `app/routes`.  
   • Bundles both client and server entries in one build.  
   • Will later be replaced by a dedicated Start CLI or official plugin.

4. **Vite + React Plugin**  
   • Handles client and SSR bundling, with JSX/TSX transforms via `@vitejs/plugin-react`.

---

## 3. Project Layout

Minimal project structure when building from scratch (per [React guide][2]):

```
my-app/
├─ tsconfig.json
├─ package.json
├─ vite.config.ts       ← Vite + Vinxi config
└─ app/
   ├─ ssr.tsx           ← Server entrypoint
   ├─ client.tsx        ← Client entrypoint
   └─ routes/
      ├─ __root.tsx     ← HTML template with `<head>` and `<Scripts />`
      └─ index.tsx      ← First file-based route
```

- **`__root.tsx`**: Uses `createRootRoute` to define `<html><head/><body/><Outlet/><Scripts/></body></html>`.
- **`index.tsx`**: Uses `createFileRoute` for defining loaders, components, and server-RPC hooks.

---

## 4. SSR & Streaming Pipeline

1. **Incoming request** to your serverless function or Node server.
2. Invoke the default export from `app/ssr.tsx`:
   ```ts
   export default createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler);
   ```
3. Internally, Start:
   - Reads the route manifest to determine matching routes.
   - Executes their `loader()` functions and collects data.
   - Uses React 18's `renderToPipeableStream` to stream HTML chunks to the client.
4. The client receives initial HTML plus an inline JSON payload of loader data for hydration.

---

## 5. Routing & Manifest

- **File-based routing**: Each file under `app/routes` maps to a URL segment.  
  Example: `app/routes/users/[userId]/settings.tsx` ⇒ `/users/:userId/settings` with `userId: string`.

- **Route manifest**:  
  • JSON tree of all routes, loader keys, parameter types, and RPC endpoints.  
  • Shared between server and client for consistent hydration and navigation.  
  • Auto-generated at build via Vinxi.

---

## 6. Server Functions (RPC)

Define server-only functions directly in route files:

```ts
const getCount = createServerFn({ method: 'GET' }).handler(async () => readCount());

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => writeNewCount(data));

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => getCount(),
});
```

- `.handler()` code runs **only on the server**.
- The client stub issues `fetch('/_start/count?...')` under the hood.
- HTTP method, validation, and TypeScript typings are fully inferred.

---

## 7. Client Hydration & State Management

- `<StartClient router={router} />`:  
  • Rehydrates streamed loader data.  
  • Boots the same `router` instance used on the server.  
  • Enables link interception, scroll restoration, prefetching, and invalidation.

- **Data invalidation**:  
  • Call `router.invalidate()` after an RPC to re-fetch affected loaders only.  
  • No external state manager needed—cache control is built in.

---

## 8. Build & Deployment

1. `vite build` generates:
   - Client bundle (static assets)
   - Server bundle (`ssr.tsx` + manifest)

2. Deploy anywhere JS runs:
   - Node server, serverless (Netlify, Vercel), or edge (Cloudflare Workers).
   - The exported SSR handler plugs into your chosen runtime.

> "TanStack Start can be deployed anywhere JS can run." — [Start homepage][3]

---

## 9. Tooling & Configuration

**`tsconfig.json`**

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "Preserve",
    "target": "ES2022",
    "skipLibCheck": true,
  },
}
```

**`vite.config.ts`**

```ts
import react from '@vitejs/plugin-react';
import vinxi from 'vinxi';

export default {
  plugins: [vinxi({ routesDir: 'app/routes', ssrEntry: 'app/ssr.tsx' }), react()],
  build: { ssr: true },
};
```

---

## 10. Roadmap & Beta Notes

- **Status: BETA** — APIs may evolve, though breaking changes near v1.0 are expected to be rare.
- **Vinxi → Start CLI** — upcoming dedicated CLI/Vite plugin for simpler setup.
- **Multi-framework support** — beyond React, Solid is also supported.

---

## References

1. Routing guide: [TanStack Router + Start][1]
2. React Getting Started: [TanStack Start Guide][2]
3. Homepage: [TanStack Start][3]

[1]: https://tanstack.com/router/latest/docs/framework/react/guide/tanstack-start
[2]: https://tanstack.com/start/latest/docs/framework/react/getting-started
[3]: https://tanstack.com/start/
