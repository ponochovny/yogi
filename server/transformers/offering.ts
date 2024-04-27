/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { TOffering } from '~/helpers/types/offering'
import type { IUserResponse } from '../types'
import type { IOfferingResponse } from '../types/offering'
import { mediaFileTransformer } from './mediaFiles'
import { studioTransformer } from './studio'
import { ticketTransformer } from './ticket'
import { practitionerTransformer } from './user'
import type { TMarker } from '~/helpers/types/map'
import type { TTicket } from '~/helpers/types/ticket'
import type { IStudioResponse } from '../types/studio'

// TODO: offering type
export const offeringTransformer = (
	offering: IOfferingResponse,
	isTicketsFull?: boolean
): TOffering => {
	const { createdAt, updatedAt, ...rest } = offering
	let location: TMarker = {
		name: offering.location,
		coords: [0, 0],
	}

	async function parseLocation() {
		try {
			const t = JSON.parse(offering.location)
			location = t
		} catch (error) {
			// console.log(
			// 	'error parsing location',
			// 	'=>',
			// 	offering.name,
			// 	'=>',
			// 	offering.location
			// )
		}
	}
	parseLocation()

	return {
		...rest,
		banners:
			offering.banners && offering.banners.length
				? offering.banners.map(mediaFileTransformer)
				: [],
		practitioners: offering.practitioners
			? offering.practitioners.map((item: { user: IUserResponse }) =>
					practitionerTransformer(item.user)
			  )
			: [],
		tickets: offering.tickets
			? offering.tickets
					.sort((a: any, b: any) => b.price - a.price)
					.map(ticketTransformer)
					.filter((ticket: TTicket) =>
						isTicketsFull ? true : ticket.status === 'active'
					)
			: [],
		studio: offering.studio
			? studioTransformer(offering.studio as IStudioResponse)
			: undefined,
		location,
	}
}
