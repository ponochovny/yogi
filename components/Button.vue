<template>
	<button
		class="flex items-center transition duration-300 ease-in-out disabled:cursor-default"
		:class="[
			{ 'px-8 py-2': btnSize === 'md' },
			{ 'px-3 py-1': btnSize === 'sm' },
			{ 'px-4 py-2': btnSize === 'md2' },
			{
				'bg-orange-600 text-white rounded-full hover:bg-orange-600/75 hover:text-white disabled:bg-orange-600/20 disabled:opacity-50':
					variant === 'primary',
			},
			{
				'bg-transparent text-orange-600 rounded-full hover:bg-orange-400/10 hover:text-orange-600 disabled:bg-transparent disabled:opacity-50':
					variant === 'primaryOutline',
			},
			props.class,
		]"
		:type="props.type"
		:disabled="disabled"
	>
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Button',
})
</script>
<script lang="ts" setup>
interface IProps {
	type?: 'button' | 'submit'
	btnSize?: 'sm' | 'md' | 'md2'
	variant?: 'primary' | 'primaryOutline'
	class?: string
	disabled?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
	type: 'button',
	btnSize: 'md',
	variant: 'primary',
	class: '',
	disabled: false,
})
</script>
