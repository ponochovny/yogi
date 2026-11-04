---
name: nitro-api-builder
description: >-
  Create or refactor server API endpoints in Nuxt Nitro with Zod validation, Prisma MongoDB queries, DTO transformers, and typed client composables. Use this skill when developing or modifying backend routes in server/api/.
---

# Nitro API Builder Runbook

Use this runbook to implement or refactor secure, performant, and type-safe backend endpoints in Yogi.

---

## 1. Five-Stage Development Pipeline

```
1. Schema & Contracts (Zod + TypeScript)
   ↓
2. Data Access Layer (server/db/*.ts)
   ↓
3. DTO Transformer (server/transformers/*.ts)
   ↓
4. Route Handler (server/api/**/*.ts)
   ↓
5. Client Composable / Fetcher
```

---

## 2. Implementation Steps

### Step 2.1: Define Zod Validation Schema
In `src/app/types/<domain>.ts` or `src/entities/<domain>/model/types.ts`:
```ts
import { z } from 'zod'

export const createOfferingSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	activity: z.string(),
	duration: z.number().positive(),
	spots: z.number().int().positive(),
	start: z.string().datetime(),
	end: z.string().datetime(),
})

export type CreateOfferingInput = z.infer<typeof createOfferingSchema>
```

### Step 2.2: Implement DB Query in `server/db/`
Add pure database functions using Prisma client:
```ts
// server/db/offerings.ts
import { prisma } from './index'

export const createOfferingRecord = async (data: PrismaOfferingInput) => {
	return await prisma.offering.create({
		data,
		include: {
			tickets: true,
			studio: true,
		},
	})
}
```

### Step 2.3: Implement DTO Transformer in `server/transformers/`
Never expose raw database fields or unformatted dates to the client:
```ts
// server/transformers/offering.ts
export const offeringTransformer = (offering: any) => {
	return {
		id: offering.id,
		name: offering.name,
		slug: offering.slug,
		spots: offering.spots,
		startDate: offering.start?.toISOString(),
		endDate: offering.end?.toISOString(),
		tickets: offering.tickets?.map(ticketTransformer),
	}
}
```

### Step 2.4: Create Route Handler in `server/api/`
```ts
// server/api/offerings/index.post.ts
import { createOfferingSchema } from '~/src/app/types/offering'
import { createOfferingRecord } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'

export default defineEventHandler(async (event) => {
	// 1. Auth check
	const user = event.context.auth?.user
	if (!user) {
		throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
	}

	// 2. Validate body
	const body = await readBody(event)
	const parsed = createOfferingSchema.safeParse(body)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Validation Failed',
			data: parsed.error.format(),
		})
	}

	// 3. Database operation
	try {
		const record = await createOfferingRecord({
			...parsed.data,
			userId: user.id,
		})
		return { data: offeringTransformer(record) }
	} catch (error: any) {
		console.error('Failed to create offering:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
		})
	}
})
```

### Step 2.5: Connect Client Composable
In `src/entities/<domain>/api/` or `composables/`:
```ts
export const useOfferingApi = () => {
	const createOffering = async (data: CreateOfferingInput) => {
		return await useFetchApi<{ data: TOffering }>('/api/offerings', {
			method: 'POST',
			body: data,
		})
	}

	return { createOffering }
}
```

