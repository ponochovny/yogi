import type { IOfferingResponse } from '~/server/types/offering'
import type { TMarker } from './map'
import type { TPractitioner } from '~/server/types'
import type { TStudio } from './studio'
import type { TTicket } from './ticket'

export type TTicketCreate = {
	name: string
	description: string
	price: number
	currency: string
	status: 'active' | 'inactive'
}

export enum EActivity {
	CLASS = 'Class',
	APPOINTMENT = 'Appointment',
	EVENT = 'Event',
}

export interface IOfferingCreateData {
	name: string
	description: string
	activity: EActivity
	slug: string
	categories: string[]
	types: string[]
	duration: number
	is_private: boolean
	spots: number
	timezone: string
	tickets: TTicketCreate[]
	start: Date
	end: Date
	bannersDelete: string[]
	bannersOrder: (string | null)[]
	banners: (File | object)[]
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
	banners: { id?: string; url: string }[]
	practitioners: TPractitioner[]
	location: TMarker
	tickets: TTicket[]
}

import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export type TOfferingCreationData = Omit<
	IOfferingCreateData,
	| 'practitioners'
	// | 'banners'
	// | 'tickets'
	// | 'location'
	| 'bannersDelete'
	| 'bannersOrder'
> & {
	// location: string
	practitioners: string[]
}

export const offeringDataCreationSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string(),
	activity: z.nativeEnum(EActivity),
	slug: z.string(),
	categories: z.array(z.string()),
	types: z.array(z.string()),
	duration: z.number().min(1, { message: 'You must enter a duration' }),
	is_private: z.boolean(),
	spots: z.number().min(1, { message: 'You must enter a number of spots' }),
	timezone: z.string(),
	tickets: z.array(
		z.object({
			name: z.string().min(1, { message: 'Ticket name is required' }),
			description: z.string(),
			price: z.number().min(1, { message: 'Ticket price is required' }),
			currency: z.string(),
			status: z.union([z.literal('active'), z.literal('inactive')]),
		})
	),
	start: z.date(),
	end: z.date(),
	bannersDelete: z.array(z.string()).optional(),
	bannersOrder: z.array(z.string()).optional(),
	banners: z.array(z.instanceof(File).or(z.object({}))),
	practitioners: z.array(z.string()),
	location: z.object({
		coords: z.array(z.number()),
		name: z.string().min(1, { message: 'Location is required' }),
	}),
	// .optional()
	// .transform((value) => {
	// 	if (!value) return null
	// 	return JSON.parse(value)
	// }),
	studioId: z.string(),
	isActive: z.boolean(),
})

export const offeringDataCreationSchemaTyped = toTypedSchema<
	z.ZodType<TOfferingCreationData>
>(offeringDataCreationSchema)

// interface IOfferingCreationData {
// 	name: string
// 	start: Date
// 	end: Date
// 	activity: 'appointment' | 'class' | 'event'
// 	duration:
// 	description: '',
// 	spots: '',
// 	is_private: false,
// 	categories: [],
// 	types: [],
// 	location: null,
// 	timezone: 'timezone',
// 	practitioners: [],
// 	tickets: [
// 		{
// 			name: '',
// 			description: '',
// 			price: '',
// 			currency: 'usd',
// 			status: 'active',
// 		},
// 	],
// 	practitioners: [''],
// 	activity: 'appointment',
// 	location: {
// 		coords: formData.location
// 			? [formData.location?.center[1], formData.location?.center[0]]
// 			: [],
// 		name: formData.location?.place_name || '',
// 	},
// 	duration: +formData.duration,
// 	spots: +formData.spots,
// 	start: new Date(formData.start),
// 	end: new Date(formData.end),
// 	bannersDelete: bannersDelete.value,
// 	bannersOrder: bannersOrder.value,
// 	banners: bannersFiles.value,
// 	studioId: isArray(studioId) ? (studioId[0] as string) : (studioId as string),
// 	isActive: false,
// }
