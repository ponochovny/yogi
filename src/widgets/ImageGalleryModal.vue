<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white select-none backdrop-blur-md"
				tabindex="-1"
				role="dialog"
				aria-modal="true"
				@click.self="closeModal"
			>
				<!-- Top Bar: Title, Counter & Close Button -->
				<div
					class="relative z-20 shrink-0 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/80 to-transparent"
				>
					<div class="flex items-center gap-3">
						<span class="text-sm sm:text-base font-medium text-white/90">
							{{ currentIndex + 1 }} / {{ images.length }}
						</span>
						<span
							v-if="title"
							class="hidden sm:inline-block text-sm text-white/60 truncate max-w-md"
						>
							• {{ title }}
						</span>
					</div>
					<button
						type="button"
						@click="closeModal"
						class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none"
						aria-label="Close gallery"
					>
						<XMarkIcon class="w-6 h-6 stroke-2" />
					</button>
				</div>

				<!-- Main Image Area -->
				<div
					class="relative flex-1 min-h-0 w-full flex items-center justify-center px-2 sm:px-16 py-2 overflow-hidden"
					@click.self="closeModal"
					@touchstart="onTouchStart"
					@touchend="onTouchEnd"
				>
					<!-- Previous Button -->
					<button
						v-if="images.length > 1"
						type="button"
						@click.stop="prevImage"
						class="absolute left-3 sm:left-8 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
						aria-label="Previous photo"
					>
						<ChevronLeftIcon class="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
					</button>

					<!-- Image Display with Out-In Transition -->
					<div
						class="relative flex items-center justify-center w-full h-full max-w-full max-h-full min-h-0"
						@click.self="closeModal"
					>
						<Transition
							mode="out-in"
							enter-active-class="transition duration-200 ease-out"
							enter-from-class="opacity-0 scale-95"
							enter-to-class="opacity-100 scale-100"
							leave-active-class="transition duration-150 ease-in"
							leave-from-class="opacity-100 scale-100"
							leave-to-class="opacity-0 scale-95"
						>
							<div
								:key="currentIndex"
								class="flex items-center justify-center w-full h-full max-w-full max-h-full min-h-0"
								@click.self="closeModal"
							>
								<NuxtImg
									v-if="currentImage?.url"
									:src="currentImage.url"
									:alt="title || `Photo ${currentIndex + 1}`"
									class="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
									:provider="currentImage.url ? 'cloudinary' : undefined"
									placeholder="/img/banner-placeholder2.jpeg"
									format="webp"
									sizes="600px sm:900px md:1600px"
								/>
							</div>
						</Transition>
					</div>

					<!-- Next Button -->
					<button
						v-if="images.length > 1"
						type="button"
						@click.stop="nextImage"
						class="absolute right-3 sm:right-8 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
						aria-label="Next photo"
					>
						<ChevronRightIcon class="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
					</button>
				</div>

				<!-- Bottom Area: Thumbnails Strip -->
				<div
					v-if="images.length > 1"
					class="relative z-20 shrink-0 w-full bg-black/60 border-t border-white/10 py-2 sm:py-3 px-4 backdrop-blur-md flex justify-center"
				>
					<div
						ref="thumbnailsContainer"
						class="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-5xl py-1 px-2 scrollbar-none"
					>
						<button
							v-for="(img, idx) in images"
							:key="img.id || idx"
							:ref="(el) => setThumbRef(el, idx)"
							type="button"
							@click="selectImage(idx)"
							class="relative shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none bg-neutral-800"
							:class="[
								idx === currentIndex
									? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-black scale-105 opacity-100'
									: 'opacity-40 hover:opacity-85 scale-95 hover:scale-100',
							]"
							:aria-label="`Select photo ${idx + 1}`"
						>
							<NuxtImg
								:src="img.url"
								:alt="`Thumbnail ${idx + 1}`"
								class="w-full h-full object-cover"
								:provider="img.url ? 'cloudinary' : undefined"
								placeholder="/img/banner-placeholder2.jpeg"
								format="webp"
								sizes="80px sm:120px"
							/>
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import {
	XMarkIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@heroicons/vue/24/outline'

interface IProps {
	isOpen: boolean
	images: { id?: string; url: string }[]
	initialIndex?: number
	title?: string
}

const props = withDefaults(defineProps<IProps>(), {
	initialIndex: 0,
	title: '',
})

const emit = defineEmits<{
	(e: 'update:isOpen', value: boolean): void
	(e: 'close'): void
}>()

const currentIndex = ref(props.initialIndex)
const thumbnailRefs = ref<(HTMLElement | null)[]>([])
const thumbnailsContainer = ref<HTMLElement | null>(null)

const currentImage = computed(() => {
	if (!props.images.length) return null
	return props.images[currentIndex.value] || props.images[0]
})

const setThumbRef = (el: any, idx: number) => {
	thumbnailRefs.value[idx] = el as HTMLElement | null
}

const closeModal = () => {
	emit('update:isOpen', false)
	emit('close')
}

const prevImage = () => {
	if (props.images.length <= 1) return
	currentIndex.value =
		(currentIndex.value - 1 + props.images.length) % props.images.length
}

const nextImage = () => {
	if (props.images.length <= 1) return
	currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const selectImage = (idx: number) => {
	currentIndex.value = idx
}

const scrollActiveThumbIntoView = () => {
	nextTick(() => {
		const el = thumbnailRefs.value[currentIndex.value]
		el?.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest',
		})
	})
}

watch(currentIndex, () => {
	scrollActiveThumbIntoView()
})

watch(
	() => props.isOpen,
	(val) => {
		if (val) {
			currentIndex.value = props.initialIndex || 0
			scrollActiveThumbIntoView()
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'hidden'
			}
		} else {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = ''
			}
		}
	}
)

watch(
	() => props.initialIndex,
	(val) => {
		currentIndex.value = val || 0
	}
)

// Keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
	if (!props.isOpen) return
	if (e.key === 'Escape') {
		closeModal()
	} else if (e.key === 'ArrowLeft') {
		prevImage()
	} else if (e.key === 'ArrowRight') {
		nextImage()
	}
}

// Touch swipe navigation
let touchStartX = 0
let touchEndX = 0

const onTouchStart = (e: TouchEvent) => {
	touchStartX = e.changedTouches[0]?.screenX || 0
}

const onTouchEnd = (e: TouchEvent) => {
	touchEndX = e.changedTouches[0]?.screenX || 0
	const diff = touchStartX - touchEndX
	if (Math.abs(diff) > 50) {
		if (diff > 0) {
			nextImage()
		} else {
			prevImage()
		}
	}
}

onMounted(() => {
	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', handleKeyDown)
	}
})

onUnmounted(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('keydown', handleKeyDown)
	}
	if (typeof document !== 'undefined') {
		document.body.style.overflow = ''
	}
})
</script>

