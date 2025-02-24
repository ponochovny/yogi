<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
	<Sonner
		class="toaster group"
		v-bind="props"
		:toast-options="{
			classes: {
				toast:
					'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
				description: 'group-[.toast]:text-muted-foreground',
				actionButton:
					'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
				cancelButton:
					'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
				error: '!bg-red-300 !border-red-400',
				success: '!bg-green-300 !border-green-400',
				warning: '!bg-yellow-300 !border-yellow-400',
				info: '!bg-blue-300 !border-blue-400',
			},
		}"
	/>
</template>
