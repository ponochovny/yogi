import { identifyInputMapType } from '~/helpers'

export default () => {
	const search = ref('')
	watch(
		() => search.value,
		(val) => {
			const type = identifyInputMapType(val)

			if (type === 'coords') {
				const coords = val.split(',')
				featuresByCoords([+coords[0], +coords[1]])
			} else {
				featuresByText(val)
			}
		}
	)

	const searchResults = ref<any[]>([])

	async function featuresByCoords(coords: [number, number]) {
		const _coords = encodeURIComponent(`${coords[1]},${coords[0]}`)
		const res = await $fetch<any>('/api/map/search?coords=' + _coords)
		searchResults.value = res.data?.features || []
	}

	const featuresByText = useDebounce(async function (val: any) {
		const text = encodeURIComponent(val)
		const res = await $fetch<any>('/api/map/search?text=' + text)
		searchResults.value = res.data?.features || []
	}, 1000)

	return { search, searchResults, featuresByCoords }
}
