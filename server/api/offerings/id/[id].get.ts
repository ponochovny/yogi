import { OfferingRepo, toOfferingDto } from '~/server/domains/offering'
import type { IOfferingResponse } from '~/server/types/offering'

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event)
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: 'Id is required' })
	}

	const offering = await OfferingRepo.findById<IOfferingResponse | null>(id, {
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
