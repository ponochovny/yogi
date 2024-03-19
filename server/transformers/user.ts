import type { IUser } from '../types'

export const userTransformer = (user: IUser) => {
	const { password, createdAt, updatedAt, ...rest } = user
	return {
		...rest,
	}
}

export const practitionerTransformer = (user: IUser) => {
	const {
		password,
		createdAt,
		updatedAt,
		interestsCategory,
		interestsType,
		...rest
	} = user
	return {
		...rest,
	}
}

export const userSearchTransformer = (user: IUser & { _id: any }) => {
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

export const ownerTransformer = (user: IUser & { _id: any }) => {
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

export const userSearchTransformerRaw = (user: IUser & { _id: any }) => {
	const { _id, ...rest } = userSearchTransformer(user)
	return {
		...rest,
		id: _id.$oid,
	}
}
