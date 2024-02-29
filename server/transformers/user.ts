import type { IUser } from '../types'

// Exclude keys from user
export function exclude<IUser, Key extends keyof IUser>(
	user: IUser,
	keys: Key[]
): Omit<IUser, Key> {
	// @ts-ignore
	return Object.fromEntries(
		// @ts-ignore
		Object.entries(user).filter(([key]) => !keys.includes(key))
	)
}

export const userTransformer = (user: IUser) => {
	const userTransformed = exclude(user, ['password'])
	return {
		...userTransformed,
	}
}
