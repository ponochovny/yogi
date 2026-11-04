# Authentication Rules: nuxt-auth-utils for Yogi

## 1. Overview & Architecture

The Yogi platform uses **`nuxt-auth-utils`** for secure, cookie-based session authentication.
Custom JWT generation (`jsonwebtoken`), refresh token rotation, and MongoDB token storage (`RefreshToken` collection) are deprecated and prohibited.

---

## 2. Server-Side Session Handling

### 2.1 Starting a Session (Login / Registration)
```ts
// server/api/auth/login.post.ts
import { setUserSession } from '#auth-utils'

export default defineEventHandler(async (event) => {
	// ... validate credentials ...
	const user = await AuthService.validateCredentials(email, password)

	await setUserSession(event, {
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			profileImage: user.profileImage,
			roles: user.roles || [],
		},
		loggedInAt: Date.now(),
	})

	return { success: true, user }
})
```

### 2.2 Terminating a Session (Logout)
```ts
// server/api/auth/logout.post.ts
import { clearUserSession } from '#auth-utils'

export default defineEventHandler(async (event) => {
	await clearUserSession(event)
	return { success: true }
})
```

### 2.3 Route Protection
For any endpoint requiring an authenticated user, call `requireUserSession(event)` at the beginning:
```ts
const { user } = await requireUserSession(event)
```
If the user is not authenticated, `requireUserSession` automatically throws a `401 Unauthorized` HTTP error with clean headers.

---

## 3. Client-Side Authentication

Use the standard `useUserSession()` composable:
```vue
<script setup lang="ts">
const { user, loggedIn, clear, fetch } = useUserSession()

const handleLogout = async () => {
	await clear()
	await navigateTo('/')
}
</script>

<template>
	<div v-if="loggedIn">
		<span>Welcome, {{ user?.name }}</span>
		<button @click="handleLogout">Logout</button>
	</div>
	<div v-else>
		<NuxtLink to="/Auth">Sign In</NuxtLink>
	</div>
</template>
```

---

## 4. TypeScript Type Augmentation

User session payload types must be augmented in a declaration file (e.g. `src/app/types/auth.d.ts`):
```ts
declare module '#auth-utils' {
	interface User {
		id: string
		email: string
		name?: string | null
		profileImage?: string | null
		roles?: string[]
	}

	interface UserSession {
		user: User
		loggedInAt: number
	}
}
```

---

## 5. Security & Environment Configuration

- **`NUXT_SESSION_PASSWORD`**: Must be a secret string of at least 32 characters in `.env`.
- Cookies are encrypted via AES-256-GCM (iron-session standard) and transmitted with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production).

