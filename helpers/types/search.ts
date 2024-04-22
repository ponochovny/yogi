import type { IUser } from '~/server/types'
import type { IOffering } from './offering'
import type { IStudio } from './studio'
import type { DATA_TYPES } from '../constants'

export interface IShortSearchData {
	offerings: IOffering[]
	studios: IStudio[]
	practitioners: IUser[]
}

export type TDataType = (typeof DATA_TYPES)[number]
export interface ISearchParams {
	activeType: TDataType
	categories: string[]
	types: string[]
	date: {
		start?: Date
		end?: Date
	}
}

export interface ISearchData {}
