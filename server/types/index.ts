import type { IStudioResponse } from './studio'

export type TUser = Omit<
	IUserResponse,
	'password' | 'createdAt' | 'updatedAt' | 'avatars'
>
export type TPractitioner = Omit<
	IUserResponse,
	| 'password'
	| 'createdAt'
	| 'updatedAt'
	| 'avatars'
	| 'interestsCategory'
	| 'interestsType'
>

export type TOwner = Omit<
	IUserResponse,
	| 'password'
	| 'createdAt'
	| 'updatedAt'
	| 'interestsCategory'
	| 'interestsType'
	| 'email'
>

export interface IUserResponse {
	id: string
	email: string
	password: string
	name: string | null
	profileImage: string | null
	bio: string | null
	interestsCategory: string[]
	interestsType: string[]

	avatars?: { url: string; id: string }[]

	studio?: IStudioResponse

	createdAt: Date
	updatedAt: Date
}

export interface IPractitionerResponse {
	id: string
	userId: string
	studioId: any
	offeringId: string
	user: IUserResponse
}

export interface IMediaFile {
	url: string
	providerPublicId: string
	bannerStudioId?: string | null
	logoStudioId?: string | null
	userId?: string
	logoOfferingId?: string | null
	bannerOfferingId?: string | null
}
