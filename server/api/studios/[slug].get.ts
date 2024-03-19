import { getStudioBySlug } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'

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

	return {
		data: studioTransformer(studio),
		status: 'Success!',
	}
})
