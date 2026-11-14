import type { TUser } from '~/server/types'

declare module '#auth-utils' {
	interface User extends TUser {}

	interface UserSession {
		loggedInAt: number
	}
}
