<template>
	<div class="w-full" :class="cn(props.class)">
		<label>
			<span v-if="label" class="text-sm font-bold text-gray-700">
				{{ label }}
			</span>
			<input
				ref="input"
				@focus="emit('focus')"
				:id="id ? id : undefined"
				:placeholder="placeholder"
				:name="name"
				:type="type"
				:value="modelValue"
				@input="(event: any) => emit('update:modelValue', event.target.value)"
				class="block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
				:class="cn(props.inputClass)"
			/>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '~/lib/utils'

export default defineComponent({
	name: 'Input',
})
</script>
<script lang="ts" setup>
const emit = defineEmits(['update:modelValue', 'focus'])

interface IProps {
	name?: string
	modelValue: string
	label?: string | null
	placeholder?: string
	type?: string
	id?: string
	class?: any
	inputClass?: any
}

const props = withDefaults(defineProps<IProps>(), {
	name: '',
	label: null,
	placeholder: '',
	type: 'text',
	autocomplete: false,
	id: '',
})

const input = ref<any>(null)

function focus() {
	input.value?.focus()
}

defineExpose({ focus })
</script>
