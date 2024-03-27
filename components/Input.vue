<template>
	<div class="w-full">
		<label>
			<span v-if="label" class="text-sm font-bold text-gray-700">
				{{ label }}
			</span>
			<input
				:id="id ? id : undefined"
				:placeholder="placeholder"
				:name="name"
				:type="type"
				:value="modelValue"
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

interface IProps {
	name?: string
	modelValue: string
	label?: string | null
	placeholder?: string
	type?: string
	id?: string
}

withDefaults(defineProps<IProps>(), {
	name: '',
	label: null,
	placeholder: '',
	type: 'text',
	autocomplete: false,
	id: '',
})
</script>
