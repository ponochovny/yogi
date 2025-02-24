<template>
	<NuxtLayout name="user-admin" creation>
		<div class="pr-6 md:pr-10 py-14 min-h-screen">
			<h2 class="text-2xl font-bold mb-6">Edit offering</h2>

			<div class="w-full" v-if="pending">
				<LoadingIcon class="fill-primary mx-auto w-10 h-10" />
			</div>
			<OfferingCreation
				v-else
				:offering="offering?.data"
				update-data
				class="px-1"
			/>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TOffering } from '~/src/app/types/offering'

export default defineComponent({
	name: 'EditOffering',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const { data: offering, pending } = useFetch<{ data: TOffering | null }>(
	`/api/offerings/id/${route.params._id}`
)
</script>
