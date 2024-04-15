<template>
	<div class="flex flex-col items-center justify-center h-screen gap-4">
		<div class="w-[400px] flex flex-col gap-1">
			<Input v-model="search" />
			<Yselect
				ref="selectComponent"
				class="w-full"
				mode="single"
				v-model="selected"
				field="place_name"
				valueProp="id"
				object
				:options="features"
				placeholder="Find place on the map"
			/>
		</div>
		<div class="flex gap-4 items-start">
			<div class="w-[920px] h-[400px]">
				<Map2
					ref="map"
					v-model:search="search"
					:zoom="3"
					allowMarkerCreation
					searchable
					@features="setFeatures"
					@featureSelected="featureSelected"
					@markerRemoved="selected = null"
				/>
			</div>
			<div
				class="flex flex-col gap-1 bg-white rounded-lg p-4 w-[400px] shadow-md border border-gray-300"
			>
				<p v-if="!features.length" class="text-gray-500 text-center">
					Place a marker...
				</p>
				<button
					v-for="feature of features"
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IFeature } from '~/helpers/types/map'
import { findFlagByCountryName } from '~/helpers'

export default defineComponent({
	name: 'TestMap',
})
</script>
<script lang="ts" setup>
const selectComponent = ref<any>(null)
const map = ref<any>(null)
const search = ref('')
const features = ref<IFeature[]>([])

function setFeatures(data: IFeature[]) {
	features.value = data

	if (data.length) {
		selectComponent.value?.open()
	} else {
		selectComponent.value?.close()
	}
}

function selectFeature(data: IFeature) {
	if (!map.value) return

	map.value.selectFeature(data)
}

const selected = ref<any>(null)
function featureSelected(feature: IFeature) {
	selected.value = feature
}

// function _acceptFeature(placeData: {
// 	id: string
// 	center: TCoords
// 	place_name: string
// }) {
// 	if (!map.value) return

// 	const coords = [placeData.center[1], placeData.center[0]]
// 	const type = placeData.id.split('.')[0]
// 	const { place_name } = placeData

// 	map.value.acceptFeature(coords, type, place_name)
// }
</script>
