<template>
	<div class="h-full flex flex-col">
		<NuxtLink
			:to="`/studio/${studio.slug}`"
			class="block h-32 bg-gray-200 rounded-t-2xl"
		>
			<NuxtImg
				:src="getBannerUrl"
				:alt="studio.name"
				:title="studio.name"
				class="w-full h-full object-cover object-center rounded-t-2xl"
			/>
		</NuxtLink>
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-b-2xl mx-auto flex flex-col max-w-full w-full"
		>
			<div
				class="-mt-14 w-24 h-24 rounded-full border-4 border-white mb-2 bg-gray-100"
			>
				<NuxtImg
					:src="getLogoUrl"
					:alt="studio.name"
					:title="studio.name"
					class="w-full h-full object-cover object-center rounded-full"
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
			<div class="text-sm mb-1 line-clamp-4">
				{{ studio.bio || '' }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TStudio } from '~/helpers/types/studio'

export default defineComponent({
	name: 'StudioCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	studio: TStudio
}
const props = defineProps<IProps>()

const getBannerUrl = computed<string>(() => {
	if (props.studio.banner && props.studio.banner[0]) {
		return props.studio.banner[0].url
	}

	return 'img/banner-placeholder2.jpeg'
})
const getLogoUrl = computed<string>(() => {
	if (props.studio.logo && props.studio.logo.url) {
		return props.studio.logo.url
	}

	return 'img/logo-placeholder.png'
})
</script>
