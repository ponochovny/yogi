<template>
	<div class="bg-white px-6 py-3 border-t shadow-lg flex gap-8">
		<!-- DATA TYPES FILTER -->
		<div class="flex gap-4">
			<button
				v-for="dataType of DATA_TYPES"
				:key="dataType"
				@click="setActivityType(dataType)"
				class="py-2 font-semibold relative after:h-[3px] after:w-[15px] after:bg-orange-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[12px] after:opacity-0"
				:class="{
					'after:opacity-100 text-orange-600': formData.activeType === dataType,
				}"
			>
				{{ dataType }}
			</button>
		</div>

		<!-- FILTERS: TYPES, CATEGORIES, DATE, PRICE -->
		<div class="flex gap-2">
			<Yselect
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
						variant="primaryOutline"
						:class="
							cn(
								'justify-start text-left font-normal',
								!formData.date.start && 'text-muted-foreground'
							)
						"
					>
						<template v-if="formData.date.start">
							<div class="flex gap-2 items-center">
								<span>{{ formattedDate() }}</span>
								<button
									@click.stop="clearDate"
									class="text-xs w-4 h-4 rounded-full flex items-center justify-center pb-[4px] bg-orange-600/40 text-white hover:text-white"
								>
									x
								</button>
							</div>
						</template>
						<template v-else> Pick a date </template>
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0 rounded-2xl">
					<CalendarPicker v-if="dateRange" v-model="dateRange" />
				</PopoverContent>
			</Popover>
			<Popover>
				<PopoverTrigger>
					<div class="w-24">Price</div>
				</PopoverTrigger>
				<PopoverContent
					:align="'start'"
					:arrowPadding="0"
					class="mt-2 max-w-[200px] rounded-2xl border-0 shadow-md"
				>
					<div>Price</div>
				</PopoverContent>
			</Popover>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import _data from '~/helpers/offeringAttributes.json'
import { DATA_TYPES } from '~/helpers/constants'
import type { ISearchParams, TDataType } from '~/helpers/types/search'
import { format } from 'date-fns'
import { cn } from '~/lib/utils'

export default defineComponent({
	name: 'Filters',
})
</script>
<script lang="ts" setup>
const emit = defineEmits(['update'])

const route = useRoute()
const router = useRouter()
const _categories = _data.categories
const _types = _data.types
const formData = reactive<ISearchParams>({
	activeType: DATA_TYPES[0],
	categories: [],
	types: [],
	date: {
		start: undefined,
		end: undefined,
	},
})
const dateRange = ref<Date[] | Date | undefined>()
function formattedDate() {
	const dStart = formData.date.start
		? format(formData.date.start, 'MMM dd')
		: ''
	const dEnd = formData.date.end ? format(formData.date.end, 'MMM dd') : ''

	if (dStart === dEnd) {
		return dStart
	} else {
		return `${dStart} - ${dEnd}`
	}
}
function dateChange(val: boolean) {
	if (!val) {
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
}
function clearDate() {
	dateRange.value = [new Date(), new Date()]
	formData.date.start = undefined
	formData.date.end = undefined
	update()
}

onMounted(() => {
	const { query } = route
	formData.activeType =
		(query.activeType?.toString() as TDataType) || DATA_TYPES[0]
	formData.types =
		query.types
			?.toString()
			.split(',')
			.filter((el) => _types.some((t) => t.name === el)) || []
	formData.categories =
		query.categories
			?.toString()
			.split(',')
			.filter((el) => _categories.some((c) => c.name === el)) || []
	formData.date = {
		start: query.start ? new Date(query.start.toString()) : undefined,
		end: query.end ? new Date(query.end.toString()) : undefined,
	}
	dateRange.value = [
		query.start ? (formData.date.start as Date) : new Date(),
		query.end ? (formData.date.end as Date) : new Date(),
	]

	update()
})

watch(formData, (val) => {
	const obj = {
		...route.query,
		...(val.activeType && { activeType: val.activeType }),
		...(val.categories.length && { categories: val.categories.join(',') }),
		...(val.types.length && { types: val.types.join(',') }),
		...(val.date.start && { start: format(val.date.start, 'yyyy-MM-dd') }),
		...(val.date.end && { end: format(val.date.end, 'yyyy-MM-dd') }),
	}
	if (!val.date.start) {
		delete obj.start
		delete obj.end
	}
	const params = new URLSearchParams({ ...obj }).toString()
	router.push('/search?' + params)
})

function setActivityType(type: TDataType) {
	formData.activeType = type
	update()
}

function update() {
	emit('update', formData)
}
</script>
