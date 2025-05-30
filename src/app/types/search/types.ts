import type { TOffering } from '../offering'
import type { TStudio } from '../studio'
import type { DATA_TYPES } from '../../constants'
import type { TUser } from '~/server/types'

export interface IShortSearchData {
	offerings: TOffering[]
	studios: TStudio[]
	practitioners: TUser[]
}

export type TDataType = (typeof DATA_TYPES)[number]
export interface ISearchParams {
	activityType: TDataType
	categories: string[]
	types: string[]
	date: {
		start?: Date
		end?: Date
	}
	page?: number
	count?: number
	price_from?: number
	price_to?: number
	total?: number
	search?: string
	location?: string
}

export interface ISearchData {}

export type TSearchParams = {
	search?: string
	location?: string
	page?: number
	count?: number
	activityType?: TDataType
	types?: string[]
	categories?: string[]
	date_start?: Date | string
	date_end?: Date | string
	price_from?: number
	price_to?: number
	take?: string
}
