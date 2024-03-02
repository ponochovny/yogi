<template>
	<button
		class="px-8 py-2 transition duration-300 ease-in-out bg-orange-600 rounded-full hover:bg-orange-600/75 disabled:bg-orange-600/20 disabled:cursor-default"
		:type="props.type"
	>
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Button',
})
</script>
<script lang="ts" setup>
const props = defineProps({
	type: {
		type: String as PropType<'button' | 'submit'>,
		default: 'button',
	},
})
</script>
