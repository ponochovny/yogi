import { updateOfferingsByStudioId } from '~/server/db/offerings'
import { toggleArchiveStudioById } from '~/server/db/studio'
import { studioTransformer } from '~/server/transformers/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)
	const { isArchived }: { isArchived: boolean } = await readBody(event)

	const studio = await toggleArchiveStudioById(id, isArchived)
	await updateOfferingsByStudioId({ isActive: false }, id)

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
