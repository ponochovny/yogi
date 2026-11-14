import { StudioRepo, toStudioDto } from '~/server/domains/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const { slug } = getRouterParams(event)
	if (!slug) {
		throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
	}

	const studio = await StudioRepo.findBySlug(slug, {
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
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is incorrect',
		})
	}

	return {
		data: toStudioDto(studio as unknown as IStudioResponse),
		status: 'Success!',
	}
})
