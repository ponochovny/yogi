import type { IUser } from '../types'

export const userTransformer = (user: IUser) => {
	const { password, createdAt, updatedAt, ...rest } = user
	return {
		...rest,
	}
}

export const userSearchTransformer = (user: IUser) => {
	const {
		password,
		createdAt,
		updatedAt,
		interestsCategory,
		interestsType,
		email,
		...rest
	} = user
	return {
		...rest,
	}
}
