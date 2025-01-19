import { format } from 'date-fns'
import type { ISearchParams, TSearchParams } from '~/helpers/search/types'
import { searchDataByQuery } from '../model/services/searchDataByQuery'

export default (filters: ISearchParams) => {
	const priceFromCheck = isNumber(filters.price_from) && filters.price_from >= 0
	const priceToCheck = isNumber(filters.price_to) && filters.price_to >= 0

	const allParams: TSearchParams = {
		...(filters.activityType && { activityType: filters.activityType }),
		...(filters.search && { search: filters.search }),
		...(filters.location && {
			location: filters.location,
		}),
		...(filters.categories?.length && {
			categories: filters.categories,
		}),
		...(filters.types?.length && { types: filters.types }),
		...(filters.date?.start && {
			date_start: format(filters.date.start, 'yyyy-MM-dd'),
		}),
		...(filters.date?.end && {
			date_end: format(filters.date.end, 'yyyy-MM-dd'),
		}),
		...(priceFromCheck && {
			price_from: filters.price_from,
		}),
		...(priceToCheck && { price_to: filters.price_to }),
		...(filters.count && { count: filters.count }),
		...(filters.page && { page: filters.page }),
	}

	return { fetch: searchDataByQuery(allParams) }
}
