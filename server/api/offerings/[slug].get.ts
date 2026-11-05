import { OfferingRepo, toOfferingDto } from '~/server/domains/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const { slug } = getRouterParams(event)

	const offering = await OfferingRepo.findBySlug<IOfferingResponse | null>(slug, {
		include: {
			studio: {
				include: {
					logo: true,
					owner: true,
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
		where: {},
	})

	if (!offering) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is incorrect',
		})
	}

	return {
		data: toOfferingDto(offering),
		status: 'Success!',
	}
})
