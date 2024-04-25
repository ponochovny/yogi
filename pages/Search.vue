<template>
	<SearchContainer @update="updated" :loading="loading">
		<div class="py-10 px-6">
			<div
				class="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-7 auto-rows-1fr"
			>
				<template v-if="filters.activityType === 'Offerings'">
					<OfferingCard
						v-for="offering of (searchResults as IOffering[])"
						:key="offering?.id"
						:offering="offering"
					/>
				</template>
				<template v-if="filters.activityType === 'Studio & Event Hosts'">
					<StudioCard
						v-for="studio of (searchResults as IStudio[])"
						:key="studio?.id"
						:studio="studio"
					/>
				</template>
				<template v-if="filters.activityType === 'Practitioners'">
					<PractitionerCard
						v-for="practitioner of (searchResults as IUser[])"
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
import type { IOffering } from '~/helpers/types/offering'
import type { IStudio } from '~/helpers/types/studio'
import type { IUser } from '~/server/types'

export default defineComponent({
	name: 'SearchPage',
})
</script>
<script lang="ts" setup>
const loading = ref(false)
const searchResults = ref<IOffering[] | IStudio[] | IUser[]>([])
const isInitialLoad = ref(true)
const filters = reactive<ISearchParams>({
	activityType: DATA_TYPES[0],
	categories: [],
	types: [],
	date: {
		start: undefined,
		end: undefined,
	},
})
function resetSearchResults() {
	searchResults.value = []
}

function updated(data: any) {
	if (JSON.stringify(data) !== JSON.stringify(filters) || isInitialLoad.value) {
		filters.activityType = data.activityType
		filters.categories = data.categories
		filters.types = data.types

		resetSearchResults()
		fetch()
	}
	if (isInitialLoad.value) isInitialLoad.value = false
}

function fetch() {
	loading.value = true
	$fetch<{ data: IOffering[] }>(
		'/api/search?' +
			new URLSearchParams({
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
