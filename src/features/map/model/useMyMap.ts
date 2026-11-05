import { identifyInputMapType } from '~/src/shared/helpers'
import type { IFeature } from '~/src/app/types/map'

export const useMyMap = () => {
	const tiles = ref([
		{
			url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
			attrs:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
			minZoom: 0,
		},
		{
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attrs: '',
		},
		{
			url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg?api_key=79e5d829-f0f4-4d44-8698-54f19b6f3038',
			attrs:
				'<a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			maxZoom: 20,
			minZoom: 0,
		},
	])

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

	const searchResults = ref<IFeature[]>([])

	function fetchFeaturesByCoords(coords: number[]) {
		const coordsParam = encodeURIComponent(`${coords[1]},${coords[0]}`)
		return $fetch<any>('/api/map/search?coords=' + coordsParam)
	}

	function fetchFeaturesByText(val: any) {
		const text = encodeURIComponent(val)
		return $fetch<any>('/api/map/search?text=' + text)
	}

	async function featuresByCoords(coords: number[]) {
		const res = await fetchFeaturesByCoords(coords)
		searchResults.value = res.data?.features || []
	}

	const featuresByText = useDebounce(async function (val: any) {
		const res = await fetchFeaturesByText(val)
		searchResults.value = res.data?.features || []
	}, 1000)

	return {
		search,
		tiles,
		searchResults,
		featuresByCoords,
		fetchFeaturesByCoords,
	}
}
