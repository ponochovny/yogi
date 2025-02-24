<template>
	<form
		class="flex flex-col w-full"
		:class="{
			'sm:w-auto sm:flex-row shadow-sm rounded-2xl': variant === 'default',
			'w-full md:flex-row': variant === 'secondary',
		}"
		@submit.prevent="onSubmit"
	>
		<Popover @update:open="openLocationEvent">
			<PopoverTrigger as="div" aria-role="button">
				<div
					class="shadow-sm flex items-center"
					:class="{
						'gap-2 w-full sm:w-[250px] md:w-[300px] py-2 px-4 bg-white':
							variant === 'default',
						'rounded-t-2xl sm:rounded-tl-2xl sm:rounded-bl-none sm:rounded-r-none':
							isLocationOpen && variant === 'default',
						'rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none':
							!isLocationOpen && variant === 'default',

						'gap-1 w-full md:w-[250px] py-1 px-2 bg-gray-100/80':
							variant === 'secondary',
						'rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-none md:rounded-r-none':
							isLocationOpen && variant === 'secondary',
						'rounded-t-2xl md:rounded-l-2xl md:rounded-r-none':
							!isLocationOpen && variant === 'secondary',
					}"
				>
					<MapPinIcon
						class="w-5 stroke-1 transition-colors"
						:class="{
							'text-gray-600': !isLocationOpen,
							'text-primary': isLocationOpen,
						}"
					/>
					<Input
						ref="locationInput"
						v-model="locationString"
						placeholder="City or state or country"
						:inputClass="{
							'border-none !shadow-none ring-0': true,
							'bg-gray-100/80': variant === 'secondary',
						}"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				:align="'start'"
				:arrowPadding="0"
				:avoidCollisions="false"
				@openAutoFocus.prevent
				side="bottom"
				class="-mt-1 rounded-b-2xl rounded-t-none border-0"
				:class="{
					'w-[calc(100vw_-_2rem)] sm:w-[250px] md:w-[300px] shadow-sm':
						variant === 'default',
					'w-[250px] shadow-lg': variant === 'secondary',
				}"
			>
				<div class="flex flex-col gap-2 w-full">
					<button
						class="text-left flex gap-4 items-center shrink-0"
						@click="handleCurrentLocationOption"
					>
						<MapIcon class="w-5 stroke-1" />
						<span>Use my current location</span>
						<LoadingIcon v-if="locationFetching" class="fill-primary" />
					</button>
					<button
						class="text-left flex gap-4 items-center shrink-0"
						@click="locationString = 'Online'"
					>
						<VideoCameraIcon class="w-5 stroke-1" />
						<span>Online</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>

		<Popover @update:open="openSearchEvent" :open="isSearchOpen">
			<PopoverTrigger as="div" aria-role="button">
				<div
					class="shadow-sm flex items-center rounded-none"
					:class="{
						'gap-2 w-full sm:w-[300px] md:w-[400px] py-2 px-4 bg-white':
							variant === 'default',
						'gap-1 w-full md:w-[250px] py-1 px-2 bg-gray-100/80':
							variant === 'secondary',
					}"
				>
					<MagnifyingGlassIcon
						class="w-5 stroke-1 transition-colors"
						:class="{
							'text-gray-600': !isSearchOpen,
							'text-primary': isSearchOpen,
						}"
					/>
					<template v-if="variant === 'default'">
						<Input
							ref="searchInput"
							@click="searchInputClick"
							@focus="searchInputFocus"
							@input="globalSearchDebounce"
							:modelValue="searchString"
							placeholder="Search"
							:inputClass="{
								'border-none !shadow-none ring-0': true,
							}"
						/>
					</template>
					<template v-else>
						<Input
							v-model="searchString"
							placeholder="Search"
							:inputClass="{
								'border-none !shadow-none ring-0 bg-gray-100/80': true,
							}"
						/>
					</template>
				</div>
			</PopoverTrigger>
			<PopoverContent
				v-if="variant !== 'secondary'"
				:align="'start'"
				:arrowPadding="0"
				:avoidCollisions="false"
				@openAutoFocus.prevent
				side="bottom"
				class="-mt-1 rounded-b-2xl rounded-t-none border-0 p-1 py-3 max-h-[484px] overflow-y-auto"
				:class="{
					'w-[calc(100vw_-_2rem)] sm:w-[300px] md:w-[400px] shadow-sm':
						variant === 'default',
					// 'w-[250px] shadow-lg': variant === 'secondary',
				}"
			>
				<div class="flex flex-col gap-2 w-full">
					<MainSearchList
						:loading="searchResultsFetching"
						:data="searchResults"
					/>
				</div>
			</PopoverContent>
		</Popover>
		<Button
			class=""
			:class="{
				'rounded-none rounded-b-2xl sm:rounded-l-none sm:rounded-r-2xl flex gap-2 items-center justify-center sm:justify-start px-4 py-3 sm:py-0 sm:px-6':
					variant === 'default',
				'rounded-none rounded-b-2xl md:rounded-l-none md:rounded-r-2xl flex gap-2 items-center justify-center md:justify-start px-4 py-3 md:py-0':
					variant === 'secondary',
			}"
			size="sm"
			type="submit"
			title="Search"
		>
			<MagnifyingGlassIcon
				class="text-white w-6"
				:class="{
					'hidden sm:block': variant === 'default',
					'hidden md:block': variant === 'secondary',
				}"
			/>
			<span
				:class="{
					'block sm:hidden font-semibold': variant === 'default',
					'block md:hidden': variant === 'secondary',
				}"
			>
				Search
			</span>
		</Button>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { toast } from 'vue-sonner'
import {
	MapPinIcon,
	MagnifyingGlassIcon,
	MapIcon,
	VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import type { IShortSearchData } from '~/src/app/types/search/types'

export default defineComponent({
	name: 'MainSearch',
})
</script>
<script lang="ts" setup>
interface IProps {
	variant?: 'default' | 'secondary'
}
const props = withDefaults(defineProps<IProps>(), {
	variant: 'default',
})
const emit = defineEmits(['update'])
const route = useRoute()
const router = useRouter()
const locationString = ref('')
const searchString = ref('')
const locationInput = ref<HTMLInputElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isLocationOpen = ref(false)
const isSearchOpen = ref(false)
function openLocationEvent(val: boolean) {
	isLocationOpen.value = val
	if (val) {
		locationInput.value?.focus()
	}
}
function onSubmit() {
	const obj = {
		location: locationString.value,
		search: searchString.value,
	}

	if (props.variant === 'secondary') {
		update(obj)
	}
	const params = new URLSearchParams({
		...(props.variant === 'secondary' && route.query),
		...obj,
	}).toString()
	router.push('/search?' + params)
}
function update(data: any) {
	emit('update', data)
}
onMounted(() => {
	const { query } = route
	if (query.location && typeof query.location === 'string') {
		locationString.value = query.location
	}
	if (query.search && typeof query.search === 'string') {
		searchString.value = query.search
	}
})

const { fetchFeaturesByCoords } = useMyMap()
const locationFetching = ref(false)
const feature = ref<any>(null)
async function handleCurrentLocationOption() {
	const success = async (position: any) => {
		const latitude = position.coords.latitude
		const longitude = position.coords.longitude

		// Do something with the position
		const res: any = await fetchFeaturesByCoords([latitude, longitude])

		const cityCountryFeature = res.data.features.find((el: any) =>
			el.place_type.includes('region')
		)

		const { center, place_name } = cityCountryFeature

		const _feature = {
			coords: [center[1], center[0]],
			place_name: place_name,
		}

		feature.value = _feature

		locationString.value = place_name
		locationFetching.value = false
	}

	const error = (err: any) => {
		console.log(err)
		locationFetching.value = false
		toast.error('Error ocurred')
	}

	if (feature.value) {
		const { place_name } = feature.value
		locationString.value = place_name
	} else {
		locationFetching.value = true
		// This will open permission popup
		navigator.geolocation.getCurrentPosition(success, error, {
			enableHighAccuracy: false,
			maximumAge: Infinity,
		})
	}
}

function searchInputClick(e: any) {
	if (isSearchOpen.value) {
		e.stopPropagation()
	}
}
function searchInputFocus() {
	if (props.variant === 'secondary') return

	if (!searchString.value && !searchResults.value) {
		shortSearchHandler('')
	}
	isSearchOpen.value = true
}

const { shortSearch } = useSearch()
const searchResults = ref<IShortSearchData | null>(null)
const searchResultsFetching = ref(false)
async function shortSearchHandler(val: string) {
	if (props.variant === 'secondary') return

	searchResultsFetching.value = true
	const { data } = await shortSearch(val)
	searchResults.value = data
	searchResultsFetching.value = false
}
const globalSearchDebounce = useDebounce(async (e: any) => {
	if (props.variant === 'secondary') return
	if (!e?.target) return

	await shortSearchHandler(e.target.value)

	searchString.value = e.target.value
}, 1000)

function openSearchEvent(val: boolean) {
	if (val) {
		searchInput.value?.focus()
		searchInputFocus()
		return
	}
	isSearchOpen.value = val
}
</script>
