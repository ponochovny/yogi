<template>
	<section class="flex flex-col">
		<div class="flex items-center justify-between mb-6 md:mb-8">
			<h2 class="font-bold text-2xl md:text-3xl text-foreground">
				{{ title }}
			</h2>
			<NuxtLink
				v-if="viewAllLink"
				:to="viewAllLink"
				class="group flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
			>
				<span>{{ viewAllText }}</span>
				<ChevronRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
			</NuxtLink>
		</div>

		<!-- Loading Skeleton State -->
		<div v-if="pending" class="-mx-3 sm:-mx-5">
			<div class="relative w-full px-2 sm:px-5">
				<div class="flex gap-2.5 sm:gap-6 overflow-hidden rounded-2xl">
					<div
						v-for="index in skeletonCount"
						:key="index"
						class="xl:min-w-[405px] xl:max-w-[405px] min-w-[305px] max-w-[305px] shrink-0"
					>
						<StudioCardSkeleton />
					</div>
				</div>
			</div>
		</div>

		<!-- Loaded Content Carousel -->
		<div v-else-if="studios && studios.length">
			<SwiperBlockV2
				:length="studios.length"
				classSlideContainer="overflow-hidden rounded-2xl"
			>
				<swiper-slide
					v-for="studio of studios"
					:key="studio?.id"
					class="xl:min-w-[405px] xl:max-w-[405px] min-w-[305px] max-w-[305px]"
				>
					<StudioCard :studio="studio" />
				</swiper-slide>
			</SwiperBlockV2>
		</div>

		<!-- Empty State -->
		<MainNoContent
			v-else
			:title="emptyTitle"
			:text="emptyText"
		/>
	</section>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { TStudio } from '~/src/app/types/studio'
import { StudioCard, StudioCardSkeleton } from '~/src/entities/studio'

interface Props {
	title?: string
	viewAllLink?: string
	viewAllText?: string
	studios?: TStudio[]
	pending?: boolean
	emptyTitle?: string
	emptyText?: string
	skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
	title: 'Studios & Event Hosts',
	viewAllLink: undefined,
	viewAllText: 'See all',
	studios: () => [],
	pending: false,
	emptyTitle: 'There are no corresponding studios',
	emptyText: 'Here you may find Studios & Event Hosts',
	skeletonCount: 3,
})
</script>

