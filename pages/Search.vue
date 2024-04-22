<template>
	<SearchContainer @update="updated">
		<div class="py-10 px-6">Search Page</div>
	</SearchContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DATA_TYPES } from '~/helpers/constants'
import type { ISearchParams } from '~/helpers/types/search'

export default defineComponent({
	name: 'SearchPage',
})
</script>
<script lang="ts" setup>
const filters = reactive<ISearchParams>({
	activeType: DATA_TYPES[0],
	categories: [],
	types: [],
	date: {
		start: undefined,
		end: undefined,
	},
})
function updated(data: any) {
	if (JSON.stringify(data) !== JSON.stringify(filters)) {
		console.log('updated', data)
		filters.activeType = data.activeType
		filters.categories = data.categories
		filters.types = data.types
	}
}
</script>
