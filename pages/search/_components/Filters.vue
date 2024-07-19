<template>
	<div
		class="bg-white px-6 py-3 border-t shadow-lg flex gap-8 lg:h-16 flex-col-reverse lg:flex-row"
	>
		<!-- DATA TYPES FILTER -->
		<div class="flex gap-4">
			<button
				v-for="dataType of DATA_TYPES"
				:key="dataType"
				@click="setActivityType(dataType)"
				class="py-2 font-semibold relative after:h-[3px] after:w-[15px] after:bg-orange-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[12px] after:opacity-0 text-nowrap"
				:class="{
					'after:opacity-100 text-orange-600':
						formData.activityType === dataType,
				}"
			>
				{{ dataType }}
			</button>
		</div>

		<!-- FILTERS: TYPES, CATEGORIES, DATE, PRICE -->
		<div v-if="isOfferings" class="flex gap-2 flex-wrap">
			<Yselect
				variant="button"
				@close="update"
				placeholder="Types"
				v-model="formData.types"
				:options="_types"
				field="name"
				value-prop="name"
				mode="multiple"
				class="!w-44"
			/>
			<Yselect
				variant="button"
				@close="update"
				placeholder="Categories"
				v-model="formData.categories"
				:options="_categories"
				field="name"
				value-prop="name"
				mode="multiple"
				class="!w-44"
			/>
			<Popover @update:open="dateChange">
				<PopoverTrigger as-child>
					<Button
						variant="outline"
						class="justify-start text-left font-normal h-[40px] text-nowrap"
					>
						<template v-if="formData.date.start">
							<div class="flex gap-2 items-center">
								<span>
									{{ formattedDate(formData.date.start, formData.date.end) }}
								</span>
								<button
									@click.stop="clearDate"
									class="text-xs w-4 h-4 rounded-full flex items-center justify-center pb-[4px] bg-orange-400/80 text-white hover:text-white"
									title="Clear date"
								>
									x
								</button>
							</div>
						</template>
						<template v-else> <div>Pick a date</div> </template>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					class="w-auto p-0 rounded-t-none rounded-b-2xl mt-2 border-gray-200/80"
				>
					<CalendarPicker v-if="dateRange" v-model="dateRange" />
				</PopoverContent>
			</Popover>
			<Popover @update:open="priceChange">
				<PopoverTrigger as-child>
					<Button
						variant="outline"
						class="justify-start text-left font-normal h-[40px] text-nowrap"
					>
						<div class="">
							{{
								isPriceDefault
									? 'Price'
									: `${currencySymbol}${priceSelected[0] / 100} - 
${currencySymbol}${priceSelected[1] / 100}`
							}}
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					:align="'start'"
					:arrowPadding="0"
					class="mt-2 max-w-[250px] rounded-b-2xl rounded-t-none border-0 border-t-[1px] border-gray-200/80 shadow-md pt-6 pb-3"
				>
					<div class="flex gap-2 text-nowrap flex-col">
						<div class="w-full">
							<Slider
								:default-value="[33]"
								:max="_priceRange[1]"
								:min="_priceRange[0]"
								:step="100"
								v-model="priceSelected"
								:minStepsBetweenThumbs="1"
							/>
						</div>
						<div class="flex justify-between">
							<span class="">
								{{ `${currencySymbol}${priceSelected[0] / 100}` }}
							</span>
							<span class="">
								{{ `${currencySymbol}${priceSelected[1] / 100}` }}
							</span>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import _data from '~/helpers/offeringAttributes.json'
import { DATA_TYPES } from '~/helpers/constants'
import type { ISearchParams, TDataType } from '~/helpers/search/types'
import { format } from 'date-fns'
import { currencySymbolByCode } from '~/helpers'
import { setDataByRouteQuery, formattedDate } from '@/pages/search/_helpers'

export default defineComponent({
	name: 'Filters',
})
</script>
<script lang="ts" setup>
const props = defineProps<{ priceRange: [number, number] }>()
const emit = defineEmits(['update'])

const route = useRoute()
const router = useRouter()
const _categories = _data.categories
const _types = _data.types
const formData = reactive<ISearchParams>({
	activityType: DATA_TYPES[0],
	categories: [],
	types: [],
	date: {
		start: undefined,
		end: undefined,
	},
	// page: 1,
	// count: 3,
	// price_from: 6000,
	// price_to: 6200,
})
const currencySymbol = computed(() => currencySymbolByCode('USD'))
const isOfferings = computed(() => route.query.activityType === 'Offerings')
const dateRange = ref<Date[] | Date | undefined>()

function update() {
	emit('update', formData)
}

function dateChange(val: boolean) {
	if (val) return

	const _isArray = isArray(dateRange.value)
	if (
		!formData.date.start &&
		_isArray &&
		format((dateRange.value as Date[])[0], 'yyyy-MM-dd') ===
			format((dateRange.value as Date[])[1], 'yyyy-MM-dd')
	) {
		return
	}
	if (_isArray) {
		const dates = [...(dateRange.value as Date[])]
		const _isEndDate = dates.length > 1

		formData.date.start = dates[0]
		formData.date.end = _isEndDate ? dates[1] : dates[0]
	} else {
		formData.date.start = dateRange.value as Date
		formData.date.end = dateRange.value as Date
	}
	update()
}
function clearDate() {
	dateRange.value = [new Date(), new Date()]
	formData.date.start = undefined
	formData.date.end = undefined
	update()
}
function priceChange(val: boolean) {
	if (val) return

	formData.price_from = priceSelected.value[0]
	formData.price_to = priceSelected.value[1]

	update()
}

onMounted(() => {
	setDataByRouteQuery(route.query, formData, dateRange, priceSelected)

	update()
})

watch(formData, (val) => {
	routerPushWithFormData(val, val.activityType !== DATA_TYPES[0])
})

function routerPushWithFormData(val: ISearchParams, isReset?: boolean) {
	const obj = {
		...(val.activityType && { activityType: val.activityType }),
		...(val.categories.length && { categories: val.categories.join(',') }),
		...(val.types.length && { types: val.types.join(',') }),
		...(val.date.start && { start: format(val.date.start, 'yyyy-MM-dd') }),
		...(val.date.end && { end: format(val.date.end, 'yyyy-MM-dd') }),
		...(val.price_from && { price_from: val.price_from.toString() }),
		...(val.price_to && { price_to: val.price_to.toString() }),
	}
	const params = new URLSearchParams({
		...(!isReset && route.query),
		...obj,
	}).toString()

	router.push('/search?' + params)
}

function changeTypeResetFilters() {
	formData.categories = []
	formData.types = []
	formData.date = { start: undefined, end: undefined }
	// formData.location = ''
	// formData.search = ''
	formData.price_from = undefined
	formData.price_to = undefined

	resetPriceData()
}

function setActivityType(type: TDataType) {
	formData.activityType = type

	if (type !== DATA_TYPES[0]) {
		changeTypeResetFilters()
	}

	update()
}

/** PRICE */
const PRICE_DEFAULT = [0, 0]
const _priceRange = ref(PRICE_DEFAULT)
const priceSelected = ref(PRICE_DEFAULT)
const isPriceDefault = computed(
	() =>
		JSON.stringify(priceSelected.value) === JSON.stringify(_priceRange.value)
)
watch(
	() => props.priceRange,
	(val, oldVal) => {
		if (JSON.stringify(val) === JSON.stringify(oldVal)) return

		_priceRange.value = [...val]
		if (JSON.stringify(priceSelected.value) === JSON.stringify(PRICE_DEFAULT)) {
			priceSelected.value = [...val]
		}
	}
)
function resetPriceData() {
	_priceRange.value = PRICE_DEFAULT
	priceSelected.value = PRICE_DEFAULT
}
</script>
