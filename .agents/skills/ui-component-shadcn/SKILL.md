---
name: ui-component-shadcn
description: >-
  Build, customize, or refactor Vue 3 UI components using Shadcn Vue, Radix Vue primitives, Tailwind CSS, and VeeValidate forms. Use this skill when implementing new UI elements, modals, cards, inputs, or complex interactive views.
---

# UI & Shadcn Vue Component Runbook

Use this runbook to create robust, accessible, and theme-consistent Vue 3 components in the Yogi design system.

---

## 1. Component Principles in Yogi

1. **Primitive-Driven**: Utilize primitives from `src/shared/ui/shadcn/` (Dialog, DropdownMenu, Select, Popover, Table, etc.).
2. **Tailwind Class Merging**: Always use `cn(...)` from `src/shared/lib/utils` when accepting a `class` prop to avoid conflicting Tailwind utility classes.
3. **TypeScript Strictness**: Define explicit interfaces for Props and Emits.
4. **Accessibility (a11y)**: Add semantic labels, aria attributes, and keyboard listeners.

---

## 2. Standard Component Template

```vue
<template>
	<div :class="cn('flex flex-col gap-3 rounded-xl border p-4 bg-card text-card-foreground', props.class)">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-lg">{{ title }}</h3>
			<Badge v-if="badge" variant="secondary">{{ badge }}</Badge>
		</div>

		<p v-if="description" class="text-sm text-muted-foreground">
			{{ description }}
		</p>

		<div class="mt-4 flex items-center gap-2">
			<Button :disabled="isLoading" @click="handleAction">
				<LoadingIcon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
				{{ actionLabel }}
			</Button>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { cn } from '~/src/shared/lib/utils'
import { Button } from '~/src/shared/ui/shadcn/button'
import { Badge } from '~/src/shared/ui/shadcn/badge'
import LoadingIcon from '~/src/shared/ui/LoadingIcon.vue'

interface Props {
	title: string
	description?: string
	badge?: string
	actionLabel?: string
	isLoading?: boolean
	class?: string
}

const props = withDefaults(defineProps<Props>(), {
	description: '',
	badge: '',
	actionLabel: 'Confirm',
	isLoading: false,
	class: '',
})

const emit = defineEmits<{
	(e: 'action'): void
}>()

const handleAction = () => {
	emit('action')
}
</script>
```

---

## 3. Form Component Template (VeeValidate + Zod)

When building form fields or modals with input validation:
```vue
<script setup lang="ts">
import { useField } from 'vee-validate'
import { Input } from '~/src/shared/ui/shadcn/input'

const props = defineProps<{
	name: string
	label: string
	placeholder?: string
}>()

const { value, errorMessage, handleBlur } = useField<string>(() => props.name)
</script>

<template>
	<div class="flex flex-col gap-1.5">
		<label :for="name" class="text-sm font-medium">{{ label }}</label>
		<Input
			:id="name"
			v-model="value"
			:placeholder="placeholder"
			:aria-invalid="!!errorMessage"
			@blur="handleBlur"
		/>
		<span v-if="errorMessage" class="text-xs text-destructive">
			{{ errorMessage }}
		</span>
	</div>
</template>
```

