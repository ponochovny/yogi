import type { ITicketResponse } from '~/server/types/ticket'
import type { TMarker } from './map'

export type TTicket = Omit<
	ITicketResponse,
	'price' | 'offering' | 'offeringId'
> & {
	price_int: number
	price: string
	offering?: TTicketOffering
}

export type TTicketOffering = {
	name: string
	activity: 'appointment' | 'class' | 'event'
	location: TMarker
	start: Date
	end: Date
	banner: string[]
	slug: string
}
