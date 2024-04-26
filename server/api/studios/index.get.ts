import { getStudios } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
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
	})

	return {
		data: (studios as unknown as IStudioResponse[]).map((studio) =>
			studioTransformer(studio)
		),
		status: 'Success!',
	}
})
