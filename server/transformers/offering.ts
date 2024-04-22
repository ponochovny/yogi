/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { ITicket } from '~/helpers/types/offering'
import type { IUser } from '../types'
import { mediaFileTransformer } from './mediaFiles'
import { studioTransformer } from './studio'
import { ticketTransformer } from './ticket'
import { practitionerTransformer } from './user'
import type { TMarker } from '~/helpers/types/map'

// TODO: offering type
export const offeringTransformer = (offering: any, isTicketsFull?: boolean) => {
	if (!offering) return null

	let location: TMarker = {
		name: offering.location,
		coords: [0, 0],
	}

	async function parseLocation() {
		try {
			const t = JSON.parse(offering.location)
			location = t
		} catch (error) {
			console.log(
				'error parsing location',
				'=>',
				offering.name,
				'=>',
				offering.location
			)
		}
	}
	parseLocation()

	return {
		...offering,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
		practitioners: offering.practitioners
			? offering.practitioners.map((item: { user: IUser }) =>
					practitionerTransformer(item.user)
			  )
			: undefined,
		tickets: offering.tickets
			? offering.tickets
					.sort((a: any, b: any) => b.price - a.price)
					.map(ticketTransformer)
					.filter((ticket: ITicket) =>
						isTicketsFull ? true : ticket.status === 'active'
					)
			: [],
		studio: studioTransformer(offering.studio),
		location,
	}
}
