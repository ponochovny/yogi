<template>
	<l-map
		v-if="show"
		ref="map"
		v-model:zoom="_zoom"
		v-model:center="_center"
		:useGlobalLeaflet="false"
		@click="mapClicked"
		:maxZoom="maxZoom"
		:minZoom="minZoom"
	>
		<l-control position="bottomleft">
			<div class="flex gap-1 pb-4">
				<Button btnSize="sm" @click="_theme = 0">Theme 1</Button>
				<Button btnSize="sm" @click="_theme = 1">Theme 2</Button>
				<Button btnSize="sm" @click="_theme = 2">Theme 3</Button>
			</div>
		</l-control>
		<l-tile-layer
			:url="tiles[_theme].url"
			:attribution="tiles[_theme].attrs || ''"
			:minZoom="tiles[_theme].minZoom || 0"
			:maxZoom="tiles[_theme].maxZoom || 20"
		/>

		<!-- SINGLE MARKER -->
		<l-marker
			v-if="singleMarker"
			:lat-lng="singleMarker.coords"
			@click="emit('singleMarkerClick')"
		>
			<!-- <l-tooltip class="test" :options="{ offset: [14, -16] }">
				{{ singleMarker[0].toFixed(6) + ',' + singleMarker[1].toFixed(6) }}
			</l-tooltip> -->
			<l-popup
				v-if="
					singleMarker.name === coordsToStr(singleMarker.coords) && singleMarker
				"
				:options="{ offset: [-18, 10] }"
				className=""
			>
				<button @click.stop="coordsClicked" class="underline text-orange-600">
					{{ `${singleMarker.coords[0]},${singleMarker.coords[1]}` }}
				</button>
			</l-popup>
			<l-icon
				:icon-size="[40, 40]"
				:icon-anchor="[19, 40]"
				:popup-anchor="[20, -40]"
				class-name="bg-none"
			>
				<div class="w-6 h-6">
					<MapPinIcon
						class="w-10 text-orange-600 stroke-[0.5px] stroke-black"
					/>
				</div>
			</l-icon>
		</l-marker>
	</l-map>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import {
	LMap,
	LMarker,
	LTileLayer,
	// LTooltip,
	LIcon,
	LPopup,
	LControl,
} from '@vue-leaflet/vue-leaflet'
import { MapPinIcon } from '@heroicons/vue/24/solid'
import type { IFeature, TCoords, TMarker } from '~/helpers/types/map'

export default defineComponent({
	name: 'Map2',
})
</script>
<script lang="ts" setup>
interface IProps {
	search?: string
	theme?: number
	maxZoom?: number
	minZoom?: number
	zoom?: number
	center?: TCoords
	allowMarkerCreation?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
	theme: 2,
	maxZoom: 18,
	minZoom: 3,
	zoom: 14,
	center: () => [0, 0],
	allowMarkerCreation: false,
})
const emit = defineEmits([
	'update:search',
	'features',
	'replaceSearch',
	'singleMarkerClick',
	'coordsClicked',
])

const show = ref(false)
const _zoom = ref(14)
const _center = ref<TCoords>([0, 0])
const _theme = ref<number>(2)
// watch(
// 	() => [props.zoom, props.center, props.theme],
// 	([newZoom, newCenter, newTheme], [oldZoom, oldCenter, oldTheme]) => {
// 		if (typeof newZoom === 'number' && typeof oldZoom === 'number') {
// 			if (oldZoom !== newZoom) {
// 				_zoom.value = newZoom
// 			}
// 		}
// 		if (typeof newCenter !== 'number' && typeof oldCenter !== 'number') {
// 			if (oldCenter[0] !== newCenter[0]) {
// 				_center.value = newCenter
// 			}
// 		}
// 		if (newTheme !== oldTheme && typeof newTheme === 'number') {
// 			_theme.value = newTheme
// 		}
// 	}
// )
onMounted(() => {
	_zoom.value = props.zoom
	_center.value = props.center
	_theme.value = props.theme
	show.value = true
})

function shortenCoords(coords: TCoords): TCoords {
	return [+coords[0].toFixed(6), +coords[1].toFixed(6)]
}
/**
 * () => '14.121212, 10.111111'
 */
function coordsToStr(coords: TCoords): string {
	return `${coords[0]},${coords[1]}`
}
function zoomByType(type: string) {
	if (type === 'country') {
		return 6
	}
	if (type === 'place') {
		return 11
	}
	return 17
}

function setParams(coords: TCoords, zoomNumber: number) {
	_center.value = coords
	setTimeout(() => {
		_zoom.value = zoomNumber
	}, 250)
}

function mapClicked(e: { latlng: { lat: number; lng: number } }) {
	if (!props.allowMarkerCreation) return

	newSingleMarker(shortenCoords([e.latlng.lat, e.latlng.lng]))
}

const isOnlyUpdateSearch = ref(false)
const singleMarker = ref<TMarker | null>(null)
function newSingleMarker(coords: TCoords) {
	if (singleMarker.value) {
		singleMarker.value = null

		isOnlyUpdateSearch.value = true
		emit('update:search', '')
		searchResults.value = []

		return
	}

	setSingleMarker({ name: coordsToStr(coords), coords })

	// request
	featuresByCoords(coords)

	// set search query for input
	// emit('replaceSearch', '')
	// _search.value = ''
	isOnlyUpdateSearch.value = true
	emit('update:search', coordsToStr(coords))
}
function setSingleMarker(val: TMarker | null) {
	singleMarker.value = val
}
function selectFeature(feature: IFeature) {
	const { center, id, place_name } = feature
	const coords: TCoords = [center[1], center[0]]
	const type = id.split('.')[0]
	const zoom = zoomByType(type)
	setSingleMarker({ name: place_name, coords })
	setParams(coords, zoom)
	isOnlyUpdateSearch.value = true

	// emit('replaceSearch', place_name)
	// _search.value = place_name
	emit('update:search', place_name)
}

const { search: _search, searchResults, featuresByCoords, tiles } = useMyMap()

watch(
	() => props.search,
	(newPropSearch, oldPropSearch) => {
		if (isOnlyUpdateSearch.value) {
			isOnlyUpdateSearch.value = false
			return
		}
		if (!newPropSearch) return

		if (newPropSearch !== oldPropSearch && newPropSearch !== _search.value) {
			_search.value = newPropSearch ? newPropSearch : ''
		}
	},
	{ immediate: true }
)
watch(
	() => _search.value,
	(newSearch, oldSearch) => {
		if (
			newSearch !== oldSearch &&
			newSearch !== props.search &&
			!isOnlyUpdateSearch.value
		) {
			emit('update:search', newSearch)
		}
		if (isOnlyUpdateSearch.value) isOnlyUpdateSearch.value = false
	},
	{ immediate: true }
)
watch(
	() => searchResults.value,
	(val) => emit('features', val)
)

function coordsClicked() {
	if (!singleMarker.value) return

	const { coords } = singleMarker.value

	const string = coordsToStr(coords)
	isOnlyUpdateSearch.value = true

	// emit('replaceSearch', string)
	// _search.value = string
	emit('update:search', string)

	searchResults.value = []
	setTimeout(() => emit('coordsClicked'), 0)
}

defineExpose({ selectFeature })
</script>
