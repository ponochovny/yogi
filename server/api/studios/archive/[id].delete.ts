import { OfferingRepo } from '~/server/domains/offering'
import { StudioRepo, toStudioDto } from '~/server/domains/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: 'Id is required' })
	}
	const { isArchived }: { isArchived: boolean } = await readBody(event)

	const studio = await StudioRepo.toggleArchive(id, isArchived)
	await OfferingRepo.updateManyByStudioId({ isActive: false }, id)

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
