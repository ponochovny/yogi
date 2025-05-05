<template>
	<div>
		<p class="font-bold md:text-3xl text-2xl md:mb-12 mb-8">
			{{ title }}
		</p>
		<SwiperBlock
			:length="studios?.data.length"
			classSlideContainer="overflow-hidden rounded-2xl"
		>
			<SwiperSlide
				v-for="studio of studios?.data"
				:key="studio?.id"
				class="xl:min-w-[405px] xl:max-w-[405px] min-w-[305px] max-w-[305px]"
			>
				<StudioCard :studio="studio" />
			</SwiperSlide>
		</SwiperBlock>
		<MainNoContent
			v-if="!studios?.data.length"
			title="There are no corresponding studios"
			text="Here you may find Studios & Event Hosts"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CardsSlider',
})
</script>
<script lang="ts" setup>
interface Props {
	title: string
	studios?: { data: any[] }
}

defineProps<Props>()
</script>
