<template>
	<div class="relative overflow-hidden min-h-screen">
		<div
			class="bg-[#93ACA8] w-[400px] h-[400px] rounded-full absolute -left-[200px] top-[300px]"
		></div>
		<div
			class="bg-[#CA9A8E] w-[400px] h-[400px] rounded-full absolute -right-[200px] top-[800px]"
		></div>
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
			<p class="font-bold text-3xl mb-12">All offerings</p>
			<div class="grid grid-cols-4 gap-x-4 gap-y-7">
				<OfferingCard
					v-for="offering of offerings?.data"
					:key="offering?.id"
					:offering="offering"
				/>
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

const { data: offerings } = await getOfferings()
</script>
