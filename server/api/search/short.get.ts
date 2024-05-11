import { getOfferings } from '~/server/db/offerings'
import { getPractitioners } from '~/server/db/practitioners'
import { getStudios } from '~/server/db/studio'
import { offeringTransformer } from '~/server/transformers/offering'
import { studioTransformer } from '~/server/transformers/studio'
import { practitionerTransformer } from '~/server/transformers/user'
import type { IPractitionerResponse } from '~/server/types'
import type { IOfferingResponse } from '~/server/types/offering'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { name } = query

	if (typeof name !== 'string') {
		throw createError({ status: 400, statusMessage: 'Query is incorrect' })
	}

	try {
		const offeringsList = await getOfferings<IOfferingResponse[]>({
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
		const studiosList = (await getStudios({
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
		})) as unknown as IStudioResponse[]
		const practitionersList = await getPractitioners<IPractitionerResponse[]>({
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
			...practitionersList.map((practitioner) =>
				practitionerTransformer(practitioner.user)
			),
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
