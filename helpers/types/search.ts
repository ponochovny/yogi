import type { IUser } from '~/server/types'
import type { IOffering } from './offering'
import type { IStudio } from './studio'

export interface IGlobalSearch {
	offerings: IOffering[]
	studios: IStudio[]
	practitioners: IUser[]
}
