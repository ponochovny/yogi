<template>
	<NuxtLayout name="user-admin">
		<div class="max-w-[600px]">
			<div class="flex gap-4">
				<button
					v-if="studios.length > 0"
					@click="tab = 'list'"
					type="button"
					class="pt-8 text-2xl font-bold mb-6"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'list',
					}"
				>
					Studios list
				</button>
				<button
					@click="tab = 'create'"
					type="button"
					class="pt-8 text-2xl font-bold mb-6"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'create',
					}"
				>
					Create studio
				</button>
			</div>
			<div
				v-if="studios.length > 0"
				v-show="tab === 'list'"
				class="flex flex-col gap-1"
			>
				<Accordion type="single" collapsible defaultValue="item-0">
					<AccordionItem
						v-for="(studio, index) of studios"
						:key="studio.id"
						:value="`item-${index}`"
					>
						<AccordionTrigger class="hover:no-underline">
							<span class="text-2xl font-semibold">
								{{ studio.name }}
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<Button
								class="mb-2"
								@click="gotoStudioSettings(studio)"
								btnSize="sm"
							>
								<Cog6ToothIcon class="text-white w-6 py-2" />
							</Button>
							<StudioCreation
								:studio="studio"
								update-data
								class="px-1"
								@updated="loadStudios"
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
		<div class="max-w-[600px]" v-show="tab === 'create'">
			<div class="flex flex-col gap-8">
				<StudioCreation @updated="loadStudios" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IStudio } from '~/helpers/types/studio'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'Studio',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const loading = ref(true)
const tab = ref<'create' | 'list'>('create')
const studios = ref<IStudio[]>([])
const { getStudios } = useStudio()

async function loadStudios() {
	try {
		const { data: studiosRes } = await getStudios()
		studios.value = studiosRes
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}

onBeforeMount(async () => {
	await loadStudios()
})

function gotoStudioSettings(studioData: IStudio) {
	const { useStudioSelected } = useAuth()
	const studioId = useStudioSelected()

	studioId.value = studioData
	navigateTo(`/user/studio/${studioData.id}/offerings`)
}
</script>
