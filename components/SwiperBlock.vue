<template>
	<div class="-mx-3 sm:-mx-5" v-if="length">
		<div class="relative w-full px-5">
			<div class="rounded-2xl overflow-hidden">
				<Swiper
					@swiper="onSwiper"
					@snapIndexChange="snapIndexChange"
					:modules="[SwiperAutoplay, SwiperNavigation]"
					slides-per-view="auto"
					:spaceBetween="10"
					:breakpoints="{
						615: {
							spaceBetween: 24,
						},
					}"
					:navigation="{
						nextEl: nextNavigation,
						prevEl: prevNavigation,
					}"
				>
					<slot />
				</Swiper>
			</div>
			<div
				ref="prevNavigation"
				class="swiper-button-prev-my absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-gray-100 active:bg-gray-50 transition-all cursor-pointer"
				:class="{ 'opacity-0': isBeginning && !isMiddle }"
			>
				<ChevronLeftIcon class="w-5 h-5 text-gray-600 stroke-1" />
			</div>
			<div
				ref="nextNavigation"
				class="swiper-button-next-my absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-gray-100 active:bg-gray-50 transition-all cursor-pointer"
				:class="{ 'opacity-0': isEnd && !isMiddle }"
			>
				<ChevronRightIcon class="w-5 h-5 text-gray-600 stroke-1" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SwiperBlock',
})
</script>
<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
defineProps<{ length?: number }>()
const isEnd = ref(false)
const isBeginning = ref(false)
const isMiddle = ref(false)

const prevNavigation = ref<any>(null)
const nextNavigation = ref<any>(null)

function setParams(e: any) {
	isMiddle.value = !e.isBeginning && !e.isEnd
	isEnd.value = e.isEnd
	isBeginning.value = e.isBeginning
}

function onSwiper(e: any) {
	setParams(e)
}
function snapIndexChange(e: any) {
	setParams(e)
}
</script>
