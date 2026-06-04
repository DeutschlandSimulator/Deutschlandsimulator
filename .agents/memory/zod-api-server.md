---
name: Zod in api-server
description: zod is not installed in the api-server package; use plain JS validation or @workspace/api-zod instead.
---

zod is NOT a dependency of `artifacts/api-server`. Importing from `"zod"` or `"zod/v4"` will cause an esbuild bundle failure at startup.

**Why:** The api-server uses a custom esbuild bundler (build.mjs). Only packages listed in its own package.json are resolved. Zod is not listed there.

**How to apply:** In api-server routes, validate request bodies with plain JS (typeof checks, .trim(), length checks). For typed schemas, import from `@workspace/api-zod` (generated from OpenAPI spec).
