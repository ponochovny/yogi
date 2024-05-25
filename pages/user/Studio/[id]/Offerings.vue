<template>
	<NuxtLayout name="user-admin">
		<div class="pt-6 -ml-16">
			<Button
				class="ml-auto mr-4 mb-4"
				variant="primaryOutline"
				@click="$router.push($route.fullPath + '/create')"
			>
				<span class="font-semibold">+ Create new offering</span>
			</Button>
			<Table>
				<!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Types</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Practitioners</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Private</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="offering in offeringsRes?.data" :key="offering.id">
						<TableCell>
							{{ dateString(offering.start, offering.end) }}
						</TableCell>
						<TableCell class="font-medium">
							{{ offering.name }}
						</TableCell>
						<TableCell>{{ offering.types.join(', ') }}</TableCell>
						<TableCell>{{ offering.location.name }}</TableCell>
						<TableCell>
							<div class="flex items-center">
								<img
									v-for="(prac, idx) of offering.practitioners"
									:key="prac.id"
									:src="prac.profileImage || ''"
									class="w-6 h-6 rounded-full"
									:class="{ '-ml-2': idx > 0 }"
									:title="prac.name || ''"
								/>
							</div>
							<!-- {{ offering.practitioners.map((el) => el.name).join(', ') }} -->
						</TableCell>
						<TableCell>{{ 'Active' }}</TableCell>
						<TableCell>
							{{ offering.is_private ? 'Private' : 'Public' }}
						</TableCell>
						<TableCell>
							<Popover>
								<PopoverTrigger>
									<button>
										<EllipsisHorizontalCircleIcon class="w-6 h-6" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									:align="'end'"
									class="flex flex-col gap-1 max-w-[170px] rounded-2xl shadow-md border border-gray-300/40"
								>
									<Button
										btnSize="sm"
										variant="primaryOutline"
										class="w-full justify-center"
										@click="
											$router.push($route.fullPath + '/edit/' + offering.id)
										"
									>
										<span>Edit</span>
									</Button>
									<Button
										btnSize="sm"
										variant="primaryOutline"
										class="w-full justify-center"
									>
										<span>Duplicate</span>
									</Button>
									<hr class="my-1" />
									<Button
										btnSize="sm"
										variant="dangerOutline"
										class="w-full justify-center"
									>
										<span>Delete</span>
									</Button>
								</PopoverContent>
							</Popover>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TOffering } from '~/helpers/types/offering'
import { dateString } from '~/lib/utils'
import { EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'UserOfferingSettings',
})
</script>
<script lang="ts" setup>
definePageMeta({
	middleware: ['user'],
})
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
