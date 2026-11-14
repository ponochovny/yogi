<template>
	<div class="h-full flex flex-col animate-pulse select-none">
		<!-- Image placeholder -->
		<div class="h-32 w-full bg-stone-200/90 rounded-2xl shrink-0" />

		<!-- Floating Card -->
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-2xl -mt-4 w-[95%] mx-auto shadow-sm flex flex-col justify-between grow"
		>
			<div>
				<!-- Category / Activity tag -->
				<div class="flex items-center gap-1.5 mb-2">
					<div class="h-3.5 w-14 bg-stone-200 rounded" />
					<span class="text-stone-300 text-xs">•</span>
					<div class="h-3.5 w-20 bg-stone-200 rounded" />
				</div>

				<!-- Title line -->
				<div class="h-4 w-4/5 bg-stone-200 rounded mb-2.5" />

				<!-- Date string -->
				<div class="h-3.5 w-1/2 bg-stone-200/70 rounded mb-2" />

				<!-- Location -->
				<div class="h-3 w-3/5 bg-stone-200/60 rounded mb-3" />
			</div>

			<!-- Studio & Price footer -->
			<div class="flex items-center justify-between pt-2 border-t border-stone-100">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-full bg-stone-200 shrink-0" />
					<div class="h-3 w-20 bg-stone-200 rounded" />
				</div>
				<div class="h-5 w-14 bg-orange-100/70 rounded-full" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Skeleton representation of OfferingCard
</script>

