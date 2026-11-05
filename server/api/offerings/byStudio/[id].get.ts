import { OfferingRepo, toOfferingDto } from '~/server/domains/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)

	const offerings = await OfferingRepo.findManyByStudioId<IOfferingResponse[]>({
		include: {
			studio: {
				include: {
					logo: true,
				},
			},
			banners: true,
			practitioners: {
				include: {
					user: true,
				},
			},
			tickets: true,
		},
		// @ts-ignore
		where: {
			studioId: id,
		},
	})

	if (!offerings) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Id is incorrect',
		})
	}

	return {
		data: offerings.map((offering) => toOfferingDto(offering)),
		status: 'Success!',
	}
})
