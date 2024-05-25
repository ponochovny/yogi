import { getOfferingById } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const offering = await getOfferingById<IOfferingResponse | null>(id, {
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
