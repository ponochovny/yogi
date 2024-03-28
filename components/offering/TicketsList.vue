<template>
	<div>
		<span v-if="label" class="text-sm font-bold text-gray-700">
			{{ label }}
		</span>
		<div class="flex flex-col gap-2">
			<div class="flex gap-2" v-for="(ticket, idx) of tickets" :key="idx">
				<Input v-model="ticket.name" placeholder="Ticket name" />
				<Input
					v-model="ticket.description"
					placeholder="Ticket description (optional)"
				/>
				<Input
					v-model="ticket.price"
					placeholder="Ticket price"
					type="number"
				/>
				<!-- CURRENCY SELECT -->
				<!-- STATUS SELECT -->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
</script>
