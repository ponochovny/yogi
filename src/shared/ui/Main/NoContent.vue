<template>
	<div class="flex flex-col items-center justify-center">
		<RectangleStackIcon
			class="md:w-20 w-14 text-orange-600/50 stroke-[0.5] md:mb-6 md-3"
		/>
		<h2 class="font-semibold text-xl md:text-2xl mb-2 md:mb-4">
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
