<template>
	<NuxtLayout name="user-admin">
		<div class="pt-6 -ml-4 md:-ml-16">
			<Button
				class="ml-auto mr-4 mb-4 block"
				variant="outline"
				@click="router.push(route.fullPath + '/create')"
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
							<NuxtLink :to="'/offering/' + offering.slug">
								{{ offering.name }}
							</NuxtLink>
						</TableCell>
						<TableCell>{{ offering.types.join(', ') }}</TableCell>
						<TableCell>{{ offering.location.name }}</TableCell>
						<TableCell>
							<div class="relative flex items-center">
								<div class="absolute -left-0.5 -top-0.5 flex items-center">
									<div
										v-for="(bg, idx) of offering.practitioners"
										:key="bg.id"
										class="w-7 h-7 rounded-full bg-orange-500"
										:class="{ '-ml-[12px]': idx > 0 }"
									></div>
								</div>
								<img
									v-for="(prac, idx) of offering.practitioners"
									:key="prac.id"
									:src="prac.profileImage || ''"
									class="w-6 h-6 rounded-full z-10"
									:class="{ '-ml-2': idx > 0 }"
									:title="prac.name || ''"
								/>
							</div>
							<!-- {{ offering.practitioners.map((el) => el.name).join(', ') }} -->
						</TableCell>
						<TableCell>
							<span
								:class="[
									!offering.isActive ? 'text-rose-600' : 'text-teal-600',
								]"
							>
								{{ !offering.isActive ? 'Inactive' : 'Active' }}
							</span>
						</TableCell>
						<TableCell>
							{{ offering.is_private ? 'Private' : 'Public' }}
						</TableCell>
						<TableCell>
							<Popover>
								<PopoverTrigger>
									<button>
										<EllipsisHorizontalCircleIcon class="w-6 h-6 stroke-1" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									:align="'end'"
									class="flex flex-col gap-1 max-w-[170px] rounded-2xl shadow-md border border-gray-300/40"
								>
									<Button
										size="sm"
										variant="outline"
										class="w-full justify-center"
										@click="
											router.push(route.fullPath + '/edit/' + offering.id)
										"
									>
										<span>Edit</span>
									</Button>
									<Button
										size="sm"
										variant="outline"
										class="w-full justify-center"
										disabled
									>
										<span>Duplicate</span>
									</Button>
									<hr class="my-1" />
									<Button
										@click="
											activeToggleOffering(offering.id, !offering.isActive)
										"
										size="sm"
										:variant="
											offering.isActive ? 'destructiveOutline' : 'outline'
										"
										class="w-full justify-center"
									>
										<span>
											{{ offering.isActive ? 'Deactivate' : 'Activate' }}
										</span>
									</Button>
								</PopoverContent>
							</Popover>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<div class="w-full my-6" v-if="pending">
				<LoadingIcon class="fill-orange-600 mx-auto w-10 h-10" />
			</div>

			<MainNoContent
				v-else-if="!offeringsRes?.data.length"
				class="mt-6"
				title="You haven't create any offering"
				text="Here you may find your offerings"
			/>
		</div>
	</NuxtLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TOffering } from '~/src/app/types/offering'
import { dateString } from '~/src/shared/lib/utils'
import { toast } from 'vue-sonner'
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

const {
	data: offeringsRes,
	pending,
	refresh,
} = await getOfferingsByStudioId<{
	data: TOffering[]
	refresh: () => void
	// eslint-disable-next-line indent
}>(!studioId || !isString(studioId) ? '' : studioId, { immediate: false })

onMounted(() => refresh())

const { toggleActiveOfferingById } = useOffering()
function activeToggleOffering(id: string, val: boolean) {
	toggleActiveOfferingById(id, val)
		.then(() => {
			toast.success(`Offering has been ${val ? 'deactivated' : 'activated'}`)
			refresh()
		})
		.catch((err) => console.log('err', err))
}
</script>
