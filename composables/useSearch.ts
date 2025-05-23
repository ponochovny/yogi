import type {
	ISearchData,
	IShortSearchData,
} from '~/src/app/types/search/types'

export default () => {
	const globalSearch = (val?: string) => {
		return $fetch<{
			data: ISearchData
		}>('/api/search?name=' + (val ? val : ''))
	}
	const shortSearch = (val?: string) => {
		return $fetch<{
			data: IShortSearchData
		}>('/api/search/short?name=' + (val ? val : ''))
	}

	return { globalSearch, shortSearch }
}
