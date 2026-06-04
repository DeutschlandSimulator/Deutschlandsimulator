# Threat Model

## Project Overview

Deutschlandsimulator is a publicly deployed informational web application that lets visitors explore model-driven political and economic scenarios. The production system currently consists of a static React/Vite frontend in `artifacts/diz-app` and a small Express API in `artifacts/api-server`; a PostgreSQL/Drizzle library exists in `lib/db` but is not currently exercised by production routes. The `artifacts/mockup-sandbox` preview tool is treated as development-only and out of scope unless separately exposed in production.

## Assets

- **Site integrity** -- visitors must receive the intended simulation UI and bundled data without attacker-controlled script execution or route tampering.
- **Service availability** -- the public site and `/api/healthz` endpoint should remain resilient against trivial unauthenticated abuse because the deployment is internet-accessible.
- **Future server-side data and secrets** -- the API server and database scaffolding already exist, so any future expansion will place `DATABASE_URL`, API routes, and database contents behind the server boundary.
- **User privacy on the client** -- the current app stores only a local theme preference, but client-side features must not leak browser data or expose sensitive values if personalization is later added.

## Trust Boundaries

- **Browser to static web app** -- all visitors can load the frontend and interact with its client-side routing and simulator controls; all browser input must be treated as untrusted.
- **Browser to API server** -- requests to `/api/*` cross into the Express service. Any future non-health endpoints must enforce validation and authorization server-side.
- **API server to database** -- `lib/db` creates privileged server-side database access using `DATABASE_URL`. Injection or unsafe query construction here would expose the full database.
- **Production versus development tooling** -- `artifacts/mockup-sandbox`, `attached_assets`, and local helper scripts are development aids and should not influence production exposure unless explicitly deployed.

## Scan Anchors

- Production web entry point: `artifacts/diz-app/src/main.tsx` and `artifacts/diz-app/src/App.tsx`
- Production API entry point: `artifacts/api-server/src/index.ts` and `artifacts/api-server/src/app.ts`
- Public API surface: `artifacts/api-server/src/routes/`
- Highest-risk future server boundary: `lib/db/src/` and any future API handlers importing it
- Dev-only area to usually ignore: `artifacts/mockup-sandbox/` mounted at `/__mockup` in development tooling

## Threat Categories

### Tampering

The primary tampering risk today is client-side or server-side code paths that turn untrusted input into executable behavior. The simulator currently performs calculations locally with static in-repo data, so any dynamic HTML, script execution, redirects, or future server-side state changes would be high-signal review points. The system must ensure that user-controlled input is never interpreted as code, HTML, filesystem paths, or database queries.

### Information Disclosure

The current production app is intentionally public and stores little user data, but the server boundary already holds environment-based secrets and database connectivity. The application must avoid exposing secrets, internal errors, cookies, authorization headers, or future database-backed records through logs, API responses, or debug-only surfaces. Development-only tooling must remain out of the public production path.

### Denial of Service

Because the deployment is public, all unauthenticated endpoints can be probed by anyone on the internet. The current route surface is small, but any future expensive API operations, large request bodies, or file-processing endpoints must enforce reasonable limits and timeouts. Public routes must not allow trivial resource exhaustion.

### Elevation of Privilege

There is no active authentication or role model in the current production code, which is acceptable for a public read-only informational site. If the API later gains privileged or user-specific functionality, authorization must be enforced on the server for every protected route, and all database access must remain parameterized and scoped to the caller's permissions.
