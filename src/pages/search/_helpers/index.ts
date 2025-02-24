import _data from '~/src/app/mocks/offeringAttributes.json'
import { DATA_TYPES } from '~/src/app/constants'
import type { ISearchParams, TDataType } from '~/src/app/types/search/types'
import type { LocationQuery } from 'vue-router'
import type { TSearchParams } from '~/src/app/types/search/types'

import { format } from 'date-fns'

export const compareFilters = (
	filters: ISearchParams,
	newFilters: Partial<ISearchParams>
) => {
	const restFilters = useOmit(filters, [
		'page',
		'count',
		'total',
		'search',
		'location',
	])
	const restNewFilters = useOmit(newFilters, ['search', 'location'])

	const areSameFilters =
		JSON.stringify(restNewFilters) === JSON.stringify(restFilters)
	const isSameActivityType = newFilters.activityType === filters.activityType

	return { areSameFilters, isSameActivityType }
}

export const dataTypeValue = (value: string) => {
	return DATA_TYPES.includes(value as TDataType)
		? (value as TDataType)
		: DATA_TYPES[0]
}

export const searchDataByQuery = (
	query: LocationQuery
	// formData: { date: { start?: Date; end?: Date } }
) => {
	const _categories = _data.categories
	const _types = _data.types

	const activityType = dataTypeValue(query.activityType?.toString() || '')
	const types =
		query.types
			?.toString()
			.split(',')
			.filter((el: string) => _types.some((t) => t.name === el)) || []
	const categories =
		query.categories
			?.toString()
			.split(',')
			.filter((el: string) => _categories.some((c) => c.name === el)) || []
	const date = {
		start: query.start ? new Date(query.start.toString()) : undefined,
		end: query.end ? new Date(query.end.toString()) : undefined,
	}
	const dateRange = [
		query.start ? new Date(query.start as string) : new Date(),
		query.end ? new Date(query.end as string) : new Date(),
	]
	const search = query.search?.toString()
	const location = query.location?.toString()

	const price_from = query.price_from
		? +query.price_from?.toString()
		: undefined
	const price_to = query.price_to ? +query.price_to?.toString() : undefined

	return {
		activityType,
		types,
		categories,
		date,
		dateRange,
		search,
		location,
		price_from,
		price_to,
	}
}

export const setDataByRouteQuery = (
	query: LocationQuery,
	formData: ISearchParams,
	dateRange: Ref,
	priceRange: Ref
) => {
	const {
		activityType,
		search,
		location,
		types,
		categories,
		date,
		price_from,
		price_to,
		dateRange: _dateRange,
	} = searchDataByQuery(
		query
		// formData
	)

	formData.activityType = activityType
	formData.types = types
	formData.categories = categories
	formData.date = date
	formData.search = search
	formData.location = location

	formData.price_from = price_from
	formData.price_to = price_to
	if (price_from !== undefined && price_to !== undefined) {
		priceRange.value = [price_from, price_to]
	}

	dateRange.value = _dateRange
}

export const convertSearchParamsToParamsURL = (
	data: TSearchParams
): URLSearchParams => {
	const object: Record<string, string> = {
		...(data.search && { search: data.search }),
		...(data.location && { location: data.location }),
		...(data.types && { types: data.types.join(',') }),
		...(data.categories && { categories: data.categories.join(',') }),
		...(data.page && { page: data.page.toString() }),
		...(data.count && { count: data.count.toString() }),
		...(data.activityType && { activityType: data.activityType }),
		...(data.date_start && { date_start: data.date_start.toString() }),
		...(data.date_end && { date_end: data.date_end.toString() }),
		...(data.price_from !== undefined && {
			price_from: data.price_from.toString(),
		}),
		...(data.price_to && { price_to: data.price_to.toString() }),
		...(data.take && { take: data.take }),
	}

	return new URLSearchParams(object)
}
