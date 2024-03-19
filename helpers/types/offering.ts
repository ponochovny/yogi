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

	studio: IStudio
	location: string[]
	timezone: string
	/**
	 * many-to-many relations
	 */
	practitioners: IUser[]
	// tickets: Ticket[]
	// status: 'active' | 'draft'
	// venue: 'offline' | 'online'
	// tags: string[]
	// memberships: any[]
	// dates: {start: Date; end: Date}[]
}

// export interface Ticket {
//   id: number
//   name: string
//   description: string
//   price: number
//   currency: string
//   fee: number
/**
 * Mandatory 1-1 relation
 */
//   offering: IOffering
// }
