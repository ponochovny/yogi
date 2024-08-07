import { getStudios } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event)

		const { limit } = query

		const studios = (await getStudios({
			include: {
				owner: true,
				logo: true,
				banner: true,
				practitioners: {
					include: {
						user: true,
					},
				},
			},
			take: limit ? +limit : undefined,
		})) as unknown as IStudioResponse[]

		return {
			data: studios
				.filter((studio) => !studio.isArchived)
				.map((studio) => studioTransformer(studio)),
			status: 'Success!',
		}
	} catch (error) {
		return createError({
			statusCode: 500,
			statusMessage: (error as Error).message,
		})
	}
})
