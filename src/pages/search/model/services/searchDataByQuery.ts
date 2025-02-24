import type { TOffering } from '~/src/app/types/offering'
import type { TStudio } from '~/src/app/types/studio'
import type { TUser } from '~/server/types'
import { convertSearchParamsToParamsURL } from '@/src/pages/search/_helpers'
import type { TSearchParams } from '~/src/app/types/search/types'

export const searchDataByQuery = (allParams: TSearchParams) => {
	const paramsURLString = convertSearchParamsToParamsURL(allParams).toString()

	return $fetch<{
		data: TOffering[] | TStudio[] | TUser[]
		meta: { total: number; min_price: number; max_price: number }
		error?: any
	}>('/api/search?' + paramsURLString)
}
