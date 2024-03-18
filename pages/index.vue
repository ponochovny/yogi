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
				class="flex flex-col gap-2 my-6 rounded-xl border px-10 py-8 items-center justify-center border-gray-400"
			>
				<div>Search</div>
			</div>
			<!-- Slider with categories which link to search page -->
			<div class="grid grid-cols-4 gap-4">
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
