import { OfferingRepo, toOfferingDto, PractitionerRepo } from '~/server/domains/offering'
import { StudioRepo, toStudioDto } from '~/server/domains/studio'
import { toPractitionerDto } from '~/server/domains/user'
import type { IPractitionerResponse } from '~/server/types'
import type { IOfferingResponse } from '~/server/types/offering'
import type { IStudioResponse } from '~/server/types/studio'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { name } = query

	if (typeof name !== 'string') {
		throw createError({ statusCode: 400, statusMessage: 'Query is incorrect' })
	}

	try {
		const offeringsList = await OfferingRepo.findMany<IOfferingResponse[]>({
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
		const studiosList = (await StudioRepo.findMany({
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
		const practitionersList = await PractitionerRepo.findMany<
			IPractitionerResponse[]
		>({
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
				toPractitionerDto(practitioner.user)
			),
		]
		const uniquePractitionersList = [
			...new Map(pracs.map((item: any) => [item.id, item])).values(),
		]

		const fullList = {
			offerings: [
				...offeringsList.map((offering) => toOfferingDto(offering)),
			],
			studios: [...studiosList.map((studio) => toStudioDto(studio))],
			practitioners: [...uniquePractitionersList],
		}

		return {
			data: fullList,
			status: 'Success!',
		}
	} catch (error) {
		throw createError({ statusCode: 500 })
	}
})
