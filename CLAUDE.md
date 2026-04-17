# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
npm run build

# Regenerate OpenAPI types from remote spec
npx openapi-typescript https://api.winwinkit.com/openapi-yaml -o ./src/types/schema.ts

# Publish (bumps version first, then builds and publishes)
# 1. Update version in package.json
# 2. npm run publish
```

There are no tests or linting configured.

## Architecture

This is `@winwinkit/sdk`, a TypeScript SDK for the WinWinKit API built on `openapi-fetch`.

**Type generation flow:** The OpenAPI spec at `api.winwinkit.com/openapi-yaml` is converted to TypeScript types via `openapi-typescript` into `src/types/schema.ts` (auto-generated, do not edit manually). Thin type aliases in `src/types/*.ts` re-export specific `components['schemas']` entries as the public surface; `src/types/index.ts` barrels them.

**Client:** `src/client/winwinkit.ts` contains the `WinWinKit` class — the sole public interface. It wraps `openapi-fetch`'s typed client (`createClient<paths>`) with one public method per endpoint. Authentication is via the `x-api-key` header, attached per-request by `createAuthHeader()`. `baseUrl` defaults to `https://api.winwinkit.com` and is overridable via the constructor.

**Method conventions — follow these when adding endpoints:**
- Inputs are destructured camelCase objects; translate to snake_case in the request `body`/`path` (e.g. `appUserId` → `app_user_id`).
- `Date` inputs are serialized with `.toISOString()` before sending.
- Return type is a discriminated union keyed by domain-specific names (e.g. `{ user, errors: null } | { user: null, errors: ErrorObject[] }`, or with additional success fields like `rewardsGranted`, `withdrawResult`). Do **not** use a generic `data` key — pull the relevant entities out of `data.data.*` and name them explicitly.
- On error, return `{ ...nulls, errors: error.errors }`. `fetchUser` is the one exception: a 404 is treated as a successful "not found" and returns `{ user: null, errors: null }`.

**Exports:** `src/index.ts` re-exports the `WinWinKit` class (default + named) and all types from `src/types/index.ts`.

**Output:** CommonJS (`dist/`) with `.d.ts` declarations. Target is `es2016` with `strict: true` and `noUncheckedIndexedAccess: true`.
