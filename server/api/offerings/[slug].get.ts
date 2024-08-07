import { getOfferingBySlug } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const { slug } = getRouterParams(event)

	const offering = await getOfferingBySlug<IOfferingResponse | null>(slug, {
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
			tickets: true,
		},
		// @ts-ignore
		where: {},
	})

	if (!offering) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Slug is incorrect',
			})
		)
	}

	return {
		data: offeringTransformer(offering),
		status: 'Success!',
	}
})
