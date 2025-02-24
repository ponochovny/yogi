/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { TOffering } from '~/src/app/types/offering'
import type { IUserResponse } from '../types'
import type { IOfferingResponse } from '../types/offering'
import { mediaFileTransformer } from './mediaFiles'
import { studioTransformer } from './studio'
import { ticketTransformer } from './ticket'
import { practitionerTransformer } from './user'
import type { TMarker } from '~/src/app/types/map'
import type { TTicket } from '~/src/app/types/ticket'
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

	const bannersExists = offering.banners && offering.banners.length
	const sortedBanners = () =>
		offering.banners
			.map(mediaFileTransformer)
			.sort((a, b) =>
				typeof a.order === 'number' && typeof b.order === 'number'
					? a.order - b.order
					: 0
			)

	return {
		...rest,
		banners: bannersExists ? sortedBanners() : [],
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
