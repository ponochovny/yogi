<!-- eslint-disable vue/html-indent -->
<template>
	<div class="flex flex-col gap-4 p-10">
		<div style="height: 600px; width: 800px">
			<l-map
				ref="map"
				v-model:zoom="zoom"
				v-model:center="center"
				:useGlobalLeaflet="false"
				@click="mapClicked"
				:maxZoom="18"
				:minZoom="3"
			>
				<l-tile-layer
					v-if="theme === 1"
					url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
					:minZoom="0"
					:maxZoom="20"
				></l-tile-layer>
				<l-tile-layer
					v-if="theme === 2"
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
					layer-type="base"
					name="OpenStreetMap"
				></l-tile-layer>
				<l-tile-layer
					v-if="theme === 3"
					url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
					:maxZoom="20"
				></l-tile-layer>
				<l-tile-layer
					v-if="theme === 4"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					layer-type="base"
					name="OpenStreetMap"
				></l-tile-layer>
				<!--  -->
				<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="20"
				></l-tile-layer> -->
				<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="18"
				></l-tile-layer> -->
				<!-- <l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="18"
				></l-tile-layer> -->
				<l-tile-layer
					url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
					:minZoom="0"
					:maxZoom="20"
				></l-tile-layer>

				<!-- MARKERS -->
				<l-marker
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
				</l-marker>
				<l-marker
					v-for="marker of markersOther"
					:key="marker.coords[0]"
					:lat-lng="marker.coords"
				>
					<l-tooltip class="test" :options="{ offset: [12, -10] }">
						{{
							marker.coords[0].toFixed(3) + ',' + marker.coords[1].toFixed(3)
						}}
					</l-tooltip>
					<l-icon
						:icon-size="[24, 24]"
						:icon-anchor="[14, 23]"
						:popup-anchor="[12, -24]"
						class-name="bg-none"
					>
						<div class="w-6 h-6">
							<MapPinIcon
								class="w-6 text-sky-300 shadow-lg stroke-[0.5px] stroke-black"
							/>
						</div>
					</l-icon>
				</l-marker>
				<l-control position="topleft">
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
				</l-control>
			</l-map>
		</div>
		<div class="flex gap-2">
			<Button
				btnSize="sm"
				@click="addMarker([13.757091092599042, 121.05847762683874])"
				class="self-start"
			>
				Add marker
			</Button>
			<Button btnSize="sm" @click="theme = 1" class="self-start">
				Theme 1
			</Button>
			<Button btnSize="sm" @click="theme = 2" class="self-start">
				Theme 2
			</Button>
			<Button btnSize="sm" @click="theme = 3" class="self-start">
				Theme 3
			</Button>
			<Button btnSize="sm" @click="theme = 4" class="self-start">
				Theme 4
			</Button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import {
	LMap,
	LMarker,
	LTileLayer,
	LTooltip,
	LIcon,
	LPopup,
	LControl,
} from '@vue-leaflet/vue-leaflet'
import { MapPinIcon } from '@heroicons/vue/24/solid'
import { findFlagByCountryName } from '~/helpers'

export default defineComponent({
	name: 'TestMap',
})
</script>
<script lang="ts" setup>
const zoom = ref(14)
const markers = ref([
	// {
	// 	coords: [13.751904675388978, 121.07329136390297],
	// 	riseOnHover: true,
	// },
	{ coords: [13.758352484456198, 121.0515516742461] },
	{ coords: [13.772180702953543, 121.0574196850374] },
	{ coords: [13.751769815551782, 121.07329219579698] },
])
const markersOther = ref<any>([])
const theme = ref(2)
const center = ref([13.762208643056697, 121.05702044282522])
const isOpenList = ref(false)

const map = ref<any>(null)

function setParams(coords: number[], zoomNumber: number) {
	center.value = coords
	isOpenList.value = false
	setTimeout(() => {
		zoom.value = zoomNumber
	}, 300)
}

function addMarker(coords: number[], place_type?: string[]) {
	const placeType: 'country' | 'address' | 'place' | string | null = place_type
		? place_type[0]
		: null

	console.log(placeType)

	if (placeType === 'country') {
		setParams(coords, 5)
	}
	if (placeType === 'address') {
		const newMarker = { coords }
		const idx = markers.value.findIndex(
			(el) =>
				el.coords[0] === newMarker.coords[0] &&
				el.coords[1] === newMarker.coords[1]
		)
		const exists = idx > -1
		if (!exists) {
			markers.value.push(newMarker)
			setParams(coords, 17)
		} else {
			markers.value.splice(idx, 1)
		}
	}
	if (placeType !== 'country' && placeType !== 'address') {
		setParams(coords, 15)
	}
}

function addOtherMarker(coords: number[], place_type?: string) {
	markersOther.value = []
	markersOther.value.push({ coords })

	if (place_type === 'country') {
		setParams(coords, 5)
	}
}

function mapClicked(e: { latlng: { lat: number; lng: number } }) {
	console.log(e)

	const isExists = markersOther.value.length > 0

	if (!isExists) {
		const coords = [e.latlng.lat, e.latlng.lng]

		addOtherMarker(coords)

		// request
		requestByCoords(e.latlng.lng, e.latlng.lat)
	} else {
		markersOther.value = []
	}
}

async function requestByCoords(lat: number, lng: number) {
	const _coords = encodeURIComponent(`${lat},${lng}`)
	const res = await $fetch<any>('/api/map/search?coords=' + _coords)
	console.log(res.data)
	searchResults.value = res.data?.features || []

	isOpenList.value = true
}

const search = ref('')
const searchResults = ref<any[]>([])
const throttleSearch = useDebounce(async function (val: any) {
	console.log(val)
	const text = encodeURIComponent(val)
	const res = await $fetch<any>('/api/map/search?text=' + text)
	console.log(res.data)
	searchResults.value = res.data?.features || []

	isOpenList.value = true
}, 1000)
</script>
