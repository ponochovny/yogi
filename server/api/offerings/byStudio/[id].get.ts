import { getOfferingsByStudioId } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const offerings = await getOfferingsByStudioId({
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
			tickets: true,
		},
		// @ts-ignore
		where: {
			studioId: id,
		},
	})

	if (!offerings) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Id is incorrect',
			})
		)
	}

	return {
		data: offerings.map((offering) => offeringTransformer(offering)),
		status: 'Success!',
	}
})
