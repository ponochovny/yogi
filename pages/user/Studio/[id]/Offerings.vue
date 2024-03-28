<template>
	<NuxtLayout name="user-offering-settings">
		<div class="max-w-[600px]">
			<div class="flex gap-4">
				<button
					v-if="offerings.length > 0"
					@click="tab = 'list'"
					type="button"
					class="pt-8 text-2xl font-bold mb-6 transition-colors"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'list',
						'text-gray-400 hover:text-black': tab !== 'list',
					}"
				>
					Offerings list
				</button>
				<button
					@click="tab = 'create'"
					type="button"
					class="pt-8 text-2xl font-bold mb-6"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'create',
						'text-gray-400 hover:text-black': tab !== 'create',
					}"
				>
					Offering creation
				</button>
			</div>
			<div
				v-if="offerings.length > 0"
				v-show="tab === 'list'"
				class="flex flex-col gap-1"
			>
				<Accordion type="single" collapsible defaultValue="item-0">
					<AccordionItem
						v-for="(offering, index) of offerings"
						:key="offering.id"
						:value="`item-${index}`"
					>
						<AccordionTrigger class="hover:no-underline">
							<span class="text-2xl font-semibold">
								{{ offering.name }}
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<!-- <Button
								class="mb-2"
								@click="gotoOfferingSettings(offering)"
								btnSize="sm"
							>
								<Cog6ToothIcon class="text-white w-6 py-2" />
							</Button> -->
							<OfferingCreation
								:offering="offering"
								update-data
								class="px-1"
								@updated="loadOfferings"
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
		<div class="max-w-[600px]" v-show="tab === 'create'">
			<div class="flex flex-col gap-8">
				<OfferingCreation @updated="loadOfferings" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'UserOfferingSettings',
})
</script>
<script lang="ts" setup>
const loading = ref(true)
const route = useRoute()
const { id: studioId } = route.params
const tab = ref<'create' | 'list'>('create')
const offerings = ref<IOffering[]>([])
const { getOfferingsByStudioId } = useOffering()

async function loadOfferings() {
	if (!studioId || !isString(studioId)) return
	try {
		const { data: offeringsRes } = await getOfferingsByStudioId(studioId)
		offerings.value = offeringsRes.value?.data || []
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}

onBeforeMount(async () => {
	await loadOfferings()
})
</script>
