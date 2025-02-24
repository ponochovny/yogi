import type { EActivity } from '~/src/app/types/offering'
import type { IPractitionerResponse } from '.'
import type { IStudioResponse } from './studio'
import type { ITicketResponse } from './ticket'

export interface IOfferingResponse {
	id: string
	slug: string
	activity: EActivity
	name: string
	start: Date
	end: Date
	/**
	 * In ms. <24h
	 */
	duration: number
	description: string
	spots: number
	is_private: boolean
	types: string[]
	categories: string[]

	// media: Media[]
	banners: IBanner[]

	studioId: string

	studio?: IStudioResponse
	practitioners?: IPractitionerResponse[]
	tickets?: ITicketResponse[]

	location: string
	timezone: string

	isActive: boolean

	createdAt: string
	updatedAt: string

	// status: 'active' | 'draft'
	// venue: 'offline' | 'online'
	// tags: string[]
	// memberships: any[]
	// dates: {start: Date; end: Date}[]
}

export interface IBanner {
	id?: string
	url: string
	providerPublicId: string
	createdAt: string
	updatedAt: string
	logoStudioId: string | null
	bannerStudioId: string | null
	userId: string | null
	bannerOfferingId: string | null
	order?: number
}
