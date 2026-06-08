---
name: Dev proxy setup
description: The API server (port 8080 / external port 80) must proxy frontend requests to the diz-app Vite dev server (port 21861) in development.
---

## Rule
In development, `artifacts/api-server/src/app.ts` uses `http-proxy-middleware` to forward all non-`/api` requests to `localhost:21861` (the diz-app Vite dev server).

**Why:** Replit's `.replit` file maps `localPort=8080` → `externalPort=80` as a DIRECT port mapping. When users access `replit.dev/`, they hit port 8080 (API server) directly, bypassing the internal Replit path-based proxy (which correctly routes `localhost:80` in screenshots). Without the proxy in the API server, `replit.dev/` returned a blank response.

**How to apply:** If the diz-app is ever moved to a different port, update `DIZ_APP_PORT` env var or the hardcoded fallback `"21861"` in `app.ts`. The proxy uses `ws: true` to also proxy Vite HMR websocket connections.
