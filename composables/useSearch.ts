import type { IGlobalSearch } from '~/helpers/types/search'

export default () => {
	const globalSearch = (val?: string) => {
		return $fetch<{
			data: IGlobalSearch
		}>('/api/search?name=' + (val ? val : ''))
	}

	return { globalSearch }
}
