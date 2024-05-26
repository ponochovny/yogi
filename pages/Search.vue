<template>
	<SearchContainer
		@update="updated"
		:loading="loading"
		:priceRange="[priceRange.price_from || 0, priceRange.price_to || 0]"
	>
		<div class="pb-10 pt-8 px-6">
			<div class="mb-6 transition-opacity" :class="{ 'opacity-80': loading }">
				<p class="font-bold text-lg">
					We found {{ filters.total }} results for you
				</p>
			</div>
			<div class="w-full" v-show="loading">
				<LoadingIcon class="fill-orange-600 mx-auto w-10 h-10" />
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
			<div v-if="isShowPagination" class="flex pt-12 justify-center">
				<Pagination
					v-slot="{ page }"
					:items-per-page="filters.count"
					:total="filters.total"
					:sibling-count="1"
					show-edges
					:default-page="filters.page"
					v-model:page="filters.page"
					@update:page="fetch"
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
const route = useRoute()
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
const isShowPagination = computed(() => {
	return (filters.total || 0) / (filters.count || 0) > 1
})

function updated(data: any) {
	if (data.search || data.location) {
		if (
			JSON.stringify({ location: filters.location, search: filters.search }) !==
			JSON.stringify(data)
		) {
			filters.search = data.search
			filters.location = data.location

			fetch()

			return
		}
		return
	} else {
		filters.search = undefined
		filters.location = undefined
	}

	const {
		page,
		count,
		total,
		search: _search,
		location: _location,
		...restFilters
	} = filters
	const { search, location, ...restData } = data
	if (
		JSON.stringify(restData) !== JSON.stringify(restFilters) ||
		isInitialLoad.value
	) {
		if (data.activityType !== filters.activityType) {
			resetSearchResults()
		}
		filters.activityType = data.activityType
		filters.categories = data.categories
		filters.types = data.types
		filters.date.start = data.date?.start
		filters.date.end = data.date?.end
		filters.price_from = data.price_from
		filters.price_to = data.price_to

		fetch()
	}
}

function fetch() {
	loading.value = true

	const priceFromCheck = isNumber(filters.price_from) && filters.price_from >= 0

	const searchObj = {
		...(route.query.search && { search: route.query.search.toString() }),
		...(route.query.location && {
			location: route.query.location.toString(),
		}),
	}
	const searchObjFilters = {
		...(filters.search && { search: filters.search }),
		...(filters.location && {
			location: filters.location,
		}),
	}

	const obj = {
		...(isInitialLoad.value && { ...searchObj }),
		...(!isInitialLoad.value && { ...searchObjFilters }),
		...(filters.count && { count: filters.count.toString() }),
		...(filters.page && { page: filters.page.toString() }),
		...(priceFromCheck && {
			price_from: filters.price_from?.toString(),
		}),
		...(filters.price_to && { price_to: filters.price_to.toString() }),
		...(filters.activityType && { activityType: filters.activityType }),
		...(filters.categories?.length && {
			categories: filters.categories.join(','),
		}),
		...(filters.types?.length && { types: filters.types.join(',') }),
		...(filters.date?.start && {
			date_start: format(filters.date.start, 'yyyy-MM-dd'),
		}),
		...(filters.date?.end && {
			date_end: format(filters.date.end, 'yyyy-MM-dd'),
		}),
	}
	if (isInitialLoad.value) isInitialLoad.value = false

	$fetch<{
		data: TOffering[]
		meta: { total: number; min_price: number; max_price: number }
		error?: any
	}>('/api/search?' + new URLSearchParams(obj).toString())
		.then((response) => {
			const { data, meta, error } = response
			searchResults.value = data
			if (error) {
				alert(JSON.stringify(error))
				return
			}
			filters.total = meta?.total || 0
			priceRange.value = {
				price_from: meta.min_price || 0,
				price_to: meta.max_price || 0,
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
	ogImage: 'img/logoBg.svg',
	twitterCard: 'summary',
})
</script>
