<template>
	<div class="h-full flex flex-col animate-pulse select-none">
		<!-- Banner placeholder -->
		<div class="h-32 w-full bg-stone-200/90 rounded-t-2xl relative shrink-0" />

		<!-- Content Card -->
		<div
			class="relative min-h-32 bg-white px-4 py-3 rounded-b-2xl mx-auto flex flex-col max-w-full w-full grow shadow-sm"
		>
			<!-- Overlapping Avatar -->
			<div
				class="-mt-14 w-24 h-24 rounded-full border-4 border-white mb-2 bg-stone-200 shrink-0"
			/>

			<!-- Studio Name -->
			<div class="h-5 w-1/2 bg-stone-200 rounded mb-2" />

			<!-- Location -->
			<div class="h-3.5 w-1/3 bg-stone-200/70 rounded mb-3" />

			<!-- Bio lines -->
			<div class="space-y-1.5">
				<div class="h-3 w-full bg-stone-200/60 rounded" />
				<div class="h-3 w-4/5 bg-stone-200/60 rounded" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Skeleton representation of StudioCard
</script>

