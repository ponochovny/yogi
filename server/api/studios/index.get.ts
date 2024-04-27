import { getStudios } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	const { limit } = query

	const studios = await getStudios({
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
	})

	return {
		data: (studios as unknown as IStudioResponse[]).map((studio) =>
			studioTransformer(studio)
		),
		status: 'Success!',
	}
})
