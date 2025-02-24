import type { TTicket, TTicketOffering } from '~/src/app/types/ticket'
import type { ITicketResponse } from '../types/ticket'
import type { IOfferingResponse } from '../types/offering'
import { currencySymbolByCode } from '~/src/shared/helpers'
import type { TMarker } from '~/src/app/types/map'

function convertNumberToPriceString(number: number): string {
	return (number / 100).toFixed(2)
}

export const ticketTransformer = (ticket: ITicketResponse): TTicket => {
	const { offeringId, offering, ...rest } = ticket
	const ticketOffering = (offering: IOfferingResponse): TTicketOffering => {
		let location: TMarker = {
			name: offering.location,
			coords: [0, 0],
		}
		async function parseLocation() {
			try {
				const t = JSON.parse(offering.location)
				location = t
			} catch (error) {
				//
			}
		}
		parseLocation()
		return {
			name: offering.name,
			activity: offering.activity,
			location,
			start: offering.start,
			end: offering.end,
			banner: offering.banners.map((el) => el.url),
			slug: offering.slug,
		}
	}
	return {
		...rest,
		price_int: rest.price,
		price:
			currencySymbolByCode(rest.currency) +
			convertNumberToPriceString(+rest.price),
		offering: offering ? ticketOffering(offering) : undefined,
	}
}
