<script setup lang="ts">
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { cn } from '@/src/shared/lib/utils'

interface IProps {
	modelValue: Date
	label?: string
}

const props = defineProps<IProps>()
const emit = defineEmits(['update:model-value'])
</script>

<template>
	<Popover>
		<PopoverTrigger as-child>
			<div class="flex flex-col gap-1 w-full">
				<span v-if="props.label" class="text-sm font-bold text-gray-700">
					{{ props.label }}
				</span>
				<Button
					variant="outline"
					:class="
						cn(
							'w-full justify-start text-left font-normal',
							'border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-300 focus:ring-opacity-50 bg-white hover:bg-white px-[0.75rem] py-[0.5rem] text-black',
							!modelValue && 'text-muted-foreground'
						)
					"
					size="default"
					type="button"
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					<span>
						{{ modelValue ? format(modelValue, 'PPP') : 'Pick a date' }}
					</span>
				</Button>
			</div>
		</PopoverTrigger>
		<PopoverContent class="w-auto p-0">
			<Calendar
				:model-value="modelValue"
				@update:model-value="emit('update:model-value', $event)"
			/>
		</PopoverContent>
	</Popover>
</template>
