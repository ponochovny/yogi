import { getOfferings } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { types, location, virtual } = query as {
		types?: string
		location?: string // TMarker
		virtual?: string // boolean
	}
	function filtered(offerings: IOfferingResponse[]): IOfferingResponse[] {
		return offerings.filter((offering) => {
			const byTypes = types
				? offering.types.some((type) => types.split(',').includes(type))
				: true
			const byVirtual = virtual ? offering.location === 'Online' : true
			const isActive = offering.isActive

			return byTypes && byVirtual && isActive
		})
	}

	try {
		const offerings = await getOfferings<IOfferingResponse[]>({
			include: {
				studio: {
					include: {
						logo: true,
					},
				},
				banners: true,
				practitioners: {
					include: {
						user: true,
					},
				},
			},
		})

		return {
			data: filtered(offerings).map((offering) =>
				offeringTransformer(offering)
			),
			status: 'Success!',
		}
	} catch (error) {
		return {
			data: [],
			status: 'Error!',
		}
	}
})
