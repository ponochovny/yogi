import type { IOfferingResponse } from '~/server/types/offering'
import type { TOffering } from '~/src/app/types/offering'

export function getLowestAndHighestTicketPriceByOffering(offering: IOfferingResponse) {
	let minPrice = Infinity
	let maxPrice = -Infinity

	if (offering.tickets && offering.tickets.length > 0) {
		for (const ticket of offering.tickets) {
			minPrice = Math.min(minPrice, ticket.price)
			maxPrice = Math.max(maxPrice, ticket.price)
		}
	}

	return { minPrice, maxPrice }
}

export function getLowestAndHighestTicketPrice(offerings: TOffering[]) {
	let minPrice = Infinity
	let maxPrice = -Infinity

	offerings.forEach((offering) => {
		if (offering.tickets && offering.tickets.length > 0) {
			for (const ticket of offering.tickets) {
				minPrice = Math.min(minPrice, ticket.price_int)
				maxPrice = Math.max(maxPrice, ticket.price_int)
			}
		}
	})

	return { minPrice, maxPrice }
}
