/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { TOffering } from '~/src/app/types/offering'
import type { IUserResponse } from '~/server/types'
import type { IOfferingResponse } from '~/server/types/offering'
import type { IStudioResponse } from '~/server/types/studio'
import type { TMarker } from '~/src/app/types/map'
import type { TTicket } from '~/src/app/types/ticket'
import { toMediaFileDto } from './mediaFile.dto'
import { toStudioDto } from '~/server/domains/studio/transformers/studio.dto'
import { toPractitionerDto } from '~/server/domains/user'
import { toTicketDto } from './ticket.dto'

export const toOfferingDto = (offering: IOfferingResponse, isTicketsFull?: boolean): TOffering => {
	const { createdAt, updatedAt, ...rest } = offering
	let location: TMarker = {
		name: offering.location,
		coords: [0, 0],
	}

	try {
		location = JSON.parse(offering.location)
	} catch {
		// location stays as default
	}

	const bannersExists = offering.banners && offering.banners.length
	const sortedBanners = () =>
		offering.banners
			.map(toMediaFileDto)
			.sort((a, b) =>
				typeof a.order === 'number' && typeof b.order === 'number' ? a.order - b.order : 0
			)

	return {
		...rest,
		banners: bannersExists ? sortedBanners() : [],
		practitioners: offering.practitioners
			? offering.practitioners.map((item: { user: IUserResponse }) => toPractitionerDto(item.user))
			: [],
		tickets: offering.tickets
			? offering.tickets
					.sort((a: any, b: any) => b.price - a.price)
					.map(toTicketDto)
					.filter((ticket: TTicket) => (isTicketsFull ? true : ticket.status === 'active'))
			: [],
		studio: offering.studio ? toStudioDto(offering.studio as IStudioResponse) : undefined,
		location,
	}
}
