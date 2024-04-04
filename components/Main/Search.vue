<template>
	<form class="flex" @submit.prevent="onSubmit">
		<Popover @update:open="openLocationEvent">
			<PopoverTrigger as="div">
				<div
					class="shadow-sm flex items-center"
					:class="{
						'rounded-tl-2xl rounded-bl-none rounded-r-none': isLocationOpen,
						'rounded-l-2xl rounded-r-none': !isLocationOpen,
						'gap-2 w-[300px] py-2 px-4 bg-white': variant === 'default',
						'gap-1 w-[230px] py-1 px-2 bg-gray-100/80': variant === 'secondary',
					}"
				>
					<MapPinIcon
						class="w-5 stroke-1 transition-colors"
						:class="{
							'text-gray-600': !isLocationOpen,
							'text-orange-600': isLocationOpen,
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
				class="-mt-1 rounded-b-2xl rounded-t-none border-0"
				:class="{
					'w-[300px] shadow-sm': variant === 'default',
					'w-[230px] shadow-lg': variant === 'secondary',
				}"
			>
				<div class="flex flex-col gap-2 w-full">content</div>
			</PopoverContent>
		</Popover>

		<Popover @update:open="openSearchEvent">
			<PopoverTrigger as="div">
				<div
					class="shadow-sm flex items-center rounded-none"
					:class="{
						'gap-2 w-[400px] py-2 px-4 bg-white': variant === 'default',
						'gap-1 w-[250px] py-1 px-2 bg-gray-100/80': variant === 'secondary',
					}"
				>
					<MagnifyingGlassIcon
						class="w-5 stroke-1 transition-colors"
						:class="{
							'text-gray-600': !isSearchOpen,
							'text-orange-600': isSearchOpen,
						}"
					/>
					<Input
						ref="searchInput"
						v-model="searchString"
						placeholder="Search"
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
				class="-mt-1 rounded-b-2xl rounded-t-none border-0"
				:class="{
					'w-[400px] shadow-sm': variant === 'default',
					'w-[250px] shadow-lg': variant === 'secondary',
				}"
			>
				<div class="flex flex-col gap-2 w-full">content</div>
			</PopoverContent>
		</Popover>
		<Button
			class="rounded-l-none rounded-r-2xl"
			:class="{
				'px-6': variant === 'default',
				'px-4': variant === 'secondary',
			}"
			btnSize="sm"
			type="submit"
		>
			<MagnifyingGlassIcon class="text-white w-6" />
		</Button>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'MainSearch',
})
</script>
<script lang="ts" setup>
interface IProps {
	variant?: 'default' | 'secondary'
}
withDefaults(defineProps<IProps>(), {
	variant: 'default',
})
const router = useRouter()
const locationString = ref('')
const searchString = ref('')
const locationInput = ref<any>(null)
const searchInput = ref<any>(null)
const isLocationOpen = ref(false)
const isSearchOpen = ref(false)
function openLocationEvent(val: boolean) {
	isLocationOpen.value = val
	if (val) {
		locationInput.value?.focus()
	}
}
function openSearchEvent(val: boolean) {
	isSearchOpen.value = val
	if (val) {
		searchInput.value?.focus()
	}
}
function onSubmit() {
	const params = new URLSearchParams({
		location: locationString.value,
		search: searchString.value,
	}).toString()
	router.push('/search?' + params)
}
</script>
