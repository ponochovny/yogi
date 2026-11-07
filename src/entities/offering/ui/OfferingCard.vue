<template>
	<div>
		<NuxtLink
			:to="`/offering/${offering.slug}`"
			class="block h-32 bg-gray-200 rounded-2xl overflow-hidden"
		>
			<NuxtImg
				:src="banner.src.value"
				:alt="offering.name"
				:title="offering.name"
				:provider="banner.provider.value"
				placeholder="/img/banner-placeholder2.jpeg"
				format="webp"
				width="400"
				sizes="400px"
				class="w-full h-full object-cover object-center"
				@error="banner.onError"
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
				v-if="offering.studio"
				:to="`/studio/${offering.studio.slug}`"
				class="flex gap-1 items-center"
			>
				<div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
					<NuxtImg
						:src="studioLogo.src.value"
						alt="Logo"
						:provider="studioLogo.provider.value"
						placeholder="/img/logo-placeholder.png"
						format="webp"
						class="w-full h-full object-cover object-center rounded-full"
						width="32"
						height="32"
						@error="studioLogo.onError"
					/>
				</div>
				<span class="text-sm font-semibold truncate">
					{{ offering.studio.name }}
				</span>
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TOffering } from '~/src/app/types/offering'
import { dateString } from '~/src/shared/lib/utils'
import { useImageFallback } from '~/src/shared/lib/useImageFallback'

export default defineComponent({
	name: 'OfferingCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	offering: TOffering
}
const props = defineProps<IProps>()

const banner = useImageFallback(
	() => props.offering.banners?.[0]?.url,
	'banner',
)

const studioLogo = useImageFallback(
	() => props.offering.studio?.logo?.url,
	'logo',
)
</script>
