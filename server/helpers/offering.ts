import type { TOffering } from '~/helpers/types/offering'
import type { IOfferingResponse } from '../types/offering'

export function getLowestAndHighestTicketPriceByOffering(
	offering: IOfferingResponse
) {
	let minPrice = Infinity
	let maxPrice = -Infinity

	if (offering.tickets && offering.tickets?.length > 0) {
		const localMaxPrice = offering.tickets[0].price
		const localMinPrice = offering.tickets[offering.tickets.length - 1].price

		if (localMaxPrice > maxPrice) maxPrice = localMaxPrice
		if (localMinPrice < minPrice) minPrice = localMinPrice
	}

	return {
		minPrice,
		maxPrice,
	}
}
export function getLowestAndHighestTicketPrice(offerings: TOffering[]) {
	let minPrice = Infinity
	let maxPrice = -Infinity

	offerings.forEach((offering) => {
		if (offering.tickets.length > 0) {
			const localMaxPrice = offering.tickets[0].price_int
			const localMinPrice =
				offering.tickets[offering.tickets.length - 1].price_int

			if (localMaxPrice > maxPrice) maxPrice = localMaxPrice
			if (localMinPrice < minPrice) minPrice = localMinPrice
		}
	})

	return {
		minPrice,
		maxPrice,
	}
}
