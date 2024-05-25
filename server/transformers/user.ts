import type { TUser, IUserResponse, TPractitioner, TOwner } from '../types'

export const userTransformer = (user: IUserResponse): TUser => {
	const { password, createdAt, updatedAt, avatars, studio, ...rest } = user
	return {
		...rest,
	}
}

export const practitionerTransformer = (user: IUserResponse): TPractitioner => {
	const {
		password,
		createdAt,
		updatedAt,
		avatars,
		interestsCategory,
		interestsType,
		...rest
	} = user
	return {
		...rest,
	}
}

export const userSearchTransformer = (user: IUserResponse & { _id: any }) => {
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

export const ownerTransformer = (
	user: IUserResponse & { _id: any }
): TOwner => {
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

export const userSearchTransformerRaw = (
	user: IUserResponse & { _id: any }
) => {
	const { _id, ...rest } = userSearchTransformer(user)
	return {
		...rest,
		id: _id.$oid,
	}
}
