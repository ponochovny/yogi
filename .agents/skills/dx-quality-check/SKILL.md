---
name: dx-quality-check
description: >-
  Verify code quality, run ESLint, generate Prisma client, check TypeScript types, and resolve Nuxt auto-import issues. Use this skill before committing code, after refactoring, or when diagnosing build and runtime issues.
---

# Developer Experience & Quality Check Runbook

Use this runbook to validate the integrity of the project, check for regressions, and ensure clean DX across all layers.

---

## 1. Quick Verification Commands

### Step 1: Run Linter
```bash
npm run lint
```
To automatically fix formatting and indentation issues:
```bash
npm run lint:fix
```

### Step 2: Regenerate Prisma Client
Whenever `prisma/schema.prisma` is modified or when models are out of sync:
```bash
npx prisma generate
```

### Step 3: Type Checking
To verify TypeScript compilation:
```bash
npx nuxi typecheck --noEmit
```
*Note: If `npx nuxi typecheck` encounters Node/vue-tsc environment issues, run `npx nuxt prepare` first to refresh the auto-generated `.nuxt/` types.*

---

## 2. Refactoring Health Checklist

Before considering a refactoring task complete, verify:
- [ ] **Tab Indentation**: No mixed spaces/tabs (enforced by ESLint `indent: ['error', 'tab']`).
- [ ] **No Anti-patterns**: Search for `new Promise(async` — replace with clean `async/await`.
- [ ] **FSD Boundaries**: Ensure no bottom-to-top imports (e.g. `shared` importing from `entities` or `features`).
- [ ] **Zod Schemas**: Input validation is present on all new Nitro route handlers.
- [ ] **Transformers**: All DB query results returned to the client are mapped through `server/transformers/`.
- [ ] **Accessibility**: Interactive elements have `aria-*` tags and proper keyboard focus styles.

