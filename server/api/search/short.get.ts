import { getOfferings } from '~/server/db/offerings'
import { getPractitioners } from '~/server/db/practitioners'
import { getStudios } from '~/server/db/studio'
import { offeringTransformer } from '~/server/transformers/offering'
import { studioTransformer } from '~/server/transformers/studio'
import { practitionerTransformer } from '~/server/transformers/user'
import type { IUser } from '~/server/types'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { name } = query

	if (typeof name !== 'string') {
		throw createError({ status: 400, statusMessage: 'Query is incorrect' })
	}

	try {
		const offeringsList = await getOfferings({
			include: {
				banners: true,
			},
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
			},
			take: 5,
		})
		const studiosList = await getStudios({
			include: {
				logo: true,
			},
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
			},
			take: 5,
		})
		const practitionersList = await getPractitioners({
			include: {
				user: true,
			},
			where: {
				user: {
					name: {
						contains: name,
						mode: 'insensitive',
					},
				},
			},
			take: 5,
		})
		const pracs = [
			...(
				practitionersList as unknown as {
					id: string
					userId: string
					studioId: string
					offeringId: string
					user: IUser
				}[]
			).map((practitioner) => practitionerTransformer(practitioner.user)),
		]
		const uniquePractitionersList = [
			...new Map(pracs.map((item: any) => [item.id, item])).values(),
		]

		const fullList = {
			offerings: [
				...offeringsList.map((offering) => offeringTransformer(offering)),
			],
			studios: [...studiosList.map((studio) => studioTransformer(studio))],
			practitioners: [...uniquePractitionersList],
		}

		return {
			data: fullList,
			status: 'Success!',
		}
	} catch (error) {
		throw createError({ status: 500 })
	}
})
