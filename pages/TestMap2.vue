<template>
	<div>
		<div class="flex flex-col gap-4 items-center">
			<Popover v-model:open="isOpenList">
				<PopoverTrigger as="div">
					<Input v-model="search" class="w-[920px]" />
				</PopoverTrigger>
				<PopoverContent class="z-50 px-3 py-3">
					<div class="flex flex-col bg-white gap-y-1">
						<p
							v-show="!features.length"
							class="text-gray-400 text-sm text-center"
						>
							Start typing
						</p>
						<button
							v-for="(place, idx) of features"
							:key="idx"
							@click="_acceptFeature(place)"
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
				</PopoverContent>
			</Popover>
			<!-- <Yselect
				v-model="selectedAddress"
				:options="features"
				searchable
				object
				valueProp="id"
				field="place_name"
			/> -->
			<div class="flex gap-3">
				<div class="w-[920px] h-[600px] z-10">
					<Map
						ref="map"
						:center="[41.892055023, 12.485961]"
						v-model:search="search"
						@features="updateFeatures"
						@replaceSearch="search = $event"
						@singleMarkerClick="isOpenList = true"
						@coordsClicked="isOpenList = false"
						allowMarkerCreation
					/>
				</div>
				<!-- TEMP > -->
				<div class="flex flex-col gap-1 w-[440px]">
					<div
						v-for="(place, idx) of features"
						:key="idx"
						@click="_acceptFeature(place)"
					>
						{{ place?.place_name || '' }}
					</div>
				</div>
				<!-- TEMP < -->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { findFlagByCountryName } from '~/helpers'

type TCoords = [number, number]

export default defineComponent({
	name: 'TestMap2',
})
</script>
<script lang="ts" setup>
const map = ref<any>(null)
const search = ref('')
const features = ref<any[]>([])
function updateFeatures(data: any) {
	features.value = data
	isOpenList.value = true
}
//
const isOpenList = ref(false)
function _acceptFeature(placeData: {
	id: string
	center: TCoords
	place_name: string
}) {
	if (!map.value) return

	const { place_name, center, id } = placeData

	const coords = [center[1], center[0]]
	const type = id.split('.')[0]

	map.value.acceptFeature(coords, type, place_name)
}
</script>
