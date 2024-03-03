<template>
	<div class="w-full">
		<label>
			<span v-if="props.label" class="text-sm font-bold text-gray-700">{{
				props.label
			}}</span>
			<input
				:placeholder="props.placeholder"
				:name="props.name"
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

interface IProps {
	name?: string
	modelValue: string
	label?: string | null
	placeholder?: string
	type?: string
}
const props = withDefaults(defineProps<IProps>(), {
	name: '',
	label: null,
	placeholder: '',
	type: 'text',
	autocomplete: false,
})
</script>
