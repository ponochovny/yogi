<template>
	<div>
		<span v-if="label" class="text-sm font-bold text-gray-700">
			{{ label }}
		</span>
		<div class="flex flex-col gap-2">
			<div
				class="relative flex gap-2 flex-col md:flex-row"
				v-for="(ticket, idx) of tickets"
				:key="idx"
			>
				<Input v-model="ticket.name" placeholder="Ticket name" />
				<Input
					v-model="ticket.description"
					placeholder="Ticket description (optional)"
				/>
				<Input
					:modelValue="ticket.price"
					@update:modelValue="ticket.price = Number($event)"
					placeholder="Ticket price"
					type="number"
					class="md:max-w-32"
					step="any"
				/>
				<!-- CURRENCY SELECT -->
				<!-- STATUS SELECT -->
				<button
					v-if="tickets.length > 1"
					@click="emit('remove', idx)"
					class="flex items-center gap-2"
				>
					<span class="md:hidden">Remove</span>
					<XMarkIcon class="w-5" />
				</button>
				<div class="border md:hidden" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'TicketsList',
})
</script>
<script lang="ts" setup>
interface IProps {
	label?: string
	tickets: any[]
}
const props = defineProps<IProps>()
const emit = defineEmits(['remove'])
</script>
