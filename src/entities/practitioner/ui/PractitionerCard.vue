<template>
	<div class="h-full flex flex-col">
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-2xl mx-auto flex flex-col max-w-full w-full"
		>
			<div class="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4 shrink-0">
				<NuxtImg
					:src="avatar.src.value"
					:provider="avatar.provider.value"
					format="webp"
					:alt="practitioner.name || ''"
					:title="practitioner.name"
					placeholder="/img/logo-placeholder.png"
					class="w-full h-full object-cover object-center rounded-full"
					width="96"
					height="96"
					@error="avatar.onError"
				/>
			</div>
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
import { useImageFallback } from '~/src/shared/lib/useImageFallback'

export default defineComponent({
	name: 'PractitionerCard',
})
</script>
<script lang="ts" setup>
interface IProps {
	practitioner: TPractitioner
}
const props = defineProps<IProps>()

const avatar = useImageFallback(
	() => props.practitioner.profileImage,
	'logo',
)
</script>
