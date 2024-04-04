<template>
	<div class="bg-white px-6 py-3 border-t shadow-lg flex gap-8">
		<div class="flex gap-4">
			<button
				@click="formData.activeType = 'Offerings'"
				class="py-2 font-semibold relative after:h-[3px] after:w-[15px] after:bg-orange-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[12px] after:opacity-0"
				:class="{
					'after:opacity-100 text-orange-600':
						formData.activeType === 'Offerings',
				}"
			>
				Offerings
			</button>
			<button
				@click="formData.activeType = 'Studio & Event Hosts'"
				class="py-2 font-semibold relative after:h-[3px] after:w-[15px] after:bg-orange-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[12px] after:opacity-0"
				:class="{
					'after:opacity-100 text-orange-600':
						formData.activeType === 'Studio & Event Hosts',
				}"
			>
				Studio & Event Hosts
			</button>
			<button
				@click="formData.activeType = 'Practitioners'"
				class="py-2 font-semibold relative after:h-[3px] after:w-[15px] after:bg-orange-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[12px] after:opacity-0"
				:class="{
					'after:opacity-100 text-orange-600':
						formData.activeType === 'Practitioners',
				}"
			>
				Practitioners
			</button>
		</div>

		<div class="flex gap-2">
			<Yselect
				placeholder="Types"
				v-model="formData.types"
				:options="_types"
				field="name"
				value-prop="name"
				mode="multiple"
				class="!w-44"
			/>
			<Yselect
				placeholder="Categories"
				v-model="formData.categories"
				:options="_categories"
				field="name"
				value-prop="name"
				mode="multiple"
				class="!w-44"
			/>
			<Popover>
				<PopoverTrigger>
					<div class="w-24">Date</div>
				</PopoverTrigger>
				<PopoverContent
					:align="'start'"
					:arrowPadding="0"
					class="mt-2 max-w-[200px] rounded-2xl border-0 shadow-md"
				>
					<div>Date</div>
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

export default defineComponent({
	name: 'Filters',
})
</script>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const _categories = _data.categories
const _types = _data.types
// const activeType = ref<'Offerings' | 'Studio & Event Hosts' | 'Practitioners'>(
// 	'Offerings'
// )
const formData = reactive<{
	activeType: 'Offerings' | 'Studio & Event Hosts' | 'Practitioners'
	categories: string[]
	types: string[]
}>({
	activeType: 'Offerings',
	categories: [],
	types: [],
})

onMounted(() => {
	const { query } = route
	formData.activeType =
		(query.activeType?.toString() as
			| 'Offerings'
			| 'Studio & Event Hosts'
			| 'Practitioners') || 'Offerings'
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
})

watch(formData, (val) => {
	const params = new URLSearchParams({
		...route.query,
		...(val.activeType.length && { activeType: val.activeType }),
		...(val.categories.length && { categories: val.categories.join(',') }),
		...(val.types.length && { types: val.types.join(',') }),
	}).toString()
	router.push('/search?' + params)
})
</script>
