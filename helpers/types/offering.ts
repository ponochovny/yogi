import type { IUser } from '~/server/types'
import type { Media } from '.'
import type { IStudio } from './studio'

export interface IOffering {
	id: number
	slug: string
	activity: 'appointment' | 'class' | 'event'
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

	// Media
	// media: Media[]
	banners: any[]

	studio?: IStudio
	location: string[]
	timezone: string
	/**
	 * many-to-many relations
	 */
	practitioners: IUser[]
	tickets: ITicket[]
	// status: 'active' | 'draft'
	// venue: 'offline' | 'online'
	// tags: string[]
	// memberships: any[]
	// dates: {start: Date; end: Date}[]
}

export interface ITicket {
	id: string
	name: string
	description: string
	price: number
	currency: string
	// fee: number
	/**
	 * Mandatory 1-1 relation
	 */
	offering?: IOffering
	offeringId: string
	purchase?: any[]
}

export interface IOfferingCreation {
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
	practitioners: {
		id: string
	}[]
	location: string[]
	studioId: string
}
