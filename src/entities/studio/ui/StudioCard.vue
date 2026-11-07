<template>
	<div class="h-full flex flex-col">
		<NuxtLink
			:to="`/studio/${studio.slug}`"
			class="block h-32 bg-gray-200 rounded-t-2xl overflow-hidden relative"
		>
			<NuxtImg
				:src="banner.src.value"
				:alt="studio.name"
				:title="studio.name"
				class="w-full h-full object-cover object-center rounded-t-2xl"
				:provider="banner.provider.value"
				placeholder="/img/banner-placeholder2.jpeg"
				format="webp"
				sizes="305px lg:405px"
				@error="banner.onError"
			/>
		</NuxtLink>
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-b-2xl mx-auto flex flex-col max-w-full w-full grow"
		>
			<div
				class="-mt-14 w-24 h-24 rounded-full border-4 border-white mb-2 bg-gray-100 overflow-hidden flex items-center justify-center shrink-0"
			>
				<NuxtImg
					:provider="logo.provider.value"
					:src="logo.src.value"
					:alt="'Logo of ' + studio.name"
					:title="studio.name"
					class="w-full h-full object-cover object-center rounded-full"
					placeholder="/img/logo-placeholder.png"
					width="96"
					height="96"
					format="webp"
					@error="logo.onError"
				/>
			</div>
			<div class="mb-1">
				<NuxtLink :to="`/studio/${studio.slug}`">
					<span class="font-semibold">{{ studio.name }}</span>
				</NuxtLink>
			</div>
			<div
				class="text-sm mb-1 truncate font-semibold text-gray-600"
				:title="studio.location?.name || ''"
			>
				{{ studio.location?.name || '' }}
			</div>
			<div class="text-sm mb-1 line-clamp-2">
				{{ studio.bio || '' }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TStudio } from '~/src/app/types/studio'
import { useImageFallback } from '~/src/shared/lib/useImageFallback'

export default defineComponent({
	name: 'StudioCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	studio: TStudio
}
const props = defineProps<IProps>()

const banner = useImageFallback(
	() => props.studio.banner?.[0]?.url,
	'banner',
)

const logo = useImageFallback(
	() => props.studio.logo?.url,
	'logo',
)
</script>
