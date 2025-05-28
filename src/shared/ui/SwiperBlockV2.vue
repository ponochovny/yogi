<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps<{ length?: number; classSlideContainer?: string }>()

const isEnd = ref(true)
const isBeginning = ref(true)

const swiperBasicRef = ref(null)
const swiper1 = useSwiper(swiperBasicRef)

const onPrev = () => {
	swiper1.prev()

	updateVars()
}
const onNext = () => {
	swiper1.next()

	updateVars()
}

function updateVars() {
	// @ts-ignore
	const { isBeginning: _isBeginning, isEnd: _isEnd } = swiper1.instance.value
	isBeginning.value = _isBeginning
	isEnd.value = _isEnd
}

function onSlideChange() {
	updateVars()
}

watch(
	() => swiper1,
	() => updateVars(),
	{ deep: true }
)
</script>

<template>
	<div class="-mx-3 sm:-mx-5" v-if="length">
		<div class="relative w-full sm:px-5 px-2">
			<div :class="classSlideContainer">
				<ClientOnly>
					<swiper-container
						ref="swiperBasicRef"
						class="swiper-basic"
						slides-per-view="auto"
						:space-between="10"
						:breakpoints="{
							615: {
								spaceBetween: 24,
							},
						}"
						@swiperslidechange="onSlideChange"
					>
						<slot />
					</swiper-container>
				</ClientOnly>
			</div>
			<div
				ref="prevNavigation"
				@click="onPrev"
				class="swiper-button-prev-my absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-gray-100 active:bg-gray-50 transition-all cursor-pointer"
				:class="{ 'opacity-0': isBeginning }"
			>
				<ChevronLeftIcon class="w-5 h-5 text-gray-600 stroke-1" />
			</div>
			<div
				ref="nextNavigation"
				@click="onNext"
				class="swiper-button-next-my absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-gray-100 active:bg-gray-50 transition-all cursor-pointer"
				:class="{ 'opacity-0': isEnd }"
			>
				<ChevronRightIcon class="w-5 h-5 text-gray-600 stroke-1" />
			</div>
		</div>
	</div>
</template>
