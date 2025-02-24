/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import type { TSearchParams } from '~/src/app/types/search/types'
import { getOfferings } from '~/server/db/offerings'
import { getPractitioners } from '~/server/db/practitioners'
import { getStudios } from '~/server/db/studio'
import {
	getLowestAndHighestTicketPrice,
	getLowestAndHighestTicketPriceByOffering,
} from '~/server/helpers/offering'
import { offeringTransformer } from '~/server/transformers/offering'
import { studioTransformer } from '~/server/transformers/studio'
import { practitionerTransformer } from '~/server/transformers/user'
import type { IPractitionerResponse } from '~/server/types'
import type { IOfferingResponse } from '~/server/types/offering'
import type { IStudioResponse } from '~/server/types/studio'

const PAGE_COUNT_DEFAULT = 1
const PER_PAGE_DEFAULT = 20
const TYPES_QUERY_DEFAULT: string[] = []
const CATEGORIES_DEFAULT: string[] = []
const DATE_START_DEFAULT = null
const DATE_END_DEFAULT = null

export default defineEventHandler(async (event) => {
	const query = getQuery(event) as TSearchParams
	const {
		take,
		search = '',
		location = '',
		activityType: ACTIVITY_TYPE,
		page: PAGE_COUNT = PAGE_COUNT_DEFAULT,
		count: PER_PAGE = PER_PAGE_DEFAULT,
		types: TYPES_QUERY = TYPES_QUERY_DEFAULT,
		categories: CATEGORIES_QUERY = CATEGORIES_DEFAULT,
		date_start: DATE_START = DATE_START_DEFAULT,
		date_end: DATE_END = DATE_END_DEFAULT,
	} = query

	const page_meta = {
		page: +PAGE_COUNT,
		// count: PAGE_COUNT * PER_PAGE,
	}
	const splice_from = (PAGE_COUNT - 1) * PER_PAGE
	const splice_to = +PER_PAGE

	try {
		if (ACTIVITY_TYPE === 'Offerings') {
			const offerings = await getOfferings<IOfferingResponse[]>({
				include: {
					banners: true,
					tickets: true,
				},
				where: {
					name: {
						contains: typeof search !== 'string' ? '' : search,
						mode: 'insensitive',
					},
				},
				take: take ? +take : undefined,
			})
			let filteredOfferings = offerings.filter((offering) => {
				const byTypes = TYPES_QUERY.length
					? offering.types.some((type) => TYPES_QUERY.includes(type))
					: true
				const byCategories = CATEGORIES_QUERY.length
					? offering.categories.some((category) =>
							CATEGORIES_QUERY.includes(category)
					  )
					: true

				const isNoDates = !(DATE_START && DATE_END)
				const offeringStart = offering.start.valueOf()
				const filterStart = new Date(DATE_START as unknown as string)
					.setHours(0, 0, 0)
					.valueOf()
				const offeringEnd = offering.end.valueOf()
				const filterEnd = new Date(DATE_END as unknown as string)
					.setHours(23, 59, 59, 999)
					.valueOf()

				const isOfferingWithinRange =
					offeringStart <= filterEnd && offeringEnd >= filterStart

				const byDates = isNoDates ? true : isOfferingWithinRange

				const { minPrice, maxPrice } =
					getLowestAndHighestTicketPriceByOffering(offering)
				const byPrice = !(query.price_from && query.price_to)
					? true
					: minPrice <= +query.price_to && maxPrice >= +query.price_from

				return (
					byTypes && byCategories && byDates && byPrice && offering.isActive
				)
			})

			const total = filteredOfferings.length

			if (PAGE_COUNT && PER_PAGE) {
				filteredOfferings = filteredOfferings.splice(splice_from, splice_to)
			}

			const result = filteredOfferings.map((offering) =>
				offeringTransformer(offering)
			)

			const { minPrice, maxPrice } = getLowestAndHighestTicketPrice(result)

			return {
				data: result,
				meta: {
					...page_meta,
					total,
					min_price: minPrice,
					max_price: maxPrice,
				},
				status: 'Success!',
			}
		}

		if (ACTIVITY_TYPE === 'Studio & Event Hosts') {
			let studios = (await getStudios({
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
			})) as unknown as IStudioResponse[]

			const total = studios.length

			if (PAGE_COUNT && PER_PAGE) {
				studios = studios.splice(splice_from, splice_to)
			}

			return {
				data: studios.map((studio) => studioTransformer(studio)),
				meta: {
					...page_meta,
					total,
				},
				status: 'Success!',
			}
		}

		if (ACTIVITY_TYPE === 'Practitioners') {
			const practitioners = await getPractitioners<
				Promise<IPractitionerResponse[]>
			>({
				include: {
					user: true,
				},
				where: {
					user: {
						name: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
			})
			const pracs = [
				...practitioners.map((practitioner) =>
					practitionerTransformer(practitioner.user)
				),
			]
			let uniquePractitionersList = [
				...new Map(pracs.map((item: any) => [item.id, item])).values(),
			]
			const total = uniquePractitionersList.length

			if (PAGE_COUNT && PER_PAGE) {
				uniquePractitionersList = uniquePractitionersList.splice(
					splice_from,
					splice_to
				)
			}

			return {
				data: uniquePractitionersList,
				meta: {
					...page_meta,
					total,
				},
				status: 'Success!',
			}
		}
	} catch (error) {
		return {
			data: [],
			status: 'Error!',
			error,
		}
	}
})
