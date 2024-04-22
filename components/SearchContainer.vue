<template>
	<div class="relative" :class="cn(props.class)">
		<Header :links="false" variant="white">
			<template #left>
				<MainSearch variant="secondary" class="ml-24" />
			</template>
		</Header>

		<SearchFilters @update="emit('update', $event)" />

		<div :class="cn(props.contentClass)">
			<slot />
		</div>

		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/lib/utils'

export default defineComponent({
	name: 'SearchContainer',
})
</script>
<script lang="ts" setup>
interface IProps {
	class?: string
	contentClass?: string
}
const props = defineProps<IProps>()
const emit = defineEmits(['update'])
</script>
