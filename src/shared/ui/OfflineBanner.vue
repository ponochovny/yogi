<template>
	<div
		role="status"
		aria-live="polite"
		class="offline-banner-grid"
		:class="{ 'is-visible': isVisible }"
	>
		<div class="min-h-0 overflow-hidden">
			<div
				class="w-full border-b px-4 py-2.5 transition-colors duration-200 sm:px-6"
				:class="
					status === 'offline'
						? 'border-amber-600/30 bg-amber-500 text-amber-950'
						: 'border-emerald-700/30 bg-emerald-600 text-white'
				"
			>
				<div class="mx-auto flex max-w-screen-xl items-center justify-between gap-3 text-sm">
					<div class="flex min-w-0 items-center gap-2.5">
						<span
							class="flex shrink-0 items-center justify-center rounded-full p-1"
							:class="
								status === 'offline'
									? 'bg-amber-600/20 text-amber-950'
									: 'bg-emerald-700/50 text-white'
							"
						>
							<WifiOff v-if="status === 'offline'" class="h-4 w-4 animate-pulse" />
							<Wifi v-else class="h-4 w-4" />
						</span>
						<p class="truncate font-medium">
							{{ status === 'offline' ? offlineText : onlineText }}
						</p>
					</div>

					<div class="flex shrink-0 items-center gap-2">
						<button
							v-if="status === 'offline'"
							type="button"
							class="inline-flex items-center gap-1.5 rounded bg-amber-950/10 px-2.5 py-1 text-xs font-semibold text-amber-950 transition hover:bg-amber-950/20 active:scale-95 disabled:opacity-50"
							:disabled="isChecking"
							@click="checkConnection"
						>
							<RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isChecking }" />
							<span class="hidden sm:inline">{{ retryText }}</span>
						</button>

						<button
							v-if="dismissible"
							type="button"
							aria-label="Dismiss offline banner"
							class="rounded p-1 opacity-80 transition hover:opacity-100"
							:class="
								status === 'offline'
									? 'text-amber-950 hover:bg-amber-950/10'
									: 'text-white hover:bg-white/10'
							"
							@click="isDismissed = true"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useOnline } from '@vueuse/core'
import { RefreshCw, Wifi, WifiOff, X } from 'lucide-vue-next'

interface Props {
	offlineText?: string
	onlineText?: string
	retryText?: string
	dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	offlineText: 'Вы находитесь в офлайн-режиме. Доступны сохранённые страницы и данные кэша.',
	onlineText: 'Подключение к интернету восстановлено.',
	retryText: 'Проверить сеть',
	dismissible: true,
})

const isOnline = useOnline()
const isMounted = ref(false)
const wasOffline = ref(false)
const showRestored = ref(false)
const isDismissed = ref(false)
const isChecking = ref(false)

let restoreTimer: ReturnType<typeof setTimeout> | null = null

const status = computed<'offline' | 'online'>(() => (!isOnline.value ? 'offline' : 'online'))

const isVisible = computed(() => {
	if (!isMounted.value) return false
	if (!isOnline.value && !isDismissed.value) return true
	if (showRestored.value) return true
	return false
})

watch(isOnline, (online) => {
	if (!online) {
		wasOffline.value = true
		showRestored.value = false
		isDismissed.value = false
		if (restoreTimer) clearTimeout(restoreTimer)
	} else if (wasOffline.value) {
		showRestored.value = true
		if (restoreTimer) clearTimeout(restoreTimer)
		restoreTimer = setTimeout(() => {
			showRestored.value = false
			wasOffline.value = false
		}, 3500)
	}
})

const checkConnection = async () => {
	isChecking.value = true
	try {
		const res = await fetch('/logoBg.svg?t=' + Date.now(), {
			method: 'HEAD',
			cache: 'no-store',
		})
		if (res.ok) {
			isDismissed.value = false
		}
	} catch {
		// Network request failed - still offline
	} finally {
		isChecking.value = false
	}
}

onMounted(() => {
	isMounted.value = true
	if (!isOnline.value) {
		wasOffline.value = true
	}
})

onBeforeUnmount(() => {
	if (restoreTimer) clearTimeout(restoreTimer)
})
</script>

<style scoped>
.offline-banner-grid {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.offline-banner-grid.is-visible {
	grid-template-rows: 1fr;
}
</style>

