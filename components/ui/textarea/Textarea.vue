<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
	class?: HTMLAttributes['class']
	defaultValue?: string | number
	modelValue?: string | number
	label?: string
	placeholder?: string
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue,
})
</script>

<template>
	<div class="w-full">
		<label>
			<span v-if="props.label" class="text-sm font-bold text-gray-700">{{
				props.label
			}}</span>
			<textarea
				v-model="modelValue"
				:placeholder="placeholder"
				:class="
					cn(
						'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-gray-300 shadow-sm focus-visible:border-orange-300 focus-visible:ring focus-visible:ring-orange-300 focus-visible:ring-opacity-50',
						props.class
					)
				"
			/>
		</label>
	</div>
</template>
