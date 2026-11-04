# Feature-Sliced Design (FSD) Rules for Yogi

## 1. Layer Hierarchy & Direction of Dependencies

All client application code is structured according to Feature-Sliced Design inside `src/`.
Imports must strictly flow from top to bottom. A slice can only import from lower layers:

```
[app]        -> Application initialization, global providers, styles, root types
  ↓
[pages]      -> Route views (routed by Nuxt pages directory)
  ↓
[widgets]    -> Large standalone UI compositions combining features and entities
  ↓
[features]   -> Reusable user scenarios (e.g. auth-by-email, create-review, filter-offerings)
  ↓
[entities]   -> Business domain units (offering, studio, user, ticket, booking)
  ↓
[shared]     -> Reusable UI primitives (shadcn), api utilities, helpers, general libs
```

> **Forbidden**: An entity importing from a feature or widget. A feature importing from a widget or page. Cross-imports between slices of the same layer (e.g., `entities/offering` importing directly from `entities/studio`) are prohibited—compose them in a widget or feature above them, or move shared domain logic to a shared entity/kernel.

---

## 2. Slice Internal Structure

Each slice within `features`, `entities`, or `widgets` should follow a consistent internal organization:

```text
slice-name/
├── ui/              # Vue components belonging to this slice
│   ├── ComponentName.vue
│   └── SubComponent.vue
├── model/           # Business logic, state, stores, composables
│   ├── types.ts     # TypeScript interfaces/types specific to this slice
│   ├── store.ts     # Pinia store (if slice state is global)
│   └── use*.ts      # Slice-specific composables
├── api/             # API calls and data fetching logic for this slice
│   └── index.ts
└── index.ts         # Public API: ONLY what is exported here can be imported outside
```

---

## 3. Public API Enforcement

Every slice must expose its interface through an `index.ts` file at its root:
```ts
// GOOD: Importing from public API
import { OfferingCard, useOfferingDetails, type Offering } from '~/src/entities/offering'

// FORBIDDEN: Deep imports bypassing public API
import OfferingCard from '~/src/entities/offering/ui/OfferingCard.vue'
import { useOfferingDetails } from '~/src/entities/offering/model/useOfferingDetails'
```

---

## 4. Nuxt 3 Integration & Migration Strategy

1. **Pages**: `nuxt.config.ts` sets `dir.pages: './src/pages'`. Route pages in `src/pages` should be lean and only assemble widgets and features.
2. **Components**: `src/shared/ui` is registered in Nuxt components. Shadcn components reside in `src/shared/ui/shadcn`.
3. **Legacy Root Folders**:
   - `composables/`: Migrate general API callers into `src/shared/api` or `src/shared/composables`, and domain-specific composables (e.g., `useOffering`, `useStudio`) into `src/entities/*/model/` or `src/features/*/model/`.
   - `components/`: Empty root folders should be deleted; legacy components should be placed into either `src/shared/ui/` (if reusable UI) or `src/entities/*/ui/` (if tied to a domain entity).

