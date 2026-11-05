import type { TTicket, TTicketOffering } from '~/src/app/types/ticket'
import type { ITicketResponse } from '~/server/types/ticket'
import type { IOfferingResponse } from '~/server/types/offering'
import type { TMarker } from '~/src/app/types/map'
import { currencySymbolByCode } from '~/src/shared/helpers'

function convertNumberToPriceString(number: number): string {
	return (number / 100).toFixed(2)
}

function toTicketOffering(offering: IOfferingResponse): TTicketOffering {
	let location: TMarker = {
		name: offering.location,
		coords: [0, 0],
	}

	try {
		location = JSON.parse(offering.location)
	} catch {
		// location stays default
	}

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

export const toTicketDto = (ticket: ITicketResponse): TTicket => {
	const { offeringId, offering, ...rest } = ticket
	return {
		...rest,
		price_int: rest.price,
		price: currencySymbolByCode(rest.currency) + convertNumberToPriceString(+rest.price),
		offering: offering ? toTicketOffering(offering) : undefined,
	}
}

