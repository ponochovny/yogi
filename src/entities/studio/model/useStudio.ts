import type { TMarker } from '~/src/app/types/map'
import type { TStudio } from '~/src/app/types/studio'

export interface IStudioFormData {
	name: string
	location: TMarker | null
	timezone: string
	currency: string
	categories: string[]
	types: string[]
	bio: string
	mission: string
	mediaFiles: {
		logo: any
		banner: any
	}
	practitioners: {
		name: string
		profileImage: string
		id: string
	}[]
}

export const useStudio = () => {
	const createStudio = (data: IStudioFormData) => {
		const form = new FormData()

		const { mediaFiles, practitioners, location, ...rest } = data

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner.id)
		}
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}
		if (data.mediaFiles.banner) {
			form.append('banner', data.mediaFiles.banner)
		}
		if (location) {
			form.append('location', JSON.stringify(location))
		}

		return useFetchApi('/api/studios', {
			method: 'POST',
			body: form,
		})
	}

	const updateStudio = (data: IStudioFormData, studioId: string) => {
		const form = new FormData()

		const { mediaFiles, practitioners, location, ...rest } = data

		form.append('studio_id', studioId)

		Object.keys(rest).map((key: string) => {
			// @ts-ignore
			form.append(key, data[key])
		})
		for (const practitioner of practitioners) {
			form.append('practitioners[]', practitioner.id)
		}
		if (data.mediaFiles.logo) {
			form.append('logo', data.mediaFiles.logo)
		}
		if (data.mediaFiles.banner) {
			form.append('banner', data.mediaFiles.banner)
		}
		if (location) {
			form.append('location', JSON.stringify(location))
		}

		return useFetchApi('/api/studios/update', {
			method: 'POST',
			body: form,
		})
	}

	const toggleArchiveStudio = (studioId: string, val: boolean) => {
		const res = confirm(
			`Are you really want to ${
				val ? 'archive' : 'unarchive'
			} this studio? ${val}`
		)
		if (!res) return
		return useFetchApi('/api/studios/archive/' + studioId, {
			method: 'DELETE',
			body: {
				isArchived: val,
			},
		})
	}

	const getStudios = (queries?: string) => {
		return useFetchApi<{ data: TStudio[] }>(
			`/api/studios${queries ? '?' + queries : ''}`
		)
	}

	const getAdminStudios = (queries?: string) => {
		return useFetchApi<{ data: TStudio[] }>(
			`/api/admin/studios${queries ? '?' + queries : ''}`
		)
	}

	interface GetStudiosOptions {
		isLazy?: boolean
		key?: string
	}

	const getStudiosOpen = (
		queries?: string,
		optionsOrLazy?: boolean | GetStudiosOptions
	) => {
		const uri = `/api/studios${queries ? '?' + queries : ''}`
		const isLazy =
			typeof optionsOrLazy === 'boolean'
				? optionsOrLazy
				: optionsOrLazy?.isLazy ?? false
		const key =
			typeof optionsOrLazy === 'object' && optionsOrLazy?.key
				? optionsOrLazy.key
				: `studios-${queries || 'all'}`

		const fetchFn = isLazy ? useLazyFetch : useFetch
		return fetchFn<{ data: TStudio[] }>(uri, {
			key,
			getCachedData: (k, nuxtApp) =>
				nuxtApp.payload.data[k] || nuxtApp.static.data[k],
		})
	}

	return {
		createStudio,
		updateStudio,
		getStudios,
		getAdminStudios,
		getStudiosOpen,
		toggleArchiveStudio,
	}
}

