import type { TUser, TPractitioner, TOwner, IUserResponse } from '~/server/types'

export const toUserDto = (user: IUserResponse): TUser => {
	const { password, createdAt, updatedAt, avatars, studio, ...rest } = user
	return { ...rest }
}

export const toPractitionerDto = (user: IUserResponse): TPractitioner => {
	const { password, createdAt, updatedAt, avatars, interestsCategory, interestsType, ...rest } = user
	return { ...rest }
}

export const toUserSearchDto = (user: IUserResponse) => {
	const { password, createdAt, updatedAt, interestsCategory, interestsType, email, ...rest } = user
	return { ...rest }
}

export const toOwnerDto = (user: IUserResponse & { _id: any }): TOwner => {
	const { password, createdAt, updatedAt, interestsCategory, interestsType, email, ...rest } = user
	return { ...rest }
}
