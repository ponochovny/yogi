<template>
	<div class="w-full">
		<label>
			<span v-if="props.label" class="text-sm font-bold text-gray-700">{{
				props.label
			}}</span>
			<input
				:placeholder="props.placeholder"
				:type="props.type"
				:value="props.modelValue"
				@input="(event: any) => emits('update:modelValue', event.target.value)"
				class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
			/>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Input',
})
</script>
<script lang="ts" setup>
const emits = defineEmits(['update:modelValue'])

const props = defineProps({
	modelValue: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		default: null,
	},
	placeholder: {
		type: String,
		default: '',
	},
	type: {
		type: String,
		default: 'text',
	},
})
</script>
