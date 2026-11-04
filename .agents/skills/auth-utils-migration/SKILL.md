---
name: auth-utils-migration
description: >-
  Migrate authentication logic from legacy custom JWT and MongoDB RefreshToken to nuxt-auth-utils encrypted sessions. Use this skill when updating auth endpoints, replacing useAuth composable, removing JWT dependencies, or protecting Nitro routes with requireUserSession.
---

# nuxt-auth-utils Migration Runbook

Use this runbook to transition Yogi from manual JWT token rotation to official `nuxt-auth-utils` encrypted sessions.

---

## 1. Setup & Installation

1. Add `nuxt-auth-utils` to Nuxt modules:
   ```bash
   npx nuxi module add auth-utils
   ```
2. Generate a secure 32-character secret in `.env`:
   ```env
   NUXT_SESSION_PASSWORD=super-secret-random-key-at-least-32-chars-long
   ```
3. Add session type declaration in `src/app/types/auth.d.ts`.

---

## 2. Server Endpoints Refactoring

### Step 2.1: Login Endpoint (`server/api/auth/login.post.ts`)
- Replace JWT token generation with `setUserSession(event, { user: userDTO, loggedInAt: Date.now() })`.
- Remove `sendRefreshToken` cookie logic.

### Step 2.2: Register Endpoint (`server/api/auth/register.post.ts`)
- Create user in database with hashed password.
- Immediately initialize session with `setUserSession(event, ...)`.

### Step 2.3: Logout Endpoint (`server/api/auth/logout.post.ts`)
- Replace manual token deletion with `await clearUserSession(event)`.

### Step 2.4: Protecting Server Routes
- In protected routes (`/api/offerings`, `/api/studios`, etc.), replace custom middleware checking with:
  ```ts
  import { requireUserSession } from '#auth-utils'

  export default defineEventHandler(async (event) => {
  	const { user } = await requireUserSession(event)
  	// user.id is now strictly typed and verified
  })
  ```

---

## 3. Client Composable Refactoring

Update or wrap `composables/useAuth.ts` to delegate to `useUserSession()`:
```ts
export default () => {
	const { user, loggedIn, clear, fetch } = useUserSession()

	const logout = async () => {
		await clear()
		await navigateTo('/')
	}

	return {
		user,
		isLoggedIn: loggedIn,
		logout,
		refreshSession: fetch,
	}
}
```

---

## 4. Database & Dependency Cleanup

1. In `prisma/schema.prisma`:
   - Delete model `RefreshToken`.
   - Remove `refreshToken RefreshToken[]` relation from `User` model.
   - Run `npx prisma generate`.
2. Remove deprecated files:
   - `server/utils/jwt.ts`
   - `server/db/refreshTokens.ts`
3. Uninstall `jsonwebtoken` and `jwt-decode`:
   ```bash
   npm uninstall jsonwebtoken jwt-decode @types/jsonwebtoken @types/jwt-decode
   ```

