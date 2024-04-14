import { identifyInputMapType } from '~/helpers'
import type { IFeature } from '~/helpers/types/map'

export default () => {
	const tiles = ref([
		{
			url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
			attrs:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
			minZoom: 0,
		},
		{
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attrs:
				'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
		},
		{
			url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg?api_key=79e5d829-f0f4-4d44-8698-54f19b6f3038',
			attrs:
				'&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

	async function featuresByCoords(coords: number[]) {
		const _coords = encodeURIComponent(`${coords[1]},${coords[0]}`)
		const res = await $fetch<any>('/api/map/search?coords=' + _coords)
		searchResults.value = res.data?.features || []
	}

	const featuresByText = useDebounce(async function (val: any) {
		const text = encodeURIComponent(val)
		const res = await $fetch<any>('/api/map/search?text=' + text)
		searchResults.value = res.data?.features || []
	}, 1000)

	return { search, tiles, searchResults, featuresByCoords }
}
