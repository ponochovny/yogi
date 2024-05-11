<template>
	<div class="flex gap-4 py-10 border-t border-slate-200 px-6">
		<span class="text-xs">Yogi © {{ new Date().getFullYear() }}</span>
		<NuxtLink to="/" class="text-xs">
			<span>Terms, Conditions & Privacy policy</span>
		</NuxtLink>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Footer',
})
</script>
<script lang="ts" setup></script>
