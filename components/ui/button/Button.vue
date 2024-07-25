<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants } from '.'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-vue-next'

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant']
	size?: ButtonVariants['size']
	as?: string
	asChild?: boolean
	class?: HTMLAttributes['class']
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="asChild"
		:class="cn(buttonVariants({ variant, size }), props.class)"
	>
		<Loader2Icon v-if="props.loading" class="animate-spin mr-2" />
		<slot />
	</Primitive>
</template>
