<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/src/shared/lib/utils'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tfoot
		:class="
			cn(
				'border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0',
				props.class
			)
		"
	>
		<slot />
	</tfoot>
</template>
