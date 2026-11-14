# Yogi Project Guidelines & Agent Instructions

This repository is **Yogi**, a modern fullstack wellness marketplace and booking platform (appointments, retreats, workshops, festivals).

---

## 1. Tech Stack Overview

- **Framework**: Nuxt 4 (SSR, ISR, and CSR per route via `routeRules` in `nuxt.config.ts`, with `future.compatibilityVersion: 4`).
- **Language**: TypeScript (`"strict": true`).
- **Frontend Core**: Vue 3 Composition API with `<script setup lang="ts">`.
- **UI & Styling**: Tailwind CSS v4 (CSS-first `@theme` configuration via `@tailwindcss/vite`, without legacy `tailwind.config`), Shadcn Vue (Radix Vue primitives), Lucide Icons, Swiper.
- **Form & Validation**: VeeValidate + Zod.
- **State Management**: Pinia stores + Nuxt `useState`.
- **Backend**: Nuxt Nitro server engine (`server/`).
- **Database & ORM**: MongoDB with Prisma ORM (`prisma/schema.prisma`).
- **Auth**: JWT (Access Token in memory/headers, HTTP-only Cookie for Refresh Token, MongoDB `RefreshToken` collection).
- **Integrations**: Stripe (checkout, payment intents, webhooks), Cloudinary (media upload & transformations), Leaflet / Mapbox (geo search).

---

## 2. Architecture & Design Principles

### 2.1 Feature-Sliced Design (FSD) in Nuxt 4
The project is actively migrating from monolithic Nuxt structure to **Feature-Sliced Design (FSD)** located under `src/`:

```
src/
├── app/        # Global configs, styles, global types, constants, mocks
├── pages/      # Route pages (bound to Nuxt router via nuxt.config dir.pages)
├── widgets/    # Composite self-contained UI blocks (e.g., StudioCreation, CardsSlider)
├── features/   # User actions & interactions (e.g., auth-by-email, book-offering, search-filters)
├── entities/   # Business domain entities (e.g., offering, studio, user, ticket)
└── shared/     # Domain-agnostic UI kit (shadcn), api client, helpers, lib, utils
```

#### Strict Dependency Rule
- Layers can **only** import from layers strictly below them:
  `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- Slices within the same layer **must not** import from each other directly (use public API or lift to upper layer).
- Always expose slice capabilities via an explicit public API: `index.ts`.

#### Migration Rules
- Legacy root folders (`composables/`, `layouts/`, `components/`) are progressively refactored into `src/`.
- Preserve Nuxt auto-imports compatibility while organizing domain logic into FSD slices.

---

## 3. Code Standards & Best Practices

### 3.1 Vue 3 & Frontend Conventions
- **Single File Components**: Always use `<script setup lang="ts">`.
- **Type Safety**:
  - Explicitly type props with `defineProps<{ ... }>()` and default values with `withDefaults(...)`.
  - Explicitly type emits with `defineEmits<{ (e: 'event', payload: T): void }>()`.
- **Async Handling**:
  - **NEVER** use `new Promise(async (resolve, reject) => ...)` anti-pattern. Use standard `async/await`.
  - Use `useFetch` / `useAsyncData` with descriptive, unique cache keys when loading data for SSR/hydration.
  - Client-side one-off requests must use typed `$fetch<T>` or `useFetchApi<T>`.
- **Formatting**:
  - Indentation: Use **tabs** (in accordance with `.eslintrc.cjs`).
  - Max line length: 120 characters where applicable.

### 3.2 Backend (Nitro & Prisma) Conventions
- **Layered Architecture**:
  1. **Route Handler (`server/api/**`)**: Parse request, authenticate context, call validator and services, return response.
  2. **Validation**: All incoming data (query, body, params, formData) **must** be validated with Zod (`safeParse`).
  3. **Repository Layer (`server/db/**`)**: All Prisma queries belong here. Never call `prisma.*` directly inside route handlers.
  4. **DTO Transformers (`server/transformers/**`)**: Transform raw Prisma MongoDB documents into safe client DTOs, stripping sensitive fields (passwords, tokens).
- **Error Handling**:
  - Always throw `createError({ statusCode, statusMessage, data })`.
  - Use appropriate HTTP status codes: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error).
  - Never leak raw MongoDB/Prisma internal stack traces or connection strings to client responses.

---

## 4. DX, Testing & Quality Verification

Before finishing any task or committing changes:
1. **ESLint**: Run `npm run lint` or `npm run lint:fix`. Ensure zero errors and fix any indentation issues.
2. **Typecheck**: Verify TypeScript safety. Keep strict types; avoid `any` or `@ts-ignore` unless interfacing with third-party untyped libraries.
3. **Prisma**: If `schema.prisma` is modified, run `npx prisma generate` to refresh the client.
4. **Imports**: Clean up unused imports, dead files, and ensure relative paths align with FSD conventions.

