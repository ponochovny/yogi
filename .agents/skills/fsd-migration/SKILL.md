---
name: fsd-migration
description: >-
  Refactor and migrate legacy Nuxt code (root composables, components, pages) into Feature-Sliced Design (FSD) layers: entities, features, widgets, or shared. Use this skill when modularizing code, decomposing large components, or creating new business features according to FSD principles.
---

# Feature-Sliced Design (FSD) Migration Runbook

Use this runbook to migrate legacy components, composables, or pages into proper FSD slices in the Yogi codebase.

---

## 1. Determine the Target Layer

Assess the responsibility of the code being refactored:

| Layer | Responsibility | Examples in Yogi |
|---|---|---|
| `src/shared` | Reusable utilities, UI kit, API clients, helpers (no business domain logic) | Shadcn primitives, date formatters, slug generators, `useFetchApi` |
| `src/entities` | Business domain units with data models and simple UI representation | `offering`, `studio`, `practitioner`, `user`, `ticket` |
| `src/features` | User scenarios that bring business value | `auth-by-email`, `book-ticket`, `filter-offerings`, `edit-profile` |
| `src/widgets` | Composite blocks combining entities & features into standalone page sections | `StudioCreation`, `CardsSlider`, `Header`, `SearchLayout` |
| `src/pages` | Route views that assemble widgets and features | `src/pages/index.vue`, `src/pages/studio/[slug].vue` |

---

## 2. Step-by-Step Migration Procedure

### Step 2.1: Create the Slice Structure
Create the slice folder under the target layer:
```bash
mkdir -p src/<layer>/<slice-name>/{ui,model,api}
```

### Step 2.2: Extract Types & Data Contracts
1. Create `src/<layer>/<slice-name>/model/types.ts`.
2. Define explicit TypeScript interfaces for props, entity models, and API responses.

### Step 2.3: Move & Refactor Business Logic
1. If the logic was in a root composable (e.g. `composables/useOffering.ts`), extract slice-specific actions into `src/<layer>/<slice-name>/model/use<SliceName>.ts` or `src/<layer>/<slice-name>/api/index.ts`.
2. Replace any `new Promise(async ...)` wrappers with clean `async/await` and typed `$fetch<T>`.

### Step 2.4: Extract & Refactor UI Components
1. Move the `.vue` file to `src/<layer>/<slice-name>/ui/<ComponentName>.vue`.
2. Use `<script setup lang="ts">`.
3. Use typed `defineProps<Props>()` and `defineEmits<Emits>()`.
4. Ensure Tailwind classes follow project tokens.

### Step 2.5: Create the Public API (`index.ts`)
Create `src/<layer>/<slice-name>/index.ts` exporting only what outside consumers should access:
```ts
export { default as ComponentName } from './ui/ComponentName.vue'
export * from './model/types'
export { useSliceFeature } from './model/useSliceFeature'
```

### Step 2.6: Update Callers & Verify
1. Update import paths in consumer pages or widgets to import from `~/src/<layer>/<slice-name>`.
2. Delete dead or replaced files in root folders (`composables/`, `components/`).
3. Run `npm run lint` and verify types.

