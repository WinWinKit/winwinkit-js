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

**Type generation flow:** The OpenAPI spec at `api.winwinkit.com/openapi-yaml` is converted to TypeScript types via `openapi-typescript` into `src/types/schema.ts` (auto-generated, do not edit manually). Thin type aliases in `src/types/*.ts` re-export specific `components['schemas']` entries for public use.

**Client:** `src/client/winwinkit.ts` contains the `WinWinKit` class — the sole public interface. It wraps `openapi-fetch`'s typed client with methods that accept camelCase params, call the REST API, and return discriminated unions of `{ data, errors: null } | { data: null, errors: ErrorObject[] }`. Authentication is via `x-api-key` header.

**Exports:** `src/index.ts` re-exports the `WinWinKit` class (default + named) and all types from `src/types/index.ts`.

**Output:** CommonJS (`dist/`) with `.d.ts` declarations. Target is `es2016` with `strict: true` and `noUncheckedIndexedAccess: true`.
