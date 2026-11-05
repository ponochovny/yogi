import { PractitionerRepo, toOfferingDto } from '~/server/domains/offering'
import { toStudioDto } from '~/server/domains/studio'
import { UserRepo, toUserDto } from '~/server/domains/user'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Practitioner's id is missing",
		})
	}

	try {
		const user = await UserRepo.findById(id)
		const practitioners = await PractitionerRepo.findManyByUserId({
			where: {
				userId: id,
			},
			include: {
				studio: {
					include: {
						logo: true,
						banner: true,
					},
				},
				offering: true,
			},
		})

		const practitioner = {
			id: practitioners[0]?.id,
			userId: id,
			studios: practitioners
				// @ts-ignore
				.map((el) => (el.studio ? toStudioDto(el.studio) : null))
				.filter((el) => el),
			offerings: practitioners
				// @ts-ignore
				.map((el) => (el.offering ? toOfferingDto(el.offering) : null))
				.filter((el) => el),
		}

		if (!user || !practitioners.length) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Practitioner is not found',
			})
		}

		return {
			data: {
				...toUserDto(user),
				offerings: practitioner.offerings,
				studios: practitioner.studios,
			},
			status: 'Success!',
		}
	} catch (error: any) {
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.message || error.statusMessage || 'Internal error',
		})
	}
})
