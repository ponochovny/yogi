<template>
	<form class="flex" @submit.prevent="onSubmit">
		<Popover @update:open="openLocationEvent">
			<PopoverTrigger as="div">
				<div
					class="w-[300px] py-2 px-4 bg-white shadow-sm flex gap-2 items-center"
					:class="{
						'rounded-tl-2xl rounded-bl-none rounded-r-none': isLocationOpen,
						'rounded-l-2xl rounded-r-none': !isLocationOpen,
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
						class="border-none shadow-none ring-0"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				:align="'start'"
				:arrowPadding="0"
				class="-mt-1 w-[300px] rounded-b-2xl rounded-t-none border-0 shadow-sm"
			>
				<div class="flex flex-col gap-2 w-full">content</div>
			</PopoverContent>
		</Popover>

		<Popover @update:open="openSearchEvent">
			<PopoverTrigger as="div">
				<div
					class="w-[400px] py-2 px-4 bg-white shadow-sm flex gap-2 items-center rounded-none"
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
						class="border-none shadow-none ring-0"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				:align="'start'"
				:arrowPadding="0"
				class="-mt-1 w-[400px] rounded-b-2xl rounded-t-none border-0 shadow-sm"
			>
				<div class="flex flex-col gap-2 w-full">content</div>
			</PopoverContent>
		</Popover>
		<Button
			class="rounded-l-none rounded-r-2xl px-6"
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
