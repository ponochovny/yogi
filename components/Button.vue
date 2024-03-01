<template>
	<button
		class="px-8 py-2 transition duration-300 ease-in-out bg-orange-600 rounded-full hover:bg-orange-600/75"
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
<script lang="ts" setup></script>
