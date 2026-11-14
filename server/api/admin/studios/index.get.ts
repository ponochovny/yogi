import { StudioRepo, toStudioDto } from '~/server/domains/studio'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event)
		const { limit } = query

		const studios = (await StudioRepo.findMany({
			include: {
				owner: true,
				logo: true,
				banner: true,
				practitioners: {
					include: {
						user: true,
					},
				},
				_count: {
					select: {
						offerings: true,
					},
				},
			},
			where: {
				owner: {
					id: event.context.auth.user.id,
				},
			},
			take: limit ? +limit : undefined,
		})) as unknown as IStudioResponse[]

		return {
			data: studios.map((studio) => toStudioDto(studio)),
			status: 'Success!',
		}
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: (error as Error).message,
		})
	}
})
