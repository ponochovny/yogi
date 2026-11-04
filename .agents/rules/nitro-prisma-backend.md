# Nitro & Prisma Backend Rules for Yogi

## 1. Architectural Layers in `server/`

All server logic must follow a clean layered architecture:

```
server/
├── api/             # HTTP route handlers (event handlers)
├── middleware/      # Nitro middlewares (auth, cors, request context)
├── db/              # Data Access Layer / Repositories (Prisma queries)
├── helpers/         # Domain business logic and validation helpers
├── transformers/    # DTO mapping (sanitizing outputs, formatting dates)
├── utils/           # Server utilities (jwt, stripe, cloudinary)
└── types/           # Backend-specific TypeScript contracts
```

---

## 2. Route Handler Responsibilities (`server/api/**`)

Every event handler defined with `defineEventHandler` must:
1. **Extract and validate parameters**:
   - For query parameters: `getQuery(event)` validated via Zod.
   - For request body: `readBody(event)` validated via Zod.
   - For multipart forms: `extractForm(event)` validated via Zod.
   - For route params: `getRouterParam(event, 'paramName')`.
2. **Authorize**: Check `event.context.auth` if the route requires authentication.
3. **Delegate**: Call repository functions in `server/db/` or services in `server/helpers/`.
4. **Transform**: Pass raw database documents through `server/transformers/` before sending the response to the client.

```ts
// Example: server/api/offerings/[id].get.ts
import { getOfferingById } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'
import { z } from 'zod'

const paramsSchema = z.object({
	id: z.string().min(1, 'ID is required'),
})

export default defineEventHandler(async (event) => {
	const params = await getValidatedRouterParams(event, (data) =>
		paramsSchema.safeParse(data)
	)
	if (!params.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid parameters',
			data: params.error.format(),
		})
	}

	const offering = await getOfferingById(params.data.id)
	if (!offering) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Offering not found',
		})
	}

	return {
		data: offeringTransformer(offering),
	}
})
```

---

## 3. Database Layer (`server/db/**`)

- All Prisma client interactions must live exclusively inside `server/db/`.
- Handle MongoDB ObjectId mapping cleanly.
- Keep queries focused and indexed: use `select` or `include` deliberately to prevent overfetching.
- Never expose password hashes, refreshToken records, or internal MongoDB details directly to callers.

---

## 4. Security & Authentication

1. **Tokens**:
   - Access tokens are short-lived (15 minutes), signed with `JWT_ACCESS_TOKEN_SECRET`.
   - Refresh tokens are long-lived (7 days), signed with `JWT_REFRESH_TOKEN_SECRET`.
   - Refresh tokens must be stored in `httpOnly`, `sameSite: 'strict'`, `secure: process.env.NODE_ENV === 'production'` cookies.
2. **Stripe & Webhooks**:
   - Never trust client-sent amounts or prices. Always calculate prices on the server from the database.
   - Validate Stripe webhook signatures using `stripe.webhooks.constructEvent` with `STRIPE_ENDPOINT_SECRET`.
3. **Cloudinary**:
   - Upload operations must authenticate securely with server-side API keys.
   - Delete unused/orphaned media when records are updated or removed.

