import { getStudioBySlug } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const { slug } = getRouterParams(event)

	const studio = await getStudioBySlug(slug, {
		include: {
			logo: true,
			owner: true,
			banner: true,
			practitioners: {
				include: {
					user: true,
				},
			},
		},
		// @ts-ignore
		where: {},
	})

	if (!studio) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Slug is incorrect',
			})
		)
	}

	return {
		data: studioTransformer(studio as unknown as IStudioResponse),
		status: 'Success!',
	}
})
