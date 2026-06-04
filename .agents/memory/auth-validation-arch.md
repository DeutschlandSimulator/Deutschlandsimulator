---
name: Auth + Validation Architecture
description: Replit Auth wired with sessions/users DB; community validation system with validations + error_reports tables.
---

## Replit Auth
- `lib/db/src/schema/auth.ts`: `sessionsTable` + `usersTable` (must not be dropped)
- `artifacts/api-server/src/lib/auth.ts`: OIDC config, session CRUD
- `artifacts/api-server/src/middlewares/authMiddleware.ts`: sets `req.user` and `req.isAuthenticated()`
- `artifacts/api-server/src/routes/auth.ts`: /login, /callback, /logout, /mobile-auth/*
- `lib/replit-auth-web`: `useAuth()` hook for browser — login/logout/user state
- `app.ts`: needs `cors({credentials:true, origin:true})`, `cookieParser()`, `authMiddleware` before router

## Community Validation
- `lib/db/src/schema/validations.ts`: `validationsTable` (unique per assumption+user), `errorReportsTable`
- `artifacts/api-server/src/routes/validations.ts`: stats, validate, unvalidate, report, admin overview
- `artifacts/diz-app/src/components/ValidationWidget.tsx`: status badge + actions per assumption
- Status threshold: 3 validations → "community_geprueft" (🟢), below → "ki_recherchiert" (🟡)
- Admin page: `/admin` — requires login, shows KPIs + sortable table

**Why:** Allows community to signal which AI-researched assumptions have been source-checked.
