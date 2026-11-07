import { ref, computed } from 'vue'

const BANNER_PLACEHOLDER = '/img/banner-placeholder2.jpeg'
const LOGO_PLACEHOLDER = '/img/logo-placeholder.png'

type ImageType = 'banner' | 'logo'

interface ImageFallbackResult {
	src: ReturnType<typeof computed<string>>
	provider: ReturnType<typeof computed<'cloudinary' | undefined>>
	onError: () => void
}

/**
 * Shared composable for card images with automatic fallback on error.
 * Handles Cloudinary provider toggle and placeholder swapping.
 *
 * @param getUrl  Reactive getter returning the original URL (or null/undefined)
 * @param type    'banner' or 'logo' — determines which placeholder is used
 */
export function useImageFallback(
	getUrl: () => string | null | undefined,
	type: ImageType,
): ImageFallbackResult {
	const hasError = ref(false)

	const placeholder = type === 'logo' ? LOGO_PLACEHOLDER : BANNER_PLACEHOLDER

	const src = computed<string>(() => {
		if (hasError.value || !getUrl()) return placeholder
		return getUrl() as string
	})

	const provider = computed<'cloudinary' | undefined>(() => {
		if (hasError.value || !getUrl()) return undefined
		return 'cloudinary'
	})

	const onError = () => {
		hasError.value = true
	}

	return { src, provider, onError }
}

