// import { getOfferings } from '~/server/db/offerings'
// import { offeringTransformer } from '~/server/transformers/offering'

import { getOfferingBySlug } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'

export default defineEventHandler(async (event) => {
	const { slug } = getRouterParams(event)

	const offering = await getOfferingBySlug(slug, {
		include: {
			studio: {
				include: {
					logo: true,
					owner: true,
				},
			},
			banners: true,
			practitioners: {
				include: {
					user: true,
				},
			},
		},
		// @ts-ignore
		where: {},
	})
	// const test = event.context.params
	// const offerings = await getOfferings({
	// 	include: {
	// 		studio: {
	// 			include: {
	// 				logo: true,
	// 			},
	// 		},
	// 		banners: true,
	// 		practitioners: {
	// 			include: {
	// 				user: true,
	// 			},
	// 		},
	// 	},
	// })

	return {
		// data: offerings.map((offering) => offeringTransformer(offering)),
		data: offeringTransformer(offering),
		status: 'Success!',
	}
})
