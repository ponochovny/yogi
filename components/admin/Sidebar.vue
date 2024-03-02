<template>
	<div class="flex flex-col pt-7">
		<NuxtLink
			v-for="item of props.menuItems"
			:key="item.name"
			class="flex gap-3 items-center pl-4 pr-5 py-2"
			:to="item.link"
			active-class="border-l-4 border-orange-300"
		>
			<component :is="item.icon" class="w-7 stroke-1" />
			<span class="font-semibold">{{ item.name }}</span>
		</NuxtLink>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PencilSquareIcon, SparklesIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
	name: 'Sidebar',
	components: {
		PencilSquareIcon,
		SparklesIcon,
	},
})
</script>
<script lang="ts" setup>
interface IProps {
	menuItems: {
		name: string
		icon: any
		link: string
	}[]
}
const props = defineProps<IProps>()
</script>
