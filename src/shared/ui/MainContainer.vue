<template>
	<div
		class="relative max-w-screen-xl pt-3 mx-auto px-4"
		:class="cn(props.class)"
	>
		<Header />

		<div :class="cn(props.contentClass)">
			<slot />
		</div>

		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/src/shared/lib/utils'
import { Header } from '~/src/shared/ui/Header'

export default defineComponent({
	name: 'MainContainer',
})
</script>
<script lang="ts" setup>
interface IProps {
	class?: string
	contentClass?: string
}
const props = defineProps<IProps>()
</script>
