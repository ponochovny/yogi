import type { TOffering } from './offering'
import type { TStudio } from './studio'
import type { DATA_TYPES } from '../constants'
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
}

export interface ISearchData {}
