<template>
	<NuxtLayout name="user-admin">
		<div class="lg:pr-0 pr-6 max-w-[600px]">
			<div
				class="flex gap-2 sm:gap-4 flex-col sm:flex-row pt-8 mb-2 md:mb-6 items-start"
			>
				<button
					@click="studios.length && (tab = 'list')"
					type="button"
					class="text-2xl font-bold transition-colors"
					:class="{
						'text-orange-500 underline underline-offset-4': tab === 'list',
						'text-gray-400 hover:text-zinc-900': tab !== 'list',
						'text-gray-200 hover:text-gray-200 cursor-not-allowed':
							!studios.length,
					}"
					:disabled="!studios.length || loading"
				>
					Studios list
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
						<AccordionTrigger class="hover:no-underline py-3 md:py-4">
							<span
								class="text-xl md:text-2xl font-semibold text-left"
								:class="{ 'text-gray-100': studio.isArchived }"
							>
								{{ studio.name }}
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div class="flex gap-2 flex-wrap p-1">
								<Button
									class="mb-2 !px-2"
									@click="gotoStudioSettings(studio)"
									size="sm"
									variant="outline"
									title="Settings"
								>
									<Cog6ToothIcon class="text-orange-400 w-6" />
								</Button>
								<Button
									class="mb-2 !px-2"
									@click="
										toggleArchiveStudioHandler(studio.id, !studio.isArchived)
									"
									btnSize="sm"
									:variant="
										studio.isArchived ? 'successOutline' : 'destructiveOutline'
									"
									:title="studio.isArchived ? 'Unarchive' : 'Archive'"
								>
									<ArchiveBoxIcon
										v-if="!studio.isArchived"
										class="w-6 text-rose-500 stroke-1"
									/>
									<ArchiveBoxArrowDownIcon
										v-if="studio.isArchived"
										class="w-6 text-emerald-600 stroke-1"
									/>
								</Button>
							</div>
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
		<div class="lg:pr-0 pr-6 max-w-[600px]" v-show="tab === 'create'">
			<div class="flex flex-col gap-8">
				<StudioCreation @updated="loadStudios" />
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StudioCreation from '~/src/widgets/StudioCreation'
import type { TStudio } from '~/src/app/types/studio'
import {
	Cog6ToothIcon,
	ArchiveBoxArrowDownIcon,
	ArchiveBoxIcon,
} from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'Studio',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const { useAuthUser } = useAuth()
const user = useAuthUser()
const loading = ref(true)
const tab = ref<'create' | 'list'>('create')
const studios = ref<TStudio[]>([])
const { getAdminStudios, toggleArchiveStudio } = useStudio()

async function loadStudios() {
	try {
		const { data: studiosRes } = await getAdminStudios()
		studios.value = studiosRes
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}

watch(
	() => user.value,
	(val) => {
		if (val) loadStudios()
	},
	{ immediate: true }
)

function gotoStudioSettings(studioData: TStudio) {
	const { useStudioSelected } = useAuth()
	const studioId = useStudioSelected()

	studioId.value = studioData
	navigateTo(`/user/studio/${studioData.id}/offerings`)
}

async function toggleArchiveStudioHandler(id: string, val: boolean) {
	await toggleArchiveStudio(id, val)
	await loadStudios()
}
</script>
