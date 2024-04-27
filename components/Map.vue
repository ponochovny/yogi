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
		class="z-10"
	>
		<l-control position="bottomleft">
			<div class="flex gap-1 pb-2 items-center">
				<span class="text-white">Theme:</span>
				<Button btnSize="sm" @click="_theme = 0">1</Button>
				<Button btnSize="sm" @click="_theme = 1">2</Button>
				<Button btnSize="sm" @click="_theme = 2">3</Button>
			</div>
		</l-control>
		<l-control v-if="searchable" position="topleft">
			<div
				class="flex flex-col gap-1 opacity-80 hover:opacity-100 transition-opacity"
			>
				<Input
					@input="debounceSearch"
					:modelValue="_search"
					placeholder="Search"
				/>
				<div
					class="flex flex-col gap-1 bg-white rounded-lg p-2 shadow-md w-[300px] h-full max-h-[200px] overflow-y-auto border-gray-300 border"
				>
					<p v-if="!searchResults.length" class="text-gray-500 text-center">
						Place a marker or start typing.
					</p>
					<button
						v-for="feature of searchResults"
						:key="feature.place_name"
						class="p-2 rounded-md hover:bg-gray-100 text-left flex gap-2 items-center"
						@click="selectFeature(feature)"
					>
						<img
							v-if="feature.id.split('.')[0] === 'country'"
							:src="findFlagByCountryName(feature.place_name)"
							class="w-8 object-contain object-center shadow-md rounded-sm"
						/>
						{{ feature.place_name }}
					</button>
				</div>
			</div>
		</l-control>
		<l-tile-layer
			:url="tiles[_theme].url"
			:attribution="tiles[_theme].attrs || ''"
			:minZoom="tiles[_theme].minZoom || 0"
			:maxZoom="tiles[_theme].maxZoom || 20"
		/>

		<!-- MARKERS -->

		<l-marker
			v-for="marker of markers"
			:key="marker.name"
			:lat-lng="marker.coords"
		>
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
import type { IFeature, TMarker } from '~/helpers/types/map'
import { findFlagByCountryName } from '~/helpers'

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
	center?: number[]
	allowMarkerCreation?: boolean
	searchable?: boolean
	markers?: TMarker[]
	sMarker?: TMarker
}
const props = withDefaults(defineProps<IProps>(), {
	theme: 2,
	maxZoom: 18,
	minZoom: 3,
	zoom: 14,
	center: () => [0, 0],
	allowMarkerCreation: false,
	searchable: false,
})
const emit = defineEmits([
	'update:search',
	'features',
	'singleMarkerClick',
	'coordsClicked',
	'markerRemoved',
	'featureSelected',
])

const show = ref(false)
const _zoom = ref(14)
const _center = ref<number[]>([0, 0])
const _theme = ref<number>(1)
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

function shortenCoords(coords: number[]): number[] {
	return [+coords[0].toFixed(6), +coords[1].toFixed(6)]
}
/**
 * () => '14.121212, 10.111111'
 */
function coordsToStr(coords: number[]): string {
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

function setParams(coords: number[], zoomNumber: number) {
	const coordsWithXOffset: number[] = [coords[0], coords[1] - 0.001]
	_center.value = coordsWithXOffset
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
function newSingleMarker(coords: number[]) {
	if (singleMarker.value) {
		singleMarker.value = null

		isOnlyUpdateSearch.value = true
		emit('update:search', '')
		searchResults.value = []

		emit('markerRemoved')

		return
	}

	setSingleMarker({ name: coordsToStr(coords), coords })

	// request
	featuresByCoords(coords)

	// set search query for input
	// _search.value = ''
	isOnlyUpdateSearch.value = true
	emit('update:search', coordsToStr(coords))
}
function setSingleMarker(val: TMarker | null) {
	singleMarker.value = val
}
onMounted(() => {
	if (props.sMarker) {
		singleMarker.value = props.sMarker
	}
})
function selectFeature(feature: IFeature) {
	const { center, id, place_name } = feature
	const coords: number[] = [center[1], center[0]]
	const type = id.split('.')[0] || ''
	const zoom = zoomByType(type)
	setSingleMarker({ name: place_name, coords })
	setParams(coords, zoom)
	isOnlyUpdateSearch.value = true

	emit('featureSelected', feature)
	emit('update:search', place_name)
}

const { search: _search, searchResults, featuresByCoords, tiles } = useMyMap()

const debounceSearch = useDebounce((e) => {
	_search.value = e.target.value
}, 750)

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

	// _search.value = string
	emit('update:search', string)
	const feature: IFeature = {
		id: string,
		center: [coords[1], coords[0]],
		place_name: string,
	}
	emit('featureSelected', feature)

	searchResults.value = []
	setTimeout(() => emit('coordsClicked'), 0)
}

watch(
	() => props.markers,
	(val) => {
		console.log(val)
	}
)

defineExpose({ selectFeature })
</script>
