# Backend Domain-Driven Design (DDD) Rules for Yogi

## 1. Modular Domain Organization

All business logic on the server must be organized by **Bounded Contexts (Domains)** under `server/domains/`.
Do NOT spread domain logic across scattered root folders (`server/db`, `server/helpers`, `server/transformers`).

```
server/
├── api/                     # Thin HTTP route handlers (Event Handlers / Controllers)
├── domains/                 # Bounded Contexts
│   ├── auth/                # Authentication & User Sessions (nuxt-auth-utils)
│   ├── offering/            # Wellness Offerings, schedules, locations
│   ├── studio/              # Studio management & hosts
│   ├── booking/             # Tickets, purchases, Stripe transactions
│   ├── user/                # User profile, interests, avatar
│   └── shared/              # Shared infrastructure (Prisma, Cloudinary, Stripe, Base Errors)
└── middleware/              # Global Nitro server middlewares
```

---

## 2. Anatomy of a Domain Module

Each domain inside `server/domains/<domain>/` must adhere to strict internal layering:

```text
server/domains/<domain>/
├── model/                   # Domain entities, value objects, Zod schemas & types
│   ├── schemas.ts           # Zod validation schemas
│   └── types.ts             # Domain-specific TypeScript contracts
├── services/                # Application Use Cases & Business Rules
│   └── <domain>.service.ts  # Domain service methods (create, update, cancel, etc.)
├── repositories/            # Data Access Layer (Prisma Queries)
│   └── <domain>.repo.ts     # Pure database queries (MongoDB via Prisma)
├── transformers/            # Data Transfer Objects (DTO mapping)
│   └── <domain>.dto.ts      # Sanitizing database output for client consumption
└── index.ts                 # Public API of the domain module
```

---

## 3. Thin Route Handler Pattern

Route handlers in `server/api/**` must remain **thin controllers**. They only:
1. Extract & validate the request payload using Zod.
2. Authenticate the user via `requireUserSession(event)`.
3. Call the appropriate Domain Service.
4. Return the transformed DTO response.

```ts
// Example: server/api/offerings/index.post.ts
import { requireUserSession } from '#auth-utils'
import { createOfferingSchema } from '~/server/domains/offering/model/schemas'
import { OfferingService } from '~/server/domains/offering/services/offering.service'

export default defineEventHandler(async (event) => {
	// 1. Session check
	const { user } = await requireUserSession(event)

	// 2. Validate input
	const body = await readValidatedBody(event, (data) =>
		createOfferingSchema.safeParse(data)
	)
	if (!body.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid input',
			data: body.error.format(),
		})
	}

	// 3. Delegate to Domain Service
	const result = await OfferingService.createOffering({
		...body.data,
		userId: user.id,
	})

	// 4. Return DTO
	return { data: result }
})
```

---

## 4. Separation Rules

- **No direct Prisma calls in `server/api/` or `services/`**: All database queries must live inside `<domain>/repositories/`.
- **Domain Independence**: Domains should not tightly couple to each other. Communication between domains must occur through exported service interfaces or domain events.
- **DTO Projection**: Database records must never be returned to the client directly. Always project through `<domain>/transformers/<domain>.dto.ts`.

