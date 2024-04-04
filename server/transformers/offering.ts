/* eslint-disable indent */
import type { ITicket } from '~/helpers/types/offering'
import type { IUser } from '../types'
import { mediaFileTransformer } from './mediaFiles'
import { studioTransformer } from './studio'
import { ticketTransformer } from './ticket'
import { practitionerTransformer } from './user'

// TODO: offering type
export const offeringTransformer = (offering: any, isTicketsFull?: boolean) => {
	return {
		...offering,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
		practitioners: offering.practitioners.map((item: { user: IUser }) =>
			practitionerTransformer(item.user)
		),
		tickets: offering.tickets
			? offering.tickets
					.sort((a: any, b: any) => b.price - a.price)
					.map(ticketTransformer)
					.filter((ticket: ITicket) =>
						isTicketsFull ? true : ticket.status === 'active'
					)
			: [],
		studio: studioTransformer(offering.studio),
	}
}
