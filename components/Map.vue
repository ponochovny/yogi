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
		<l-tile-layer
			url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			:attribution="attr"
			:minZoom="0"
			:maxZoom="19"
		/>
		<!-- <l-tile-layer
			v-if="_theme === 1"
			url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
			:minZoom="0"
			:maxZoom="20"
		/>
		<l-tile-layer
			v-if="_theme === 2"
			url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
			layer-type="base"
			name="OpenStreetMap"
		/>
		<l-tile-layer
			v-if="_theme === 3"
			url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
			:maxZoom="20"
		/>
		<l-tile-layer
			v-if="_theme === 4"
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			layer-type="base"
			name="OpenStreetMap"
		/> -->

		<!--  -->
		<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="20"
				/> -->
		<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="18"
				/> -->
		<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="18"
				/> -->
		<!-- <l-tile-layer
			url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
			:minZoom="0"
			:maxZoom="20"
		/> -->

		<!-- MARKERS -->
		<!-- <l-marker
			v-for="marker of markers"
			:key="marker.coords[0]"
			:lat-lng="marker.coords"
		>
			<l-popup :options="{ offset: [-12, 10] }" className="bg-red-300">
				Hello!
			</l-popup>
			<l-tooltip class="test" :options="{ offset: [12, -10] }">
				test
			</l-tooltip>
			<l-icon
				:icon-size="[24, 24]"
				:icon-anchor="[14, 23]"
				:popup-anchor="[12, -24]"
				class-name="bg-none"
			>
				<div class="w-6 h-6">
					<MapPinIcon
						class="w-6 text-orange-600 shadow-lg stroke-[0.5px] stroke-black"
					/>
				</div>
			</l-icon>
		</l-marker> -->

		<!-- SINGLE MARKER -->
		<l-marker
			v-if="singleMarker"
			:lat-lng="singleMarker"
			@click="emit('singleMarkerClick')"
		>
			<l-popup
				v-if="!search && singleMarker"
				:options="{ offset: [-18, 10] }"
				className=""
			>
				<button @click.stop="coordsClicked" class="underline text-orange-600">
					{{ singleMarker[0].toFixed(6) + ',' + singleMarker[1].toFixed(6) }}
				</button>
			</l-popup>
			<!-- <l-tooltip class="test" :options="{ offset: [14, -16] }">
				{{ singleMarker[0].toFixed(6) + ',' + singleMarker[1].toFixed(6) }}
			</l-tooltip> -->
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
		<!-- <l-control position="topleft">
			<div class="flex flex-col gap-2 max-w-96">
				<Input
					v-model="search"
					@update:model-value="throttleSearch"
					placeholder="Search address"
				/>
				<div
					v-show="searchResults.length && isOpenList"
					class="flex flex-col bg-white gap-y-1 px-3 py-3 rounded-md"
				>
					<button
						v-for="(place, idx) of searchResults"
						:key="idx"
						@click="
							addOtherMarker(
								[place.center[1], place.center[0]],
								place.id.split('.')[0]
							)
						"
						class="hover:bg-gray-100 rounded-md px-2 py-2 text-left text-sm flex gap-2 items-center"
					>
						<img
							v-if="place.id.split('.')[0] === 'country'"
							:src="findFlagByCountryName(place.text)"
							class="w-8 object-contain"
						/>
						<span>{{ place?.place_name || '' }}</span>
					</button>
				</div>
			</div>
		</l-control> -->
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
	// LControl,
} from '@vue-leaflet/vue-leaflet'
import { MapPinIcon } from '@heroicons/vue/24/solid'
// import { coordinatesToDMS } from '~/helpers'
// import { findFlagByCountryName } from '~/helpers'

type TCoords = [number, number]

export default defineComponent({
	name: 'Map',
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
}
const props = withDefaults(defineProps<IProps>(), {
	theme: 2,
	maxZoom: 18,
	minZoom: 3,
	zoom: 14,
	center: () => [0, 0],
})
const emit = defineEmits([
	'update:search',
	'features',
	'replaceSearch',
	'singleMarkerClick',
	'coordsClicked',
])

// temp
const attr = ref(
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
)

const show = ref(false)
const _zoom = ref(14)
const _center = ref<TCoords>([0, 0])
const _theme = ref<number>(2)
watch(
	() => [props.zoom, props.center, props.theme],
	([newZoom, newCenter, newTheme], [oldZoom, oldCenter, oldTheme]) => {
		if (typeof newZoom === 'number' && typeof oldZoom === 'number') {
			if (oldZoom !== newZoom) {
				_zoom.value = newZoom
			}
		}
		if (typeof newCenter !== 'number' && typeof oldCenter !== 'number') {
			if (oldCenter[0] !== newCenter[0]) {
				_center.value = newCenter
			}
		}
		if (newTheme !== oldTheme && typeof newTheme === 'number') {
			_theme.value = newTheme
		}
	}
)
onMounted(() => {
	_zoom.value = props.zoom
	_center.value = props.center
	_theme.value = props.theme
	show.value = true
})

function setParams(coords: TCoords, zoomNumber: number) {
	_center.value = coords
	setTimeout(() => {
		_zoom.value = zoomNumber
	}, 250)
}

function mapClicked(e: { latlng: { lat: number; lng: number } }) {
	console.log('map clicked')
	newSingleMarker([e.latlng.lat, e.latlng.lng])
}

const isFeatureSelected = ref(false)
const singleMarker = ref<TCoords | null>(null)
function newSingleMarker(coords: TCoords) {
	console.log('newSingleMarker')
	singleMarker.value = singleMarker.value ? null : coords

	if (singleMarker.value) {
		addSingleMarker(coords)

		// request
		featuresByCoords(coords)

		// set search query for input
		emit('replaceSearch', '')
	}
}
function addSingleMarker(coords: TCoords) {
	singleMarker.value = coords
}
function acceptFeature(coords: TCoords, type: string, place_name: string) {
	console.log('acceptFeature', coords, type, place_name)
	const zoom = type === 'country' ? 6 : 17
	addSingleMarker(coords)
	setParams(coords, zoom)
	isFeatureSelected.value = true
	emit('replaceSearch', place_name)
}

const { search: _search, searchResults, featuresByCoords } = useMyMap()

watch(
	() => props.search,
	(newPropSearch, oldPropSearch) => {
		if (isFeatureSelected.value) {
			isFeatureSelected.value = false
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
			!isFeatureSelected.value
		) {
			emit('update:search', newSearch)
		}
		if (isFeatureSelected.value) isFeatureSelected.value = false
	},
	{ immediate: true }
)
watch(
	() => searchResults.value,
	(val) => emit('features', val)
)

function coordsClicked() {
	if (!singleMarker.value) return

	const coords = [
		+singleMarker.value[0].toFixed(6),
		+singleMarker.value[1].toFixed(6),
	]

	// const string = coordinatesToDMS(coords[0], coords[1])
	const string = `${coords[0].toFixed(6)},${coords[1].toFixed(6)}`
	isFeatureSelected.value = true
	emit('replaceSearch', string)
	searchResults.value = []
	setTimeout(() => emit('coordsClicked'), 0)
}

defineExpose({ acceptFeature })
</script>
