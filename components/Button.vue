<template>
	<button
		class="flex items-center transition duration-300 ease-in-out bg-orange-600 rounded-full hover:bg-orange-600/75 disabled:bg-orange-600/20 disabled:cursor-default"
		:class="cn([props.btnSize === 'md' ? 'px-8 py-2' : 'px-3 py-1'])"
		:type="props.type"
	>
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/lib/utils'

export default defineComponent({
	name: 'Button',
})
</script>
<script lang="ts" setup>
interface IProps {
	type?: 'button' | 'submit'
	btnSize?: 'sm' | 'md'
}
const props = withDefaults(defineProps<IProps>(), {
	type: 'button',
	btnSize: 'md',
})
</script>
