<template>
	<div>
		<NuxtLink
			:to="`/offering/${offering.slug}`"
			class="block h-32 bg-gray-200 rounded-2xl"
		>
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
						class="capitalize font-bold"
						:class="{
							'text-cyan-700': offering.activity.toLowerCase() === 'class',
							'text-red-400': offering.activity.toLowerCase() === 'event',
							'text-yellow-500':
								offering.activity.toLowerCase() === 'appointment',
						}"
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
				<NuxtLink :to="`/offering/${offering.slug}`">
					<span class="font-semibold">{{ offering.name }}</span>
				</NuxtLink>
			</div>
			<div class="text-sm font-semibold text-gray-500 mb-1">
				{{ dateString(offering.start, offering.end) }}
			</div>
			<div class="text-sm mb-1">
				{{ offering.location ? offering.location[0] : '' }}
			</div>
			<NuxtLink
				:to="'studio/' + offering.studio?.slug"
				class="flex gap-1 items-center"
			>
				<img
					v-if="offering.studio?.logo"
					:src="offering.studio?.logo.url"
					alt=""
					class="w-8 h-8 rounded-full object-cover object-center"
				/>
				<span class="text-sm font-semibold">
					{{ offering.studio?.name }}
				</span>
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { IOffering } from '~/helpers/types/offering'
import { dateString } from '~/lib/utils'

export default defineComponent({
	name: 'OfferingCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	offering: IOffering
}
const props = defineProps<IProps>()

const getImageUrl = computed<string>(() => {
	if (props.offering.banners && props.offering.banners[0]) {
		return props.offering.banners[0].url
	}

	return 'img/banner-placeholder2.jpeg'
})
</script>
