/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { ITicket } from '~/helpers/types/offering'

function convertNumberToPriceString(number: number): string {
	return (number / 100).toFixed(2)
}

export const ticketTransformer = (ticket: ITicket) => {
	const { offeringId, offering, ...rest } = ticket
	return {
		...rest,
		price: convertNumberToPriceString(rest.price),
		offering: offering
			? {
					name: offering.name,
					activity: offering.activity,
					location: offering.location,
					start: offering.start,
					end: offering.end,
					banner: offering.banners.map((el) => el.url),
					slug: offering.slug,
			  }
			: undefined,
	}
}
