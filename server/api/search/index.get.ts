import { getOfferings } from '~/server/db/offerings'
import { offeringTransformer } from '~/server/transformers/offering'

const PAGE_COUNT_DEFAULT = 1
const PER_PAGE_DEFAULT = 20
const TYPES_QUERY_DEFAULT: string[] = []
const CATEGORIES_DEFAULT: string[] = []
const DATE_START_DEFAULT = null
const DATE_END_DEFAULT = null

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const {
		name,
		page: PAGE_COUNT = PAGE_COUNT_DEFAULT,
		count: PER_PAGE = PER_PAGE_DEFAULT,
		types: TYPES_QUERY = TYPES_QUERY_DEFAULT,
		categories: CATEGORIES_QUERY = CATEGORIES_DEFAULT,
		date_start: DATE_START = DATE_START_DEFAULT,
		date_end: DATE_END = DATE_END_DEFAULT,
	} = query

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
		})

		const filteredOfferings = offeringsList
			.filter((offering) => {
				return true
			})
			.map((offering) => offeringTransformer(offering))

		return {
			data: filteredOfferings,
			status: 'Success!',
		}
	} catch (error) {
		throw createError({ status: 500 })
	}
})
