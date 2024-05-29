import type { IOfferingResponse } from '~/server/types/offering'
import type { TMarker } from './map'
import type { TPractitioner } from '~/server/types'
import type { TStudio } from './studio'
import type { TTicket } from './ticket'

export interface IOfferingCreateData {
	name: string
	description: string
	activity: string
	slug: string
	categories: string[]
	types: string[]
	duration: number
	is_private: boolean
	spots: number
	timezone: string
	tickets: {
		name: string
		description: string
		price: string
		currency: string
	}[]
	start: Date
	end: Date
	banners: File[]
	practitioners: string[]
	location: TMarker | null
	studioId: string
	isActive: boolean
}

export interface IOfferingUpdateData extends IOfferingCreateData {
	practitionersRemove: string[]
	ticketsRemove: string[]
}

export type TOffering = Omit<
	IOfferingResponse,
	| 'createdAt'
	| 'updatedAt'
	| 'banners'
	| 'practitioners'
	| 'studio'
	| 'location'
	| 'tickets'
> & {
	isActive: boolean
	studio?: TStudio
	banners: { url: string }[]
	practitioners: TPractitioner[]
	location: TMarker
	tickets: TTicket[]
}
