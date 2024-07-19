<template>
	<div class="relative" :class="cn(props.class)">
		<Header :links="false" variant="white" class="sm:px-6">
			<template #left>
				<MainSearch
					variant="secondary"
					class="px-4 md:p-0 md:ml-6 lg:ml-16 xl:ml-24"
					@update="emit('update', $event)"
				/>
			</template>
		</Header>

		<Filters
			@update="emit('update', $event)"
			class="transition-opacity"
			:class="{ 'opacity-80 pointer-events-none': loading }"
			:priceRange="priceRange"
		/>

		<div :class="cn(props.contentClass)">
			<slot />
		</div>

		<Footer variant="white" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/lib/utils'

import Filters from '../_components/Filters.vue'

export default defineComponent({
	name: 'SearchLayout',
})
</script>
<script lang="ts" setup>
interface IProps {
	class?: string
	contentClass?: string
	loading?: boolean
	priceRange: [number, number]
}
const props = defineProps<IProps>()
const emit = defineEmits(['update'])
</script>
