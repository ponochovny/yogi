import { getOfferings } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'

export default defineEventHandler(async () => {
	const offerings = await getOfferings({
		include: {
			studio: true,
			logo: true,
			banners: true,
		},
	})

	return {
		data: offerings.map((offering) => offeringTransformer(offering)),
		status: 'Success!',
	}
})
