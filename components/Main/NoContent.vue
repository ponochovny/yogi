<template>
	<div class="flex flex-col items-center justify-center">
		<RectangleStackIcon class="w-20 text-orange-600/50 stroke-[0.5] mb-6" />
		<h2 class="font-semibold text-2xl mb-4">
			{{ title }}
		</h2>
		<p>{{ text }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RectangleStackIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'NoContent',
})
</script>
<script lang="ts" setup>
interface IProps {
	title: string
	text: string
}
defineProps<IProps>()
</script>
