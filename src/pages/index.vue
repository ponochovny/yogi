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
				<!-- Studios & Event Hosts list -->
				<HomeStudioSection
					title="Studios & Event Hosts"
					viewAllLink="/search?activityType=Studio+%26+Event+Hosts"
					viewAllText="Explore all"
					:studios="studios?.data"
					:pending="studiosPending"
				/>

				<!-- Quote randomized -->
				<div
					class="relative rounded-3xl bg-gradient-to-r from-cyan-600 from-10% to-orange-800/50 to-100% sm:to-90% md:py-20 md:px-32 py-8 sm:px-16 px-8 pr-4 flex text-white items-center z-10 overflow-hidden sm:flex-row flex-col gap-4 sm:gap-0"
				>
					<div
						class="absolute inset-0 z-[-1] opacity-20 blur-[2px] sm:blur-sm pointer-events-none bg-[length:80%_auto] md:bg-[length:40%_auto] bg-[position:-80px_-10px] md:bg-[position:left_-20px]"
						:style="{
							backgroundImage: `url('img/decoration.svg')`,
							backgroundRepeat: 'no-repeat',
						}"
					/>
					<div class="w-[50%]">
						<span class="font-semibold text-lg sm:text-xl">
							Quote of the day
						</span>
					</div>
					<div v-if="quotePending" class="flex flex-col gap-2 w-full animate-pulse">
						<div class="h-6 w-3/4 bg-white/20 rounded" />
						<div class="h-4 w-1/3 bg-white/20 rounded" />
					</div>
					<div v-else class="flex flex-col gap-1 sm:gap-3">
						<span class="text-lg sm:text-xl">
							&laquo;{{ quote?.data?.quote }}&raquo;
						</span>
						<span class="font-semibold text-sm sm:text-base">
							{{ quote?.data?.author }}
						</span>
					</div>
				</div>

				<!-- Upcoming virtual list -->
				<HomeOfferingSection
					title="Upcoming virtual"
					viewAllLink="/search?virtual=true"
					viewAllText="Explore virtual"
					:offerings="offeringsOnline?.data"
					:pending="offeringsOnlinePending"
					emptyTitle="There are no corresponding offerings"
					emptyText="Here you may find Virtual Offerings"
				/>

				<!-- Wellness getaways list -->
				<HomeOfferingSection
					title="Wellness getaways"
					viewAllLink="/search?types=Festival,Retreat"
					viewAllText="Explore getaways"
					:offerings="offeringsWellness?.data"
					:pending="offeringsWellnessPending"
					emptyTitle="There are no corresponding offerings"
					emptyText="Here you may find Wellness Offerings"
				/>

				<!-- Deeper Education list -->
				<HomeOfferingSection
					title="Deeper Education"
					viewAllLink="/search?types=Course,Teacher+Training,Workshop"
					viewAllText="Explore education"
					:offerings="offeringsEducation?.data"
					:pending="offeringsEducationPending"
					emptyTitle="There are no corresponding offerings"
					emptyText="Here you may find Educational Offerings"
				/>
			</div>
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
import { useOffering } from '~/src/entities/offering'
import { useStudio } from '~/src/entities/studio'
import HomeOfferingSection from '~/src/widgets/home/HomeOfferingSection.vue'
import HomeStudioSection from '~/src/widgets/home/HomeStudioSection.vue'

const { getOfferings } = useOffering()
const { getStudiosOpen } = useStudio()

const { data: studios, pending: studiosPending } = await getStudiosOpen(
	new URLSearchParams({ limit: '10' }).toString(),
	{ key: 'home-studios' }
)

const { data: quote, pending: quotePending } = await useFetch<{
	data: { quote: string; author: string }
}>('/api/quote', {
	key: 'home-quote',
	getCachedData: (k, nuxtApp) =>
		nuxtApp.payload.data[k] || nuxtApp.static.data[k],
})

const { data: offeringsOnline, pending: offeringsOnlinePending } =
	await getOfferings(
		new URLSearchParams({
			virtual: 'true',
			limit: '8',
		}).toString(),
		{ key: 'home-offerings-online' }
	)

const { data: offeringsWellness, pending: offeringsWellnessPending } =
	await getOfferings(
		new URLSearchParams({
			types: 'Festival, Retreat',
			limit: '8',
		}).toString(),
		{ key: 'home-offerings-wellness' }
	)

const { data: offeringsEducation, pending: offeringsEducationPending } =
	await getOfferings(
		new URLSearchParams({
			types: 'Course,Teacher Training,Workshop',
			limit: '8',
		}).toString(),
		{ key: 'home-offerings-education' }
	)

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
