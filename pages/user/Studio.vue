<template>
	<div class="max-w-screen-xl pt-3 mx-auto">
		<Header />
		<div class="pt-10">
			<div class="bg-white rounded-md flex">
				<div class="pr-10 w-full max-w-[200px]">
					<AdminSidebar :menu-items="_userMenu" />
				</div>
				<div class="pl-10 border-l pb-10 w-full max-w-[600px]">
					<div v-if="loading || studios.length > 0" class="max-w-[600px]">
						<h1 class="pt-8 text-2xl font-bold mb-6">Studios list</h1>
						<div v-if="loading">Loading...</div>
						<div v-else class="flex flex-col gap-1">
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
					<div class="max-w-[600px]">
						<h1 class="pt-8 text-2xl font-bold mb-6">Create studio</h1>
						<div class="flex flex-col gap-8">
							<StudioCreation @updated="loadStudios" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userMenu } from '~/helpers/adminPanel'
import type { IStudio } from '~/helpers/types/studio'

export default defineComponent({
	name: 'Studio',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
const loading = ref(true)
const studios = ref<IStudio[]>([])
const { getStudios } = useStudio()
const _userMenu = userMenu

async function loadStudios() {
	try {
		const { studios: studiosRes } = await getStudios()
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
</script>
