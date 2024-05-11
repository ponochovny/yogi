<template>
	<NuxtLayout name="user-offering-settings">
		<div class="lg:pr-0 pr-6 max-w-[600px]">
			<div class="flex gap-2 sm:gap-4 flex-col sm:flex-row pt-8 mb-6">
				<button
					v-if="offeringsRes && offeringsRes.data?.length > 0"
					@click="tab = 'list'"
					type="button"
					class="text-2xl font-bold transition-colors"
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
					class="text-2xl font-bold"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'create',
						'text-gray-400 hover:text-black': tab !== 'create',
					}"
				>
					Offering creation
				</button>
			</div>
			<div
				v-if="offeringsRes?.data && offeringsRes.data.length > 0"
				v-show="tab === 'list'"
				class="flex flex-col gap-1"
			>
				<Accordion type="single" collapsible defaultValue="item-0">
					<AccordionItem
						v-for="(offering, index) of offeringsRes.data"
						:key="offering.id"
						:value="`item-${index}`"
					>
						<AccordionTrigger class="hover:no-underline">
							<span class="text-2xl font-semibold text-left">
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
								@updated="refresh"
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
		<div class="lg:pr-0 pr-6 max-w-[600px]" v-show="tab === 'create'">
			<div class="flex flex-col gap-8">
				<OfferingCreation @updated="refresh" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'UserOfferingSettings',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { id: studioId } = route.params
const tab = ref<'create' | 'list'>('create')
const { getOfferingsByStudioId } = useOffering()

if (!studioId || !isString(studioId)) {
	router.push('/')
}

const { data: offeringsRes, refresh } = await getOfferingsByStudioId<{
	data: TOffering[]
	refresh: () => void
	// eslint-disable-next-line indent
}>(!studioId || !isString(studioId) ? '' : studioId, { immediate: false })

onMounted(() => refresh())
</script>
