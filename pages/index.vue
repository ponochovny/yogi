<template>
	<div class="relative overflow-hidden min-h-screen">
		<di
			class="bg-[#93ACA8] w-[400px] h-[400px] rounded-full absolute -left-[200px] top-[300px] pointer-events-none"
		/>
		<div
			class="bg-[#CA9A8E] w-[400px] h-[400px] rounded-full absolute -right-[200px] top-[800px] pointer-events-none"
		/>
		<div
			class="w-[600px] h-[600px] rounded-full absolute -left-[300px] top-[1800px] bg-contain bg-no-repeat opacity-10 pointer-events-none"
			:style="{
				backgroundImage: `url('img/decoration.svg')`,
			}"
		/>
		<MainContainer contentClass="py-6">
			<!-- Search block -->
			<div
				class="flex flex-col gap-2 my-6 px-10 pt-32 pb-52 items-center justify-center"
			>
				<h1 class="font-bold text-5xl mb-5">Elevate Health & Harmony</h1>
				<p class="text-sm max-w-[800px] text-center mb-12 leading-6">
					Championing personal wellness transformations, alongside nurturing the
					growth of community-based health ventures.
				</p>
				<MainSearch />
			</div>
			<!-- Slider with categories which link to search page -->
			<div class="flex flex-col gap-y-24">
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
					<p class="font-bold text-3xl mb-12">Studios & Event Hosts</p>
					<div class="flex gap-6 overflow-x-auto">
						<StudioCard
							v-for="studio of studios?.data"
							:key="studio?.id"
							:studio="studio"
							class="min-w-[405px] max-w-[405px]"
						/>
					</div>
					<MainNoContent
						v-if="!studios?.data.length"
						title="There are no corresponding studios"
						text="Here you may find Studios & Event Hosts"
					/>
				</div>
				<div
					class="relative rounded-3xl bg-gradient-to-r from-cyan-600 from-10% to-orange-400/50 to-90% py-20 px-32 flex text-white items-center z-10 overflow-hidden"
				>
					<div
						class="absolute inset-0 z-[-1] opacity-20 blur-sm pointer-events-none"
						:style="{
							backgroundImage: `url('img/decoration.svg')`,
							backgroundSize: '40%',
							backgroundPosition: 'left -20px',
							backgroundRepeat: 'no-repeat',
						}"
					></div>
					<div class="w-[50%]">
						<span class="font-semibold text-xl">Quote of the day</span>
					</div>
					<div class="flex flex-col gap-3">
						<span class="text-xl">&laquo;{{ quote?.data.quote }}&raquo;</span>
						<span class="font-semibold">{{ quote?.data.author }}</span>
					</div>
				</div>
				<div>
					<p class="font-bold text-3xl mb-12">Upcoming virtual</p>
					<div class="flex gap-6 overflow-x-auto">
						<OfferingCard
							v-for="offering of offeringsOnline?.data"
							:key="offering?.id"
							:offering="offering"
							class="min-w-[300px] max-w-[300px]"
						/>
					</div>
					<MainNoContent
						v-if="!offeringsOnline?.data.length"
						title="There are no corresponding offerings"
						text="Here you may find Virtual Offerings"
					/>
				</div>
				<div>
					<p class="font-bold text-3xl mb-12">Wellness getaways</p>
					<div class="flex gap-6 overflow-x-auto">
						<OfferingCard
							v-for="offering of offeringsWellness?.data"
							:key="offering?.id"
							:offering="offering"
							class="min-w-[300px] max-w-[300px]"
						/>
					</div>
					<MainNoContent
						v-if="!offeringsWellness?.data.length"
						title="There are no corresponding offerings"
						text="Here you may find Wellness Offerings"
					/>
				</div>
				<div>
					<p class="font-bold text-3xl mb-12">Deeper Education</p>
					<div class="flex gap-6 overflow-x-auto">
						<OfferingCard
							v-for="offering of offeringsEducation?.data"
							:key="offering?.id"
							:offering="offering"
							class="min-w-[300px] max-w-[300px]"
						/>
					</div>
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
	}).toString()
)
const { data: offeringsEducation } = await getOfferings(
	new URLSearchParams({
		types: 'Course,Teacher Training,Workshop',
		limit: '8',
	}).toString()
)
const { data: offeringsOnline } = await getOfferings(
	new URLSearchParams({
		virtual: 'true',
		limit: '8',
	}).toString()
)
const { data: studios } = await getStudiosOpen(
	new URLSearchParams({ limit: '10' }).toString()
)
const { data: quote } = useFetch('/api/quote')
</script>
