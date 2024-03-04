import type { IUser } from '../types'

export const userTransformer = (user: IUser) => {
	const { password, createdAt, updatedAt, ...rest } = user
	return {
		...rest,
	}
}
