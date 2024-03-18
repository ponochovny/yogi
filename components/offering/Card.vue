<template>
	<div>
		<NuxtLink to="/" class="block h-32 bg-gray-200 rounded-2xl">
			<NuxtImg
				:src="getImageUrl"
				:alt="offering.name"
				:title="offering.name"
				class="w-full h-full object-cover object-center rounded-2xl"
			/>
		</NuxtLink>
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-2xl -mt-4 w-[95%] mx-auto"
		>
			<div class="flex gap-1 text-sm mb-1">
				<div class="flex gap-1 text-xs font-semibold">
					<span
						class="text-green-700"
						:class="activityColorClass(offering.activity)"
					>
						{{ offering.activity }}
					</span>
					<span> • </span>
				</div>
				<div class="flex flex-wrap">
					<span
						v-for="cat of offering.categories"
						:key="cat"
						class="text-xs mr-1"
					>
						{{ cat }}
					</span>
				</div>
			</div>
			<div class="mb-1">
				<NuxtLink to="/">
					<span class="font-semibold">{{ offering.name }}</span>
				</NuxtLink>
			</div>
			<div class="text-sm font-semibold text-gray-500 mb-1">
				{{
					`${format(new Date(offering.start), 'MMM dd')} - ${format(
						new Date(offering.end),
						'MMM dd'
					)}`
				}}
			</div>
			<div class="text-sm mb-1">
				{{ offering.location ? offering.location[0] : '' }}
			</div>
			<NuxtLink to="/" class="flex gap-1 items-center">
				<img
					v-if="offering.studio.logo?.length"
					:src="offering.studio.logo[0].url"
					alt=""
					class="w-8 h-8 rounded-full object-cover object-center"
				/>
				<span class="text-sm font-semibold">
					{{ offering.studio.name }}
				</span>
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { format } from 'date-fns'
import type { IOffering } from '~/helpers/types/offering'

export default defineComponent({
	name: 'OfferingCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	offering: IOffering
}
const props = defineProps<IProps>()

function activityColorClass(activity: string) {
	if (activity.toLowerCase() === 'class') {
		return 'text-blue-700'
	}
	if (activity.toLowerCase() === 'event') {
		return 'text-red-400'
	}
	if (activity.toLowerCase() === 'appointment') {
		return 'text-yellow-500'
	}
}

const getImageUrl = computed<string>(() => {
	if (props.offering.banners && props.offering.banners[0]) {
		return props.offering.banners[0].url
	}

	return 'img/banner-placeholder2.jpeg'
})
</script>
