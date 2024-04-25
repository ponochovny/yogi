import type { TDataType } from '~/helpers/types/search'
import { getOfferings } from '~/server/db/offerings'
import { getPractitioners } from '~/server/db/practitioners'
import { getStudios } from '~/server/db/studio'
import { offeringTransformer } from '~/server/transformers/offering'
import { studioTransformer } from '~/server/transformers/studio'
import { practitionerTransformer } from '~/server/transformers/user'
import type { IUser } from '~/server/types'

const PAGE_COUNT_DEFAULT = 1
const PER_PAGE_DEFAULT = 20
const TYPES_QUERY_DEFAULT: string[] = []
const CATEGORIES_DEFAULT: string[] = []
const DATE_START_DEFAULT = null
const DATE_END_DEFAULT = null

export default defineEventHandler(async (event) => {
	const query = getQuery(event) as {
		name?: string
		page?: number
		count?: number
		activityType?: TDataType
		types?: string[]
		categories?: string[]
		date_start?: string
		date_end?: string
	}
	const {
		name = '',
		activityType: ACTIVITY_TYPE,
		page: PAGE_COUNT = PAGE_COUNT_DEFAULT,
		count: PER_PAGE = PER_PAGE_DEFAULT,
		types: TYPES_QUERY = TYPES_QUERY_DEFAULT,
		categories: CATEGORIES_QUERY = CATEGORIES_DEFAULT,
		date_start: DATE_START = DATE_START_DEFAULT,
		date_end: DATE_END = DATE_END_DEFAULT,
	} = query

	if (ACTIVITY_TYPE === 'Offerings') {
		const offerings = await getOfferings({
			include: {
				banners: true,
			},
			where: {
				name: {
					contains: typeof name !== 'string' ? '' : name,
					mode: 'insensitive',
				},
			},
		})
		const filteredOfferings = offerings
			.filter((offering) => {
				return true
			})
			.map((offering) => offeringTransformer(offering))

		return {
			data: filteredOfferings,
			status: 'Success!',
		}
	}

	if (ACTIVITY_TYPE === 'Studio & Event Hosts') {
		const studios = await getStudios({
			include: {
				owner: true,
				logo: true,
				banner: true,
				practitioners: {
					include: {
						user: true,
					},
				},
			},
			where: {
				name: {
					contains: typeof name !== 'string' ? '' : name,
					mode: 'insensitive',
				},
			},
		})

		return {
			data: studios.map((studio) => studioTransformer(studio)),
			status: 'Success!',
		}
	}

	if (ACTIVITY_TYPE === 'Practitioners') {
		const practitioners = await getPractitioners({
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
		})
		const pracs = [
			...(
				practitioners as unknown as {
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

		return {
			data: uniquePractitionersList,
			status: 'Success!',
		}
	}
})
