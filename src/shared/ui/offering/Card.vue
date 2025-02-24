<template>
	<div>
		<NuxtLink
			:to="`/offering/${offering.slug}`"
			class="block h-32 bg-gray-200 rounded-2xl"
		>
			<NuxtImg
				:src="getImageUrl().url"
				:alt="offering.name"
				:title="offering.name"
				:provider="getImageUrl().placeholder ? undefined : 'cloudinary'"
				format="webp"
				width="400"
				sizes="400px"
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
							'text-blue-500/90': offering.activity.toLowerCase() === 'class',
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
			<div class="text-sm mb-1 truncate" :title="offering.location?.name || ''">
				{{ offering.location?.name || '' }}
			</div>
			<NuxtLink
				:to="'studio/' + offering.studio?.slug"
				class="flex gap-1 items-center"
			>
				<NuxtImg
					v-if="offering.studio?.logo"
					:src="offering.studio?.logo.url"
					alt="Logo"
					provider="cloudinary"
					format="webp"
					class="w-8 h-8 rounded-full object-cover object-center"
					width="32"
					height="32"
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
import type { TOffering } from '~/src/app/types/offering'
import { dateString } from '~/src/shared/lib/utils'

export default defineComponent({
	name: 'OfferingCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	offering: TOffering
}
const props = defineProps<IProps>()

const getImageUrl = () => {
	if (props.offering.banners && props.offering.banners[0]) {
		return {
			placeholder: false,
			url: props.offering.banners[0].url,
		}
	}

	return {
		placeholder: true,
		url: 'img/banner-placeholder2.jpeg',
	}
}
</script>
