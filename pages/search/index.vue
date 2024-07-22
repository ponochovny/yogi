<template>
	<SearchLayout
		@update="updateHandler"
		:loading="loading"
		:priceRange="[priceRange.price_from, priceRange.price_to]"
	>
		<div class="pb-10 pt-8 px-6">
			<div class="mb-6 transition-opacity" :class="{ 'opacity-80': loading }">
				<p class="font-bold text-lg" :class="{ 'opacity-0': loading }">
					We found {{ filters.total }} results for you
				</p>
			</div>
			<div class="w-full" v-show="loading">
				<LoadingIcon class="fill-primary mx-auto w-10 h-10" />
			</div>
			<div
				class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-7 auto-rows-1fr"
			>
				<template v-if="filters.activityType === 'Offerings'">
					<OfferingCard
						v-for="offering of (searchResults as TOffering[])"
						:key="offering?.id"
						:offering="offering"
					/>
				</template>
				<template v-else-if="filters.activityType === 'Studio & Event Hosts'">
					<StudioCard
						v-for="studio of (searchResults as TStudio[])"
						:key="studio?.id"
						:studio="studio"
					/>
				</template>
				<template v-else-if="filters.activityType === 'Practitioners'">
					<PractitionerCard
						v-for="practitioner of (searchResults as TUser[])"
						:key="practitioner?.id"
						:practitioner="practitioner"
					/>
				</template>
			</div>
			<div v-if="isPagination" class="flex pt-12 justify-center">
				<Pagination
					v-slot="{ page }"
					:items-per-page="filters.count"
					:total="filters.total"
					:sibling-count="1"
					show-edges
					:default-page="filters.page"
					v-model:page="filters.page"
					@update:page="fetchHandler"
				>
					<PaginationList v-slot="{ items }" class="flex items-center gap-1">
						<PaginationFirst />
						<PaginationPrev />

						<template v-for="(item, index) in items">
							<PaginationListItem
								v-if="item.type === 'page'"
								:key="index"
								:value="item.value"
								as-child
							>
								<Button
									class="w-10 h-10 p-0"
									:variant="item.value === page ? 'default' : 'outline'"
								>
									{{ item.value }}
								</Button>
							</PaginationListItem>
							<PaginationEllipsis v-else :key="item.type" :index="index" />
						</template>

						<PaginationNext />
						<PaginationLast />
					</PaginationList>
				</Pagination>
			</div>
		</div>
	</SearchLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { ISearchParams } from '@/helpers/search/types'
import useSearchPage from './_composables'
import { compareFilters } from './_helpers'
import { toast } from 'vue-sonner'

import { DATA_TYPES } from '@/helpers/constants'
import type { TStudio } from '~/helpers/types/studio'
import type { TUser } from '~/server/types'
import type { TOffering } from '~/helpers/types/offering'

import SearchLayout from './_layout/SearchLayout.vue'
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'

export default defineComponent({
	name: 'SearchPage',
})
</script>
<script lang="ts" setup>
const loading = ref(true)
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
	total: 0,
})
const priceRange = ref({ price_from: 0, price_to: 0 })
function resetSearchResults() {
	searchResults.value = []
}
function resetPagination() {
	filters.page = 1
	filters.count = 20
}
const isPagination = computed(() => {
	return (filters.total || 0) / (filters.count || 0) > 1
})

function updateHandler(newFilters: Partial<ISearchParams>) {
	const { areSameFilters, isSameActivityType } = compareFilters(
		filters,
		newFilters
	)

	if (areSameFilters && !isInitialLoad.value) return

	Object.entries(newFilters).forEach(([key, value]) => {
		filters[key as keyof ISearchParams] = value as never
	})
	// if (newFilters.search || newFilters.location) {
	// 	const check1 =
	// 		JSON.stringify({ location: filters.location, search: filters.search }) !==
	// 		JSON.stringify(newFilters)

	// 	if (check1) {
	// filters.search = newFilters.search
	// filters.location = newFilters.location

	// 		fetchHandler()

	// 		return
	// 	}
	// 	return
	// } else {
	// 	filters.search = undefined
	// 	filters.location = undefined
	// }

	// if (isInitialLoad.value) {
	// 	fetchHandler()
	// 	return
	// } else if (areSameFilters && !isInitialLoad.value) {
	// 	return
	// }
	// if (areSameFilters || isInitialLoad.value) {
	// 	// eslint-disable-next-line no-debugger
	// 	debugger

	// 	// fetchHandler()
	// 	// loading.value = false
	// 	return
	// }
	if (!isSameActivityType) {
		resetSearchResults()
		resetPagination()
		// priceRange.value = {
		// 	price_from: 0,
		// 	price_to: 0,
		// }
	}

	// filters.activityType = newFilters.activityType
	// filters.categories = newFilters.categories
	// filters.types = newFilters.types
	// filters.date.start = newFilters.date?.start
	// filters.date.end = newFilters.date?.end
	// filters.price_from = newFilters.price_from
	// filters.price_to = newFilters.price_to

	fetchHandler()
}

function fetchHandler() {
	loading.value = true

	const { fetch } = useSearchPage(filters)

	if (isInitialLoad.value) isInitialLoad.value = false

	fetch()
		.then((response) => {
			const { data = [], meta, error } = response

			// Set search results data
			searchResults.value = data

			// Handle error
			if (error) {
				console.log(error)
				toast.error('Timed out')
			}

			// Set filters, price range data
			filters.total = meta?.total || 0
			priceRange.value = {
				price_from: meta?.min_price || 0,
				price_to: meta?.max_price || 0,
			}
		})
		.catch((error) => console.log(error))
		.finally(() => (loading.value = false))
}

useSeoMeta({
	title: 'Search page',
	ogTitle: 'Search page',
	description:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogDescription:
		'Wellness marketplace, book your next appointment, retreat, festival',
	ogImage: 'logoBg.png',
	twitterCard: 'summary',
})
</script>
