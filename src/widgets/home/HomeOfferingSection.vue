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
						class="min-w-[300px] max-w-[300px] shrink-0"
					>
						<OfferingCardSkeleton />
					</div>
				</div>
			</div>
		</div>

		<!-- Loaded Content Carousel -->
		<div v-else-if="offerings && offerings.length">
			<SwiperBlockV2
				:length="offerings.length"
				classSlideContainer="overflow-hidden rounded-2xl"
			>
				<swiper-slide
					v-for="offering of offerings"
					:key="offering?.id"
					class="min-w-[300px] max-w-[300px]"
				>
					<OfferingCard
						:offering="offering"
						class="min-w-[300px] max-w-[300px]"
					/>
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
import type { TOffering } from '~/src/app/types/offering'
import { OfferingCard, OfferingCardSkeleton } from '~/src/entities/offering'

interface Props {
	title: string
	viewAllLink?: string
	viewAllText?: string
	offerings?: TOffering[]
	pending?: boolean
	emptyTitle?: string
	emptyText?: string
	skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
	viewAllLink: undefined,
	viewAllText: 'See all',
	offerings: () => [],
	pending: false,
	emptyTitle: 'There are no corresponding offerings',
	emptyText: 'Check back soon for new offerings in this category',
	skeletonCount: 4,
})
</script>

