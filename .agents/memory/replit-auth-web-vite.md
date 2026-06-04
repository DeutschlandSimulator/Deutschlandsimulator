---
name: replit-auth-web vite types
description: lib/replit-auth-web needs vite as a devDependency for import.meta.env to typecheck.
---

`lib/replit-auth-web` uses `import.meta.env.BASE_URL` in `use-auth.ts`. The tsconfig sets `"types": ["vite/client"]` which requires vite to be installed.

**Why:** It's a shared lib (not a vite app itself), so vite is not automatically present. Without it, tsc throws `Cannot find type definition file for 'vite/client'` and `Property 'env' does not exist on type 'ImportMeta'`.

**How to apply:** `lib/replit-auth-web/package.json` devDependencies must include `"vite": "catalog:"`.
