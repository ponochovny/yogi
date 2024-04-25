import type { ITicketResponse } from '~/server/types/ticket'

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
	location: string
	start: Date
	end: Date
	banner: string[]
	slug: string
}
