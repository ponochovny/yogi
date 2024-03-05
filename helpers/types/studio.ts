import type { IUser } from '~/server/types'

export interface IStudio {
	id: string
	name: string
	location: string[]
	timezone: string
	currency: string
	categories: string[]
	types: string[]

	// Media files
	logo: { url: string }[]
	banner: string

	// TODO: add tag interface
	// tags: Tag[]
	tags: any[]
	bio: string
	mission: string

	// Owner
	owner: IUser
	ownerId: string
}
