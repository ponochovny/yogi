<template>
	<div class="h-full flex flex-col">
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-2xl mx-auto flex flex-col max-w-full w-full"
		>
			<NuxtImg
				provider="cloudinary"
				format="webp"
				:src="getProfileImageUrl"
				:alt="practitioner.name || ''"
				:title="practitioner.name"
				class="w-24 h-24 object-cover object-center rounded-full mb-4"
			/>
			<div class="mb-1">
				<NuxtLink :to="`/practitioner/${practitioner.id}`">
					<span class="font-semibold">{{ practitioner.name }}</span>
				</NuxtLink>
			</div>
			<div class="text-sm mb-1 line-clamp-4">
				{{ practitioner.bio || '' }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TPractitioner } from '~/server/types'

export default defineComponent({
	name: 'PractitionerCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	practitioner: TPractitioner
}
const props = defineProps<IProps>()

const getProfileImageUrl = computed<string>(() => {
	return props.practitioner.profileImage || 'img/logo-placeholder.png'
})
</script>
