<template>
	<div class="relative overflow-hidden min-h-screen">
		<div
			class="bg-[#93ACA8] xl:w-[400px] xl:h-[400px] md:w-[300px] md:h-[300px] rounded-full absolute xl:-left-[200px] md:-left-[150px] xl:top-[300px] md:top-[200px] select-none pointer-events-none"
			tabindex="-1"
		/>
		<div
			class="bg-[#CA9A8E] xl:w-[400px] xl:h-[400px] rounded-full absolute xl:-right-[200px] xl:top-[800px] md:w-[250px] md:h-[250px] md:-right-[125px] md:top-[500px] select-none pointer-events-none"
			tabindex="-1"
		/>
		<div
			class="w-[600px] h-[600px] rounded-full absolute -left-[300px] top-[1800px] bg-contain bg-no-repeat opacity-10 select-none pointer-events-none"
			tabindex="-1"
			:style="{
				backgroundImage: `url('img/decoration.svg')`,
			}"
		/>
		<MainContainer contentClass="py-6">
			<!-- Search block -->
			<div
				class="flex flex-col gap-2 my-6 sm:px-10 md:pt-32 md:pb-52 pt-20 pb-32 items-center justify-center"
			>
				<h1 class="font-bold md:text-5xl text-4xl md:mb-5 mb-2 text-center">
					Elevate Health & Harmony
				</h1>
				<p class="text-sm max-w-[800px] text-center mb-12 leading-6">
					Championing personal wellness transformations, alongside nurturing the
					growth of community-based health ventures.
				</p>
				<MainSearch />
			</div>
			<!-- Slider with categories which link to search page -->
			<div class="flex flex-col md:gap-y-24 gap-y-16">
				<!-- <div>
					<p class="font-bold text-3xl mb-12">All offerings</p>
					<div class="grid grid-cols-4 gap-x-4 gap-y-7">
						<OfferingCard
							v-for="offering of offerings?.data"
							:key="offering?.id"
							:offering="offering"
						/>
					</div>
				</div> -->
				<div>
					<p class="font-bold md:text-3xl text-2xl md:mb-12 mb-8">
						Studios & Event Hosts
					</p>
					<SwiperBlockV2
						:length="studios?.data.length"
						classSlideContainer="overflow-hidden rounded-2xl"
					>
						<swiper-slide
							v-for="studio of studios?.data"
							:key="studio?.id"
							class="xl:min-w-[405px] xl:max-w-[405px] min-w-[305px] max-w-[305px]"
						>
							<StudioCard :studio="studio" />
						</swiper-slide>
					</SwiperBlockV2>
					<MainNoContent
						v-if="!studios?.data.length"
						title="There are no corresponding studios"
						text="Here you may find Studios & Event Hosts"
					/>
				</div>
				<div
					class="relative rounded-3xl bg-gradient-to-r from-cyan-600 from-10% to-orange-800/50 to-100% sm:to-90% md:py-20 md:px-32 py-8 sm:px-16 px-8 pr-4 flex text-white items-center z-10 overflow-hidden sm:flex-row flex-col gap-4 sm:gap-0"
				>
					<div
						class="absolute inset-0 z-[-1] opacity-20 blur-[2px] sm:blur-sm pointer-events-none bg-[length:80%_auto] md:bg-[length:40%_auto] bg-[position:-80px_-10px] md:bg-[position:left_-20px]"
						:style="{
							backgroundImage: `url('img/decoration.svg')`,
							backgroundRepeat: 'no-repeat',
						}"
					></div>
					<div class="w-[50%]">
						<span class="font-semibold text-lg sm:text-xl">
							Quote of the day
						</span>
					</div>
					<div class="flex flex-col gap-1 sm:gap-3">
						<span class="text-lg sm:text-xl">
							&laquo;{{ quote?.data.quote }}&raquo;
						</span>
						<span class="font-semibold text-sm sm:text-base">
							{{ quote?.data.author }}
						</span>
					</div>
				</div>
				<div>
					<p class="font-bold md:text-3xl text-2xl md:mb-12 mb-8">
						Upcoming virtual
					</p>
					<SwiperBlockV2
						:length="offeringsOnline?.data.length"
						classSlideContainer="overflow-hidden rounded-2xl"
					>
						<swiper-slide
							v-for="offering of offeringsOnline?.data"
							:key="offering?.id"
							class="min-w-[300px] max-w-[300px]"
						>
							<OfferingCard
								:offering="offering"
								class="min-w-[300px] max-w-[300px]"
							/>
						</swiper-slide>
					</SwiperBlockV2>
					<MainNoContent
						v-if="!offeringsOnline?.data.length"
						title="There are no corresponding offerings"
						text="Here you may find Virtual Offerings"
					/>
				</div>
				<div>
					<p class="font-bold md:text-3xl text-2xl md:mb-12 mb-8">
						Wellness getaways
					</p>
					<SwiperBlockV2
						:length="offeringsWellness?.data.length"
						classSlideContainer="overflow-hidden rounded-2xl"
					>
						<swiper-slide
							v-for="offering of offeringsWellness?.data"
							:key="offering?.id"
							class="min-w-[300px] max-w-[300px]"
						>
							<OfferingCard :offering="offering" />
						</swiper-slide>
					</SwiperBlockV2>
					<MainNoContent
						v-if="!offeringsWellness?.data.length"
						title="There are no corresponding offerings"
						text="Here you may find Wellness Offerings"
					/>
				</div>
				<div>
					<p class="font-bold md:text-3xl text-2xl md:mb-12 mb-8">
						Deeper Education
					</p>
					<SwiperBlockV2
						:length="offeringsEducation?.data.length"
						classSlideContainer="overflow-hidden rounded-2xl"
					>
						<swiper-slide
							v-for="offering of offeringsEducation?.data"
							:key="offering?.id"
							class="min-w-[300px] max-w-[300px]"
						>
							<OfferingCard
								:offering="offering"
								class="min-w-[300px] max-w-[300px]"
							/>
						</swiper-slide>
					</SwiperBlockV2>
					<MainNoContent
						v-if="!offeringsEducation?.data.length"
						title="There are no corresponding offerings"
						text="Here you may find Educational Offerings"
					/>
				</div>
			</div>
			<!-- Popular locally list -->

			<!-- Studios & Hosts list -->
			<!-- Quote randomized -->
			<!-- Upcoming virtual list -->
			<!-- Wellness getaways list -->
			<!-- Deeper Education list -->

			<!-- Recommended for you list -->
			<!-- Private sessions search -->
			<!-- Subscribe form -->
			<!-- Block with contacts & Site links -->
		</MainContainer>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MainPage',
})
</script>
<script lang="ts" setup>
const { getOfferings } = useOffering()
const { getStudiosOpen } = useStudio()

const { data: offeringsWellness } = await getOfferings(
	new URLSearchParams({
		types: 'Festival, Retreat',
		limit: '8',
	}).toString(),
	true
)
const { data: offeringsEducation } = await getOfferings(
	new URLSearchParams({
		types: 'Course,Teacher Training,Workshop',
		limit: '8',
	}).toString(),
	true
)
const { data: offeringsOnline } = await getOfferings(
	new URLSearchParams({
		virtual: 'true',
		limit: '8',
	}).toString(),
	true
)
const { data: studios } = await getStudiosOpen(
	new URLSearchParams({ limit: '10' }).toString()
)
const { data: quote } = useFetch('/api/quote')

useSeoMeta({
	title: 'Main page',
	ogTitle: 'Main page',
	description:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogDescription:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogImage: 'logoBg.png',
	twitterCard: 'summary',
})
</script>
