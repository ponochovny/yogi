<template>
	<SearchContainer @update="updated" :loading="loading">
		<div class="py-10 px-6">
			<div
				class="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-7 auto-rows-1fr"
			>
				<template v-if="filters.activityType === 'Offerings'">
					<OfferingCard
						v-for="offering of (searchResults as TOffering[])"
						:key="offering?.id"
						:offering="offering"
					/>
				</template>
				<template v-if="filters.activityType === 'Studio & Event Hosts'">
					<StudioCard
						v-for="studio of (searchResults as TStudio[])"
						:key="studio?.id"
						:studio="studio"
					/>
				</template>
				<template v-if="filters.activityType === 'Practitioners'">
					<PractitionerCard
						v-for="practitioner of (searchResults as TUser[])"
						:key="practitioner?.id"
						:practitioner="practitioner"
					/>
				</template>
			</div>
		</div>
	</SearchContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DATA_TYPES } from '~/helpers/constants'
import type { ISearchParams } from '~/helpers/types/search'
import { format } from 'date-fns'
import type { TStudio } from '~/helpers/types/studio'
import type { TUser } from '~/server/types'
import type { TOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'SearchPage',
})
</script>
<script lang="ts" setup>
const loading = ref(false)
const searchResults = ref<TOffering[] | TStudio[] | TUser[]>([])
const isInitialLoad = ref(true)
const filters = reactive<ISearchParams>({
	activityType: DATA_TYPES[0],
	categories: [],
	types: [],
	date: {
		start: undefined,
		end: undefined,
	},
	page: 1,
	count: 20,
})
function resetSearchResults() {
	searchResults.value = []
}

function updated(data: any) {
	if (JSON.stringify(data) !== JSON.stringify(filters) || isInitialLoad.value) {
		if (data.activityType !== filters.activityType) {
			resetSearchResults()
		}
		filters.activityType = data.activityType
		filters.categories = data.categories
		filters.types = data.types
		filters.date.start = data.date.start
		filters.date.end = data.date.end
		filters.price_from = data.price_from
		filters.price_to = data.price_to

		fetch()
	}
	if (isInitialLoad.value) isInitialLoad.value = false
}

function fetch() {
	loading.value = true
	$fetch<{ data: TOffering[] }>(
		'/api/search?' +
			new URLSearchParams({
				...(filters.count && { count: filters.count.toString() }),
				...(filters.page && { page: filters.page.toString() }),
				...(filters.price_from && {
					price_from: filters.price_from.toString(),
				}),
				...(filters.price_to && { price_to: filters.price_to.toString() }),
				...(filters.activityType && { activityType: filters.activityType }),
				...(filters.categories.length && {
					categories: filters.categories.join(','),
				}),
				...(filters.types.length && { types: filters.types.join(',') }),
				...(filters.date.start && {
					date_start: format(filters.date.start, 'yyyy-MM-dd'),
				}),
				...(filters.date.end && {
					date_end: format(filters.date.end, 'yyyy-MM-dd'),
				}),
			}).toString()
	)
		.then(({ data }) => {
			searchResults.value = data
		})
		.catch((error) => console.log(error))
		.finally(() => (loading.value = false))
}
</script>
