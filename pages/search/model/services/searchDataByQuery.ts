import type { TOffering } from '~/helpers/types/offering'
import type { TStudio } from '~/helpers/types/studio'
import type { TUser } from '~/server/types'
import { convertSearchParamsToParamsURL } from '@/pages/search/_helpers'
import type { TSearchParams } from '~/helpers/search/types'

export const searchDataByQuery = (allParams: TSearchParams) => {
	const paramsURLString = convertSearchParamsToParamsURL(allParams).toString()

	return $fetch<{
		data: TOffering[] | TStudio[] | TUser[]
		meta: { total: number; min_price: number; max_price: number }
		error?: any
	}>('/api/search?' + paramsURLString)
}
