import { getPractitionersByUserId } from '~/server/db/practitioners'
import { getUserById } from '~/server/db/users'
import { offeringTransformer } from '~/server/transformers/offering'
import { studioTransformer } from '~/server/transformers/studio'
import { userTransformer } from '~/server/transformers/user'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			status: 400,
			message: "Practitioner's id is missing",
		})
	}

	try {
		const user = await getUserById(id)
		const practitioners = await getPractitionersByUserId({
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
			id: practitioners[0].id,
			userId: id,
			studios: practitioners
				// @ts-ignore
				.map((el) => (el.studio ? studioTransformer(el.studio) : null))
				.filter((el) => el),
			offerings: practitioners
				// @ts-ignore
				.map((el) => (el.offering ? offeringTransformer(el.offering) : null))
				.filter((el) => el),
		}

		if (!user || !practitioner) {
			throw createError({
				status: 500,
				message: 'Practitioner is not found',
			})
		}

		return {
			data: {
				...userTransformer(user),
				offerings: practitioner.offerings,
				studios: practitioner.studios,
			},
			status: 'Success!',
		}
	} catch (error) {
		throw createError({
			status: 500,
			message: (error as Error).message,
		})
	}
})
