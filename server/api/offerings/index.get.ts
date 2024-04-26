import { getOfferings } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async () => {
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
		data: offerings.map((offering) => offeringTransformer(offering)),
		status: 'Success!',
	}
})
