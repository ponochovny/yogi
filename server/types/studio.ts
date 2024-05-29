import type { TStudio } from '~/helpers/types/studio'
import type { IPractitionerResponse, IUserResponse } from '.'

export interface IStudioResponse {
	id: string
	slug: string
	name: string
	location: string
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
	ownerId: string
	createdAt: string
	updatedAt: string
	owner: IUserResponse
	logo: any[]
	banner: any[]
	practitioners: IPractitionerResponse[]
	isArchived?: boolean
}

export type TUpdateStudioData = Pick<
	TStudio,
	| 'bio'
	| 'currency'
	| 'mission'
	| 'name'
	| 'timezone'
	| 'owner'
	| 'categories'
	| 'types'
> & { location: string }

export type TCreateStudioData = Pick<
	TStudio,
	| 'bio'
	| 'currency'
	| 'mission'
	| 'name'
	| 'slug'
	| 'timezone'
	| 'owner'
	| 'categories'
	| 'types'
> & { location: string; ownerId: string }
