---
name: ddd-backend-domain
description: >-
  Scaffold or refactor backend logic into modular Domain-Driven Design (DDD) bounded contexts under server/domains/. Use this skill when creating a new backend domain, extracting business logic from server/db and server/helpers, or creating domain services and repositories.
---

# Backend Domain Scaffolding Runbook

Use this runbook to create or refactor a domain module under `server/domains/<domain>/`.

---

## 1. Directory Structure Setup

Run the following layout creation:
```bash
DOMAIN="offering" # replace with your domain name
mkdir -p server/domains/$DOMAIN/{model,services,repositories,transformers}
touch server/domains/$DOMAIN/index.ts
```

---

## 2. File Implementation Sequence

### Step 2.1: Domain Models & Schemas (`model/`)
- `server/domains/<domain>/model/schemas.ts`: Zod schemas for input validation.
- `server/domains/<domain>/model/types.ts`: Domain types and interfaces.

### Step 2.2: Repository (`repositories/`)
- `server/domains/<domain>/repositories/<domain>.repo.ts`:
  - Pure Prisma queries against MongoDB.
  - Return raw database models or `null`.
  - Handle database-specific exceptions.

### Step 2.3: DTO Transformer (`transformers/`)
- `server/domains/<domain>/transformers/<domain>.dto.ts`:
  - Strip internal database IDs, hashes, or metadata.
  - Format dates and nested entities.

### Step 2.4: Domain Service / Use Cases (`services/`)
- `server/domains/<domain>/services/<domain>.service.ts`:
  - Enforce business invariants.
  - Coordinate repository calls, third-party services (Stripe, Cloudinary), and data transformations.
  - Throw `createError({ statusCode, statusMessage })` when business rules are violated.

### Step 2.5: Public API (`index.ts`)
```ts
export * from './model/types'
export * from './model/schemas'
export { OfferingService } from './services/offering.service'
export { offeringDto } from './transformers/offering.dto'
```

---

## 3. Thin Controller Hookup
Hook up your domain in `server/api/<domain>/`:
```ts
import { OfferingService } from '~/server/domains/offering'

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, (b) => schema.safeParse(b))
	return await OfferingService.execute(body.data)
})
```

