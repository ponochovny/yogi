<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tr
		:class="
			cn(
				'border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-muted',
				props.class
			)
		"
	>
		<slot />
	</tr>
</template>
