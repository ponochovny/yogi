import { getStudios } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'

export default defineEventHandler(async (event) => {
	const studios = await getStudios({
		include: {
			owner: true,
			logo: true,
			banner: true,
		},
	})

	return {
		data: studios.map((studio) => studioTransformer(studio)),
		status: 'Success!',
	}
})
